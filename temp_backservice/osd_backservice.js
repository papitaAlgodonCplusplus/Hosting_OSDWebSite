const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // For TraceIdentifier

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Production
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// // Development
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'osdlogic',
//   password: 'sapwd2023',
//   port: 5432
// });

const createWebBaseEvent = (body, sessionKey = null, securityToken = null, action = 'Response') => ({
  Body: body,
  TraceIdentifier: uuidv4(),
  Type: 'Response',
  Action: action,
  Date: new Date().toISOString(),
  ApplicationIdentifier: 'YourAppID',
  SessionKey: sessionKey,
  SecurityToken: securityToken,
});

app.post('/api/control/connect', async (req, res) => {
  try {
    // Optional: Check database connection
    await pool.query('SELECT 1');

    res.status(200).json({
      success: true,
      message: 'API connection successful',
      timestamp: new Date().toISOString(),
    });

    console.log('✅ API connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

// Unified Event Handler
app.post('/api/events/processOSDEvent', async (req, res) => {
  console.log('📡 Processing OSD Event');
  const event = req.body;
  const action = event.Body?.Action;
  console.log(`🔔 Body: ${JSON.stringify(event.Body, null, 2)} Action: ${action}`);
  try {
    switch (action) {
      case 'UserLogin':
        await handleUserLogin(event, res);
        break;

      case 'RegisterUser':
      case 'RegisterCustomer':
        await handleUserRegistration(event, res);
        break;

      case 'GetFreeProfessionals':
        await handleGetFreeProfessionals(event, res);
        break;

      case 'GetSubscribers':
        await handleGetSubscribers(event, res);
        console.log('📧 GetSubscribers event processed');
        break;

      case 'GetStudentsByCourse':
        await handleGetStudentsByCourse(event, res);
        break;

      case 'GetCourseByUserId':
        await handleGetCourseByUserId(event, res);
        break;

      case 'RegisterProfessor':
        await handleProfessorRegistration(event, res);
        break;

      case 'UpdateStudentRecords':
        await handleUpdateStudentRecords(event, res);
        break;

      default:
        res.status(400).json(createWebBaseEvent({
          SUCCESS: false,
          MESSAGE: `Invalid event action: ${action}`
        }, event.SessionKey, event.SecurityToken));
        console.warn(`⚠️ Unrecognized action: ${action}`);
        break;
    }
  } catch (error) {
    console.error(`❌ Error processing action '${action}':`, error);
    res.status(500).json(createWebBaseEvent({
      SUCCESS: false,
      MESSAGE: `Server error while processing action: ${action}`
    }, event.SessionKey, event.SecurityToken));
  }
});

app.post('/api/check-approval', async (req, res) => {
  try {
    const { email, course_id } = req.body;
    console.log(`🔍 Checking approval for email: ${email} and course_id: ${course_id}`);
    if (!email || !course_id) {
      return res.status(400).json({
        success: false,
        message: 'Email and course_id are required.'
      });
    }

    const approvalQuery = `
      SELECT sr.*
      FROM student_records sr
      INNER JOIN osduser u ON sr.user_id = u.id
      WHERE u.email = $1
        AND sr.course_id = $2
        AND sr.status = 'Approved'
    `;

    const result = await pool.query(approvalQuery, [email, course_id]);
    if (result.rows.length === 0) {
      console.log('❌ User is not approved for this course.');
      return res.status(200).json({
        approved: false,
        message: 'User is not approved for the selected course.'
      });
    }

    console.log('✅ User is approved for this course.');
    return res.status(200).json({
      approved: true,
      message: 'User is approved for the selected course.'
    });

  } catch (error) {
    console.error('❌ Error checking course approval:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while checking course approval.'
    });
  }
});

const handleUserLogin = async (event, res) => {
  const email = event.Body?.Email;
  const password = event.Body?.Password;

  console.log(`🔑 Attempting login for email: ${email}`);

  if (!email || !password) {
    return res.status(400).json(createWebBaseEvent({
      LOGIN_SUCCESS: false,
      LOGIN_RESULT_MESSAGE: 'Email and password are required.'
    }, event.SessionKey, event.SecurityToken, 'UserLogin'));
  }

  // ⚠️ Passwords should be hashed in production!
  // Include a JOIN to get the account type from the "accounttype" table.
  const userQuery = await pool.query(
    `
    SELECT u.*,
           at.type AS account_type
      FROM osduser u
      LEFT JOIN accounttype at ON u.accounttype = at.id
     WHERE u.email = $1
       AND u.password = $2
    `,
    [email, password]
  );

  if (userQuery.rows.length === 0) {
    return res.status(401).json(
      createWebBaseEvent(
        {
          LOGIN_SUCCESS: false,
          LOGIN_RESULT_MESSAGE: 'Invalid email or password.',
        },
        event.SessionKey,
        event.SecurityToken,
        'UserLogin'
      )
    );
  }

  const user = userQuery.rows[0];
  const sessionKey = uuidv4();

  res.status(200).json(
    createWebBaseEvent(
      {
        LOGIN_SUCCESS: true,
        LOGIN_RESULT_MESSAGE: 'Login successful.',
        USER_INFO: {
          Id: user.id,
          email: user.email,
          name: user.name,
          Isauthorized: user.isauthorized,
          isadmin: user.isadmin,
          AccountType: user.account_type,
        },
      },
      sessionKey,
      event.SecurityToken,
      'UserLogin'
    )
  );
};

const handleUpdateStudentRecords = async (event, res) => {
  try {
    const studentName = event.Body?.StudentName;
    const studentAttendance = event.Body?.StudentAttendance;
    const studentGrade = event.Body?.StudentGrade;
    const studentStatus = event.Body?.StudentStatus;

    console.log(`🔄 Updating record for student: ${studentName}`);

    // Validate required fields
    if (!studentName || studentAttendance === undefined || !studentGrade || !studentStatus) {
      return res.status(400).json({
        success: false,
        message: 'StudentName, StudentAttendance, StudentGrade, and StudentStatus are required.'
      });
    }

    // Check if the student exists
    const studentQuery = await pool.query(
      `SELECT id FROM student_records WHERE name = $1`,
      [studentName]
    );

    if (studentQuery.rows.length === 0) {
      console.log('❌ Student not found.');
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    const studentId = studentQuery.rows[0].id;

    // Update student record
    const updateQuery = `
      UPDATE student_records
      SET assistance = $1,
          calification = $2,
          status = $3,
          date = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, assistance, calification, status, date;
    `;

    const updateResult = await pool.query(updateQuery, [
      studentAttendance,
      studentGrade,
      studentStatus,
      studentId
    ]);

    console.log('✅ Student record updated successfully.');

    return res.status(200).json({
      success: true,
      message: 'Student record updated successfully.',
      data: updateResult.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating student record:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating student record.'
    });
  }
};

const handleProfessorRegistration = async (event, res) => {
  try {
    const accountForm = event.Body?.AccountForm;
    const personalForm = event.Body?.PersonalForm;

    const userEmail = personalForm?.email;
    const courseId = accountForm?.course;
    const workspaceId = accountForm?.workspace; // FreeProfessionalTypeId to update

    console.log(`📚 Registering professor with email: ${userEmail} for course ID: ${courseId}`);

    // Validate required fields
    if (!userEmail || !courseId || !workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Email, course ID, and workspace ID are required for professor registration.'
      });
    }

    // Check if user exists in osduser
    const userQuery = await pool.query(
      'SELECT id FROM osduser WHERE email = $1',
      [userEmail]
    );

    if (userQuery.rows.length === 0) {
      console.log('❌ User not found.');
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const userId = userQuery.rows[0].id;

    // Check if course exists in courses table
    const courseQuery = await pool.query(
      'SELECT id FROM courses WHERE id = $1',
      [courseId]
    );

    if (courseQuery.rows.length === 0) {
      console.log('❌ Course not found.');
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // Check if professor is already assigned to this course
    const existingProfessorQuery = await pool.query(
      'SELECT * FROM professores WHERE professor_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (existingProfessorQuery.rows.length > 0) {
      console.log('⚠️ Professor is already assigned to this course.');
      return res.status(400).json({
        success: false,
        message: 'Professor is already assigned to this course.'
      });
    }

    // Insert into professores table
    const insertProfessorQuery = `
      INSERT INTO professores (id, professor_id, course_id, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, professor_id, course_id;
    `;

    const result = await pool.query(insertProfessorQuery, [
      uuidv4(),
      userId,
      courseId
    ]);

    console.log('✅ Professor successfully registered for the course.');

    // Update the freeprofessionaltypeid in the freeprofessional table
    const updateFreeProfessionalQuery = `
      UPDATE freeprofessional
      SET freeprofessionaltypeid = $1
      WHERE userid = $2
      RETURNING id, freeprofessionaltypeid;
    `;

    const updateResult = await pool.query(updateFreeProfessionalQuery, [
      workspaceId,
      userId
    ]);

    if (updateResult.rows.length === 0) {
      console.warn('⚠️ No freeprofessional record found to update.');
    } else {
      console.log('✅ FreeProfessionalTypeId updated in freeprofessional table.');
    }

    return res.status(201).json({
      success: true,
      message: 'Professor successfully registered and FreeProfessionalType updated.',
      data: {
        professor: result.rows[0],
        freeProfessionalUpdate: updateResult.rows[0] || null
      }
    });

  } catch (error) {
    console.error('❌ Error registering professor:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while registering professor.'
    });
  }
};

const handleUserRegistration = async (event, res) => {
  try {
    const accountForm = event.Body?.AccountForm;
    const personalForm = event.Body?.PersonalForm;

    // Check required fields
    if (!personalForm?.email || !personalForm?.password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required for registration.'
      });
    }

    // See if user exists by email
    const userExists = await pool.query(
      'SELECT * FROM osduser WHERE email = $1',
      [personalForm.email]
    );

    let userId;

    // If user does not exist, create it
    if (userExists.rows.length === 0) {
      userId = uuidv4();

      const accountTypeResult = await pool.query(
        'SELECT id FROM accounttype WHERE type = $1',
        [event.Body?.AccountType]
      );

      if (accountTypeResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Unknown account type: ${event.Body?.AccountType}`
        });
      }
      const accountTypeId = accountTypeResult.rows[0].id;

      const insertOsdUserQuery = `
        INSERT INTO osduser (
          id, code, accounttype, identity, name, firstsurname, middlesurname, city,
          companyname, address, zipcode, country, landline, mobilephone, email, password, web,
          isauthorized, isadmin
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        )
        RETURNING id;
      `;

      console.log('🔐 Inserting user into osduser:', personalForm);

      const osdUserResult = await pool.query(insertOsdUserQuery, [
        userId,
        `${personalForm.country}/IT/1/2025`,
        accountTypeId,
        personalForm.identity,
        personalForm.companyName,
        personalForm.firstSurname,
        personalForm.middleSurname,
        personalForm.city,
        personalForm.companyName || '',
        personalForm.address,
        personalForm.zipCode,
        personalForm.country,
        personalForm.landline || '',
        personalForm.mobilePhone,
        personalForm.email,
        personalForm.password,
        personalForm.web,
        true,
        false
      ]);

      userId = osdUserResult.rows[0].id;
    } else {
      userId = userExists.rows[0].id;
      console.log('✅ User already exists in osduser with ID:', userId);
    }

    // Insert courses/modules if provided
    if (Array.isArray(personalForm.courses) && personalForm.courses.length > 0) {
      for (const course of personalForm.courses) {
        const courseId = uuidv4();
        const insertCourseQuery = `
          INSERT INTO Courses (id, osduser_id, title, cost)
          VALUES ($1, $2, $3, $4)
        `;
        await pool.query(insertCourseQuery, [
          courseId,
          userId,
          course.courseName,
          course.cost
        ]);

        if (Array.isArray(course.modules) && course.modules.length > 0) {
          for (const module of course.modules) {
            const moduleId = uuidv4();
            const insertModuleQuery = `
              INSERT INTO Modules (id, course_id, title, duration)
              VALUES ($1, $2, $3, $4)
            `;
            await pool.query(insertModuleQuery, [
              moduleId,
              courseId,
              module.moduleName,
              module.duration
            ]);
          }
        }
      }
    }

    // Insert into freeprofessional if account type is 'FreeProfessional'
    if (event.Body?.AccountType === 'FreeProfessional') {
      const insertFreeProfessionalQuery = `
        INSERT INTO freeprofessional (
          id, userid, freeprofessionaltypeid, identificationfileid,
          identificationfilename, curriculumvitaefileid, curriculumvitaefilename,
          civilliabilityinsurancefileid, civilliabilityinsurancefilename,
          servicerates, paytpv, course_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
        RETURNING id, userid, freeprofessionaltypeid, course_id;
      `;

      await pool.query(insertFreeProfessionalQuery, [
        uuidv4(),
        userId,
        accountForm.workspace,
        accountForm.IdentificationFileId,
        accountForm.IdentificationFileName,
        accountForm.CurriculumVitaeFileId,
        accountForm.CurriculumVitaeFileName,
        accountForm.CivilLiabilityInsuranceFileId,
        accountForm.CivilLiabilityInsuranceFileName,
        accountForm.servicerates,
        accountForm.payTPV,
        accountForm.course
      ]);

      // Insert into student_records if courseCheckbox is checked
      if (accountForm.courseCheckbox === true && accountForm.course) {
        const insertStudentRecordQuery = `
          INSERT INTO student_records (
            id, name, email, phone, address, city, state, zip, country, status,
            type, notes, date, user_id, course_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending',
            'Regular', '', CURRENT_TIMESTAMP, $10, $11
          );
        `;

        console.log('📚 Inserting student record for course:', accountForm.course);

        await pool.query(insertStudentRecordQuery, [
          uuidv4(),
          personalForm.name,
          personalForm.email,
          personalForm.mobilePhone,
          personalForm.address,
          personalForm.city,
          '', // State
          personalForm.zipCode,
          personalForm.country,
          userId,
          accountForm.course
        ]);
      }

      return res.json({
        success: true,
        message: 'Your account has been created successfully!'
      });
    }

    return res.json({
      success: true,
      message: 'Your account has been created successfully!'
    });

  } catch (error) {
    console.error(`❌ Error processing action 'RegisterCustomer':`, error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`
    });
  }
};

async function handleGetFreeProfessionals(event, res) {
  try {
    const result = await pool.query(`
      SELECT
        fp.id,
        fp.userid,
        fp.freeprofessionaltypeid,
        fpt.acronym AS "FreeprofessionaltypeAcronym",
        fp.identificationfileid,
        fp.identificationfilename,
        fp.curriculumvitaefileid,
        fp.curriculumvitaefilename,
        fp.civilliabilityinsurancefileid,
        fp.civilliabilityinsurancefilename,
        fp.servicerates,
        fp.paytpv
      FROM freeprofessional fp
      LEFT JOIN freeprofessionaltype fpt ON fp.freeprofessionaltypeid = fpt.id
    `);

    return res.json(
      createWebBaseEvent(
        {
          GET_FREE_PROFESSIONALS_SUCCESS: true,
          ListFreeProfessionals: result.rows,
        },
        event.SessionKey,
        event.SecurityToken,
        'GetFreeProfessionals'
      )
    );
  } catch (error) {
    console.error('Error in handleGetFreeProfessionals:', error);
    return res.status(500).json(
      createWebBaseEvent(
        {
          GET_FREE_PROFESSIONALS_SUCCESS: false,
          GET_FREE_PROFESSIONALS_MESSAGE: 'Server error.',
        },
        event.SessionKey,
        event.SecurityToken,
        'GetFreeProfessionals'
      )
    );
  }
}

const handleGetCourseByUserId = async (event, res) => {
  try {
    const userId = event.Body?.UserId;

    if (!userId) {
      console.log('⚠️ User ID is required.');
      return res.status(400).json(createWebBaseEvent({
        GET_COURSE_BY_USERID_SUCCESS: false,
        GET_COURSE_BY_USERID_MESSAGE: 'User ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
    }

    console.log(`📚 Fetching course for professor with ID: ${userId}`);

    // Step 1: Fetch course IDs where the professor is teaching
    const professorCoursesQuery = `
      SELECT course_id
      FROM professores
      WHERE professor_id = $1
    `;

    const professorCoursesResult = await pool.query(professorCoursesQuery, [userId]);

    if (professorCoursesResult.rows.length === 0) {
      console.log('⚠️ No courses found for this professor.');
      return res.status(404).json(createWebBaseEvent({
        GET_COURSE_BY_USERID_SUCCESS: false,
        GET_COURSE_BY_USERID_MESSAGE: 'No courses found for this professor.',
      }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
    }

    const courseIds = professorCoursesResult.rows.map(row => row.course_id);

    // Ensure courseIds are UUID strings and properly formatted
    const formattedCourseIds = courseIds.map(id => id.trim());  // Removes spaces/newlines

    console.log(`📖 Professor is teaching courses with IDs: ${formattedCourseIds.join(', ')}`);

    // Step 2: Fetch course details (including cost) for the retrieved course IDs
    if (formattedCourseIds.length === 0) {
      console.log('⚠️ No valid course IDs found for this professor.');
      return res.status(404).json(createWebBaseEvent({
        GET_COURSE_BY_USERID_SUCCESS: false,
        GET_COURSE_BY_USERID_MESSAGE: 'No valid course IDs found for this professor.',
      }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
    }

    const courseQuery = `
      SELECT id, osduser_id, title, cost
      FROM courses
      WHERE id = ANY($1::uuid[])
    `;

    const courseResult = await pool.query(courseQuery, [formattedCourseIds]);
    console.log(`📚 Result of Query`, courseResult.rows);

    if (courseResult.rows.length === 0) {
      console.log('⚠️ No course details found for the professor’s courses.');
      return res.status(404).json(createWebBaseEvent({
        GET_COURSE_BY_USERID_SUCCESS: false,
        GET_COURSE_BY_USERID_MESSAGE: 'No course details found.',
      }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
    }

    console.log(`📖 Retrieved course details:`, courseResult.rows);

    // Step 3: Return the course details
    return res.status(200).json(createWebBaseEvent({
      GET_COURSE_BY_USERID_SUCCESS: true,
      courses: courseResult.rows
    }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));

  } catch (error) {
    console.error('❌ Error fetching course by user ID:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_COURSE_BY_USERID_SUCCESS: false,
      GET_COURSE_BY_USERID_MESSAGE: 'Server error fetching course by user ID.',
    }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
  }
};

const handleGetStudentsByCourse = async (event, res) => {
  try {
    const userId = event.Body?.Id;

    if (!userId) {
      return res.status(400).json(createWebBaseEvent({
        GET_STUDENTS_BY_COURSE_SUCCESS: false,
        GET_STUDENTS_BY_COURSE_MESSAGE: 'User ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetStudentsByCourse'));
    }

    console.log(`📚 Fetching courses taught by professor with ID: ${userId}`);

    // Step 1: Fetch course IDs where the professor is teaching
    const professorCoursesQuery = `
      SELECT course_id
      FROM professores
      WHERE professor_id = $1
    `;

    const professorCoursesResult = await pool.query(professorCoursesQuery, [userId]);

    if (professorCoursesResult.rows.length === 0) {
      console.log('⚠️ No courses found for this professor.');
      return res.status(404).json(createWebBaseEvent({
        GET_STUDENTS_BY_COURSE_SUCCESS: false,
        GET_STUDENTS_BY_COURSE_MESSAGE: 'No courses found for this professor.',
      }, event.SessionKey, event.SecurityToken, 'GetStudentsByCourse'));
    }

    const courseIds = professorCoursesResult.rows.map(row => row.course_id);

    console.log(`📖 Professor is teaching courses with IDs: ${courseIds.join(', ')}`);

    // Step 2: Fetch students enrolled in these courses
    const studentsQuery = `
      SELECT sr.*
      FROM student_records sr
      WHERE sr.course_id = ANY($1::uuid[])
    `;

    const studentsResult = await pool.query(studentsQuery, [courseIds]);

    console.log(`👨‍🎓 Found ${studentsResult.rows.length} students enrolled in professor's courses.`);

    return res.status(200).json(createWebBaseEvent({
      GET_STUDENTS_BY_COURSE_SUCCESS: true,
      students: studentsResult.rows
    }, event.SessionKey, event.SecurityToken, 'GetStudentsByCourse'));

  } catch (error) {
    console.error('❌ Error fetching students by course:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_STUDENTS_BY_COURSE_SUCCESS: false,
      GET_STUDENTS_BY_COURSE_MESSAGE: 'Server error fetching students by course.',
    }, event.SessionKey, event.SecurityToken, 'GetStudentsByCourse'));
  }
};

const handleGetSubscribers = async (event, res) => {
  try {
    res.status(200).json(createWebBaseEvent({
      GET_SUBSCRIBERS_SUCCESS: true,
    }, event.SessionKey, event.SecurityToken, 'GetSubscribers'));
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);

    res.status(500).json(createWebBaseEvent({
      GET_SUBSCRIBERS_SUCCESS: false,
      GET_SUBSCRIBERS_MESSAGE: 'Server error fetching subscribers.',
    }, event.SessionKey, event.SecurityToken, 'GetSubscribers'));
  }
};

app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM Courses');
    res.status(200).json({
      success: true,
      courses: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/api`);
});