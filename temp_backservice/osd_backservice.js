const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // For TraceIdentifier

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'osdlogic',
  password: 'sapwd2023',
  port: 5432,
});

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
          id: user.id,
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

      // 1) Retrieve the UUID of the account type by matching the `type` column
      //    with event.Body?.AccountType, e.g. "FreeProfessional", "Claimant", etc.
      const accountTypeResult = await pool.query(
        'SELECT id FROM accounttype WHERE type = $1',
        [event.Body?.AccountType] // e.g. "FreeProfessional"
      );

      if (accountTypeResult.rows.length === 0) {
        // If no match found, respond accordingly
        return res.status(400).json({
          success: false,
          message: `Unknown account type: ${event.Body?.AccountType}`
        });
      }
      const accountTypeId = accountTypeResult.rows[0].id; // a valid UUID

      // 2) Insert new user into osduser
      const insertOsdUserQuery = `
        INSERT INTO osduser (
          id,
          code,
          accounttype,
          identity,
          name,
          firstsurname,
          middlesurname,
          city,
          companyname,
          address,
          zipcode,
          country,
          landline,
          mobilephone,
          email,
          password,
          web,
          isauthorized,
          isadmin
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18, $19
        )
        RETURNING id;
      `;

      console.log('🔐 Inserting user into osduser:', personalForm.email);

      const osdUserResult = await pool.query(insertOsdUserQuery, [
        userId,
        `${personalForm.country}/IT/1/2025`, // code: adjust as needed
        accountTypeId,                      // <- use the retrieved UUID
        personalForm.identity,
        personalForm.name,
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
        true,   // isauthorized
        false   // isadmin
      ]);

      userId = osdUserResult.rows[0].id;
    } else {
      // If user already exists, reuse its ID
      userId = userExists.rows[0].id;
      console.log('✅ User already exists in osduser with ID:', userId);
    }

    // Insert courses/modules if provided
    if (Array.isArray(personalForm.courses) && personalForm.courses.length > 0) {
      for (const course of personalForm.courses) {
        const courseId = uuidv4();
        const insertCourseQuery = `
          INSERT INTO Courses (id, osduser_id, title)
          VALUES ($1, $2, $3)
        `;
        await pool.query(insertCourseQuery, [
          courseId,
          userId,
          course.courseName
        ]);

        console.log('📚 Inserting modules for course:', course.courseName);

        // Insert modules for this course
        if (Array.isArray(course.modules) && course.modules.length > 0) {
          for (const module of course.modules) {
            if (!module.moduleName || !module.duration) {
              console.error('❌ Incomplete module data:', module);
              continue;
            }
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
            console.log(`✅ Module '${module.moduleName}' inserted for course '${course.courseName}'`);
          }
        }
      }
    }

    // If AccountType is 'FreeProfessional', insert into freeprofessional
    if (event.Body?.AccountType === 'FreeProfessional') {
      const insertFreeProfessionalQuery = `
        INSERT INTO freeprofessional (
          id,
          userid,
          freeprofessionaltypeid,
          identificationfileid,
          identificationfilename,
          curriculumvitaefileid,
          curriculumvitaefilename,
          civilliabilityinsurancefileid,
          civilliabilityinsurancefilename,
          servicerates,
          paytpv,
          course_id
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12
        )
        RETURNING id, userid, freeprofessionaltypeid, course_id;
      `;

      console.log('🔐 Inserting FreeProfessional user:', personalForm.email);

      await pool.query(insertFreeProfessionalQuery, [
        uuidv4(),
        userId,
        accountForm.workspace, // e.g., freeprofessionaltypeid
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

      return res.json({
        success: true,
        message: 'Your account has been created successfully!'
      });
    }

    // Otherwise, no special handling needed
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