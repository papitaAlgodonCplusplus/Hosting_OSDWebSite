const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // For TraceIdentifier

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'osdlogic',
  password: 'sapwd2023',
  port: 5432,
});

// Helper to create WebBaseEvent
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

      default:
        // returns 400
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

const handleUserRegistration = async (event, res) => {
  const accountForm = event.Body?.AccountForm;
  const personalForm = event.Body?.PersonalForm;
  const accountTypeInput = event.Body?.AccountType || 'FreeProfessional';

  console.log('📄 Processing Registration:', accountForm, personalForm, accountTypeInput);

  if (!personalForm?.email || !personalForm?.password) {
    console.log('❌ Email and password are required for registration.');
    return res.status(400).json(createWebBaseEvent({
      REGISTER_USER_SUCCESS: false,
      REGISTER_USER_RESULT_MESSAGE: 'Email and password are required for registration.'
    }, event.SessionKey, event.SecurityToken));
  }

  const userExists = await pool.query('SELECT * FROM osduser WHERE email = $1', [personalForm.email]);
  console.log('🔍 Checking if user exists:', userExists.rows);

  if (userExists.rows.length > 0) {
    return res.json(createWebBaseEvent({
      REGISTER_USER_SUCCESS: false,
      REGISTER_USER_RESULT_MESSAGE: 'An account already exists with that email.'
    }, event.SessionKey, event.SecurityToken));
  }

  const userId = uuidv4();

  const insertUserQuery = `
    INSERT INTO osduser (
      id, code, accounttype, identity, name, firstsurname, 
      middlesurname, city, companyname, address, zipcode, country, 
      landline, mobilephone, email, password, web, isauthorized, isadmin
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
      $11, $12, $13, $14, $15, $16, $17, $18, $19
    )
    RETURNING id, email, name, country;
  `;

  console.log('🔐 Inserting user:', personalForm.email);
  await pool.query(insertUserQuery, [
    userId, `${personalForm.country}/IT/1/2025`, personalForm.accountType, personalForm.identity,
    personalForm.firstSurname, personalForm.firstSurname, personalForm.middleSurname,
    personalForm.city, personalForm.companyName || '', personalForm.address,
    personalForm.zipCode, personalForm.country, personalForm.landline || '',
    personalForm.mobilePhone, personalForm.email, personalForm.password,
    personalForm.web, true, false
  ]);
  if (Array.isArray(personalForm.courses) && personalForm.courses.length > 0) {
    for (const course of personalForm.courses) {
      const courseId = uuidv4();

      const insertCourseQuery = `
        INSERT INTO Courses (id, osduser_id, title)
        VALUES ($1, $2, $3)
      `;

      await pool.query(insertCourseQuery, [
        courseId, userId, course.courseName
      ]);

      console.log('📚 Inserting modules for course:', course);

      // Insert Modules for the current course
      if (Array.isArray(course.modules) && course.modules.length > 0) {
        for (const module of course.modules) {
          console.log('📦 Inserting module:', module);

          // Validate the module fields
          if (!module.moduleName || !module.duration) {
            console.error(`❌ Module data is incomplete:`, module);
            continue;  // Skip this module if required fields are missing
          }

          const moduleId = uuidv4();

          const insertModuleQuery = `
            INSERT INTO Modules (id, course_id, title, duration)
            VALUES ($1, $2, $3, $4)
          `;

          await pool.query(insertModuleQuery, [
            moduleId, courseId, module.moduleName, module.duration  // Changed from module.title to module.moduleName
          ]);

          console.log(`✅ Module '${module.moduleName}' inserted for course '${course.courseName}'`);
        }
      }
    }
  }

  res.json(createWebBaseEvent({
    REGISTER_USER_SUCCESS: true,
    REGISTER_USER_RESULT_MESSAGE: 'Your account has been created along with courses and modules.'
  }, event.SessionKey, event.SecurityToken));

  console.log('✅ Registration successful');
};

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/api`);
});