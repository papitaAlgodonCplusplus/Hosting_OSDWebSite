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

// Development
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

      case 'GetUserById':
        await handleGetUserById(event, res);
        break;

      case 'GettingClaims':
        await handleGetClaims(event, res);
        break;

      case 'GetProjects':
        await handleGetProjects(event, res);
        break;

      case 'GetPerformanceAssignedById':
        await HandleGetPerformanceAssignedById(event, res);
        break;

      case 'GetTransparencyReportsSubscriberClients':
        await handleGetTransparencyReportsSubscriberClients(event, res);
        break;

      case 'GetTransparencyReportsIncomeExpenses':
        await handleGetTransparencyReportsIncomeExpenses(event, res);
        break;

      case 'GetTransparencyFreeProfessionals':
        await handleGetTransparencyFreeProfessionals(event, res);
        break;

      case 'GetFreeProfessionalsByCFHId':
        await handleGetFreeProfessionalsByCFHId(event, res);
        break;

      case 'AddFreeProfessionalToCFH':
        await handleAddFreeProfessionalToCFH(event, res);
        break;

      case 'UpdateUserProfile':
        await handleUpdateUserProfile(event, res);
        break;

      case 'CreateClaim':
        await handleCreateClaim(event, res);
        break;

      case 'GetPerformancesClaimById':
        await handleGetPerformancesClaimById(event, res);
        break;

      case 'CreateClaimantAndClaimsCustomerPerformance':
        await handleCreateClaimantAndClaimsCustomerPerformance(event, res);
        break;

      case 'GetCFHReports':
        await handleGetCFHReports(event, res);
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

const handleAddFreeProfessionalToCFH = async (event, res) => {
  try {
    const { FreeProfessionalId, CfhId } = event.Body;

    if (!FreeProfessionalId || !CfhId) {
      return res.status(400).json(createWebBaseEvent({
        ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: false,
        ADD_FREE_PROFESSIONAL_TO_CFH_MESSAGE: 'FreeProfessionalId and CfhId are required.',
      }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));
    }

    console.log(`🔍 Fetching user with email: ${CfhId}`);

    const userQuery = await pool.query(
      'SELECT id FROM osduser WHERE email = $1',
      [CfhId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: false,
        ADD_FREE_PROFESSIONAL_TO_CFH_MESSAGE: 'User not found.',
      }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));
    }

    const userId = userQuery.rows[0].id;

    console.log(`🔍 Inserting FreeProfessionalId: ${FreeProfessionalId} for userId: ${userId}`);

    const updateQuery = `
      UPDATE freeprofessional
      SET cfh_id = $1
      WHERE userid = $2
      RETURNING id, userid, cfh_id;
    `;

    const updateResult = await pool.query(updateQuery, [FreeProfessionalId, userId]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: false,
        ADD_FREE_PROFESSIONAL_TO_CFH_MESSAGE: 'FreeProfessional not found or update failed.',
      }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));
    }

    console.log(`✅ FreeProfessional added to CFH successfully: ${JSON.stringify(updateResult.rows[0], null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: true,
      freeProfessional: updateResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));

  } catch (error) {
    console.error('❌ Error adding FreeProfessional to CFH:', error);

    return res.status(500).json(createWebBaseEvent({
      ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: false,
      ADD_FREE_PROFESSIONAL_TO_CFH_MESSAGE: 'Server error adding FreeProfessional to CFH.',
    }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));
  }
};

const handleGetFreeProfessionalsByCFHId = async (event, res) => {
  try {
    const cfhId = event.Body?.CfhId;

    if (!cfhId) {
      return res.status(400).json(createWebBaseEvent({
        GET_FREE_PROFESSIONALS_BY_CFHID_SUCCESS: false,
        GET_FREE_PROFESSIONALS_BY_CFHID_MESSAGE: 'CfhId is required.',
      }, event.SessionKey, event.SecurityToken, 'GetFreeProfessionalsByCFHId'));
    }

    console.log(`🔍 Fetching free professionals with CFH ID: ${cfhId}`);

    const query = `
    SELECT 
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
      course_id, 
      cfh_id
    FROM freeprofessional
    WHERE cfh_id = $1
  `;

    const result = await pool.query(query, [cfhId]);

    if (result.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_FREE_PROFESSIONALS_BY_CFHID_SUCCESS: false,
        GET_FREE_PROFESSIONALS_BY_CFHID_MESSAGE: 'No free professionals found with the specified CFH ID.',
      }, event.SessionKey, event.SecurityToken, 'GetFreeProfessionalsByCFHId'));
    }

    console.log(`📄 Retrieved free professionals: ${JSON.stringify(result.rows, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_FREE_PROFESSIONALS_BY_CFHID_SUCCESS: true,
      freeProfessionals: result.rows
    }, event.SessionKey, event.SecurityToken, 'GetFreeProfessionalsByCFHId'));

  } catch (error) {
    console.error('❌ Error fetching free professionals by CFH ID:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_FREE_PROFESSIONALS_BY_CFHID_SUCCESS: false,
      GET_FREE_PROFESSIONALS_BY_CFHID_MESSAGE: 'Server error fetching free professionals by CFH ID.',
    }, event.SessionKey, event.SecurityToken, 'GetFreeProfessionalsByCFHId'));
  }
};

const handleGetTransparencyFreeProfessionals = async (event, res) => {
};

const handleGetTransparencyReportsIncomeExpenses = async (event, res) => {
  try {
    // We will accumulate the claims in this array
    let claimList = [];

    // Prepare the "DTO" object to accumulate results
    const economicResultReportDTO = {
      Income: 0,
      ImprovementSavings: 0,
      ClaimsAmount: 0,
      CompensationClaimant: 0,
      Numberfiles: 0
    };

    console.log('⚙️ Starting handleGetTransparencyReportsIncomeExpenses with:', event);
    const { country, SubscriberId } = event.Body;
    console.log('⚙️ Starting handleGetTransparencyReportsIncomeExpenses with:', { country, SubscriberId });

    // 1) If Country is provided but SubscriberId is not:
    if (country && !SubscriberId) {
      console.log('📝 Getting all users for country:', country);

      // (1A) Get all users from osduser with the specified country
      const usersQuery = `
        SELECT id
        FROM osduser
        WHERE country = $1
      `;
      const usersResult = await pool.query(usersQuery, [country]);

      if (usersResult.rows.length > 0) {
        const osdUsers = usersResult.rows;

        // (1B) For each user, find the related subscriber(s)
        console.log(`🔎 Found ${osdUsers.length} user(s) in country: ${country}`);
        let subscriberCustomers = [];

        for (const user of osdUsers) {
          const subQuery = `
            SELECT id
            FROM subscribercustomer
            WHERE userid = $1
          `;
          const subResult = await pool.query(subQuery, [user.id]);
          if (subResult.rows.length > 0) {
            subscriberCustomers = subscriberCustomers.concat(subResult.rows);
          }
        }

        // (1C) For each subscriber, find completed claims
        if (subscriberCustomers.length > 0) {
          console.log(`🔎 Found ${subscriberCustomers.length} subscriberCustomer(s) for those users.`);
          for (const sub of subscriberCustomers) {
            const claimQuery = `
              SELECT 
                id,
                amountclaimed,
                amountpaid,
                improvementsavings
              FROM claim_file
              WHERE status = 'Completed'
                AND subscriberclaimedid = $1
            `;
            const claimResult = await pool.query(claimQuery, [sub.id]);
            if (claimResult.rows.length > 0) {
              claimList = claimList.concat(claimResult.rows);
            }
          }
        }

      }
    }
    // 2) If SubscriberId is provided (ignore Country)
    else if (SubscriberId) {
      console.log('📝 Getting all completed claims for subscriber:', SubscriberId);
      const claimQuery = `
        SELECT
          id,
          amountclaimed,
          amountpaid,
          improvementsavings
        FROM claim_file
        WHERE status = 'Completed'
          AND subscriberclaimedid = $1
      `;
      const claimResult = await pool.query(claimQuery, [SubscriberId]);
      claimList = claimResult.rows;
    }
    // 3) Otherwise, just get all completed claims
    else {
      console.log('📝 Getting all completed claims, no country/subscriber filter.');
      const claimQuery = `
        SELECT
          id,
          amountclaimed,
          amountpaid,
          improvementsavings
        FROM claim_file
        WHERE status = 'Completed'
      `;
      const claimResult = await pool.query(claimQuery);
      claimList = claimResult.rows;
    }

    console.log(`✅ Total claims found: ${claimList.length}`);

    // 4) Process each claim to accumulate the EconomicResultReportDTO
    for (const claim of claimList) {
      const improvementSavings = Number(claim.improvementsavings) || 0;

      // If improvementsavings > 100 -> 10 + ((improvementsavings - 100) * 0.10)
      // else -> 10
      if (improvementSavings > 100) {
        const additional = (improvementSavings - 100) * 0.10;
        // Round to 2 decimals
        economicResultReportDTO.Income += Number((10 + additional).toFixed(2));
      } else {
        economicResultReportDTO.Income += 10;
      }

      // improvement savings
      economicResultReportDTO.ImprovementSavings += improvementSavings;

      // amount claimed
      // caution: parse to number
      const amountClaimed = Number(claim.amountclaimed) || 0;
      economicResultReportDTO.ClaimsAmount += amountClaimed;

      // amount paid (compensation claimant)
      const amountPaid = Number(claim.amountpaid) || 0;
      economicResultReportDTO.CompensationClaimant += amountPaid;
    }

    // Number of files is length of claimList
    economicResultReportDTO.Numberfiles = claimList.length;

    // 5) Return results
    console.log('🚀 Final economicResultReportDTO:', economicResultReportDTO);

    return res.status(200).json(
      createWebBaseEvent({
        GET_REPORTS_INCOME_EXPENSES_SUCCESS: true,
        economicResultReportDTO
      },
        event.SessionKey,
        event.SecurityToken,
        'GetTransparencyReportsIncomeExpenses')
    );

  } catch (error) {
    console.error('❌ Error in handleGetTransparencyReportsIncomeExpenses:', error);

    return res.status(500).json(
      createWebBaseEvent({
        GET_REPORTS_INCOME_EXPENSES_SUCCESS: false,
        GET_REPORTS_INCOME_EXPENSES_MESSAGE: 'Server error generating transparency reports.'
      },
        event.SessionKey,
        event.SecurityToken,
        'GetTransparencyReportsIncomeExpenses')
    );
  }
};

const handleGetTransparencyReportsSubscriberClients = async (event, res) => {
  try {
    console.log('🔍 Fetching all claims from claim_file');

    const claimsQuery = `
      SELECT 
      cf.id, 
      cf.code, 
      cf.datecreated, 
      cf.status, 
      cf.subscriberclaimedid, 
      cf.claimantid, 
      cf.claimtype, 
      cf.serviceprovided, 
      cf.facts, 
      cf.amountclaimed, 
      cf.documentfile1id, 
      cf.documentfile1name, 
      cf.documentfile2id, 
      cf.documentfile2name, 
      cf.creditingdate, 
      cf.amountpaid, 
      cf.improvementsavings, 
      cf.valuationsubscriber, 
      cf.valuationclaimant, 
      cf.valuationfreeprofessionals,
      u.id AS user_id,
      u.code AS user_code,
      u.accounttype AS user_accounttype,
      u.identity AS user_identity,
      u.name AS user_name,
      u.firstsurname AS user_firstsurname,
      u.middlesurname AS user_middlesurname,
      u.city AS user_city,
      u.companyname AS user_companyname,
      u.address AS user_address,
      u.zipcode AS user_zipcode,
      u.country AS user_country,
      u.landline AS user_landline,
      u.mobilephone AS user_mobilephone,
      u.email AS user_email,
      u.password AS user_password,
      u.web AS user_web,
      u.isauthorized AS user_isauthorized,
      u.isadmin AS user_isadmin
      FROM claim_file cf
      LEFT JOIN osduser u ON cf.subscriberclaimedid = u.id
    `;

    const claimsResult = await pool.query(claimsQuery);

    if (claimsResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_CLAIMS_SUCCESS: false,
        GET_CLAIMS_MESSAGE: 'No claims found.',
      }, event.SessionKey, event.SecurityToken, 'GetClaims'));
    }

    console.log(`📄 Retrieved claims: ${JSON.stringify(claimsResult.rows, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_CLAIMS_SUCCESS: true,
      claims: claimsResult.rows
    }, event.SessionKey, event.SecurityToken, 'GetClaims'));

  } catch (error) {
    console.error('❌ Error fetching claims:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_CLAIMS_SUCCESS: false,
      GET_CLAIMS_MESSAGE: 'Server error fetching claims.',
    }, event.SessionKey, event.SecurityToken, 'GetClaims'));
  }
};

const HandleGetPerformanceAssignedById = async (event, res) => {
  try {
    const userId = event.Body?.UserId;

    if (!userId) {
      return res.status(400).json(createWebBaseEvent({
        GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: false,
        GET_PERFORMANCE_ASSIGNED_BY_ID_MESSAGE: 'User ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));
    }

    console.log(`🔍 Fetching performance assigned by ID for user with ID: ${userId}`);
    const performanceQuery = `
      SELECT id, code, projectmanagerid AS "ProjectManagerId", summarytypeid AS "SummaryTypeId", 
             start_date AS "Start_Date", end_date AS "End_Date", justifying_document AS "JustifyingDocument", 
             freeprofessionalcreatedperformanceid AS "FreeProfessionalCreatedPerformanceId", 
             freeprofessionalassignedid AS "FreeProfessionalAssignedId", 
             estimated_transport_expenses AS "EstimatedTransportExpenses", 
             estimated_transport_hours AS "EstimatedTransportHours", 
             estimated_work_hours AS "EstimatedWorkHours", 
             total_forecast_data AS "TotalForecastData", 
             justifying_document_bytes AS "JustifyingDocumentBytes"
      FROM performance_freeprofessional
      WHERE freeprofessionalassignedid = $1
    `;

    const performanceResult = await pool.query(performanceQuery, [userId]);

    if (performanceResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: false,
        GET_PERFORMANCE_ASSIGNED_BY_ID_MESSAGE: 'No performance records found for this user.',
      }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));
    }

    console.log(`📄 Retrieved performance records: ${JSON.stringify(performanceResult.rows, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: true,
      performance: performanceResult.rows
    }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));

  } catch (error) {
    console.error('❌ Error fetching performance assigned by ID:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: false,
      GET_PERFORMANCE_ASSIGNED_BY_ID_MESSAGE: 'Server error fetching performance assigned by ID.',
    }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));
  }
};

const handleGetProjects = async (event, res) => {
  try {
    console.log('🔍 Fetching all project details');

    const projectQuery = `
      SELECT id, objective AS "Objective", startdate, enddate, expensesemployeesvolunteers, 
             supplierexpensespurchases, economic_budget, hours_executed, expected_hours
      FROM projectmanager
    `;

    const projectResult = await pool.query(projectQuery);

    if (projectResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_PROJECTS_SUCCESS: false,
        GET_PROJECTS_MESSAGE: 'No projects found.',
      }, event.SessionKey, event.SecurityToken, 'GetProjects'));
    }

    console.log(`📄 Retrieved project details: ${JSON.stringify(projectResult.rows, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_PROJECTS_SUCCESS: true,
      projects: projectResult.rows
    }, event.SessionKey, event.SecurityToken, 'GetProjects'));

  } catch (error) {
    console.error('❌ Error fetching project details:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_PROJECTS_SUCCESS: false,
      GET_PROJECTS_MESSAGE: 'Server error fetching project details.',
    }, event.SessionKey, event.SecurityToken, 'GetProjects'));
  }
};

const handleGetClaims = async (event, res) => {
  try {
    const userId = event.Body?.UserId;

    if (!userId) {
      return res.status(400).json(createWebBaseEvent({
        GET_CLAIMS_SUCCESS: false,
        GET_CLAIMS_MESSAGE: 'User ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GettingClaims'));
    }

    console.log(`🔍 Fetching claims for user with ID: ${userId}`);

    const claimsQuery = `
      SELECT cf.*, u.accounttype, u.identity, u.name, u.firstsurname, u.middlesurname, u.city, 
         u.companyname, u.address, u.zipcode, u.country, u.landline, u.mobilephone, u.email, 
         u.password, u.web, u.isauthorized, u.isadmin
      FROM claim_file cf
      LEFT JOIN osduser u ON cf.subscriberclaimedid = u.id
      WHERE cf.claimantid = $1
    `;

    const claimsResult = await pool.query(claimsQuery, [userId]);

    if (claimsResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_CLAIMS_SUCCESS: false,
        GET_CLAIMS_MESSAGE: 'No claims found for this user.',
      }, event.SessionKey, event.SecurityToken, 'GettingClaims'));
    }

    console.log(`📄 Retrieved claims: ${JSON.stringify(claimsResult.rows, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_CLAIMS_SUCCESS: true,
      claims: claimsResult.rows
    }, event.SessionKey, event.SecurityToken, 'GettingClaims'));

  } catch (error) {
    console.error('❌ Error fetching claims:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_CLAIMS_SUCCESS: false,
      GET_CLAIMS_MESSAGE: 'Server error fetching claims.',
    }, event.SessionKey, event.SecurityToken, 'GettingClaims'));
  }
};

const handleGetUserById = async (event, res) => {
  try {
    const userId = event.Body?.UserId;

    if (!userId) {
      return res.status(400).json(createWebBaseEvent({
        GET_USER_BY_ID_SUCCESS: false,
        GET_USER_BY_ID_MESSAGE: 'User ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetUserById'));
    }

    console.log(`🔍 Fetching user with ID: ${userId}`);

    const userQuery = await pool.query(
      `SELECT id, code, accounttype, identity, name, firstsurname, middlesurname, city, companyname, address, zipcode, country, landline, mobilephone, email, password, web, isauthorized, isadmin FROM osduser WHERE id = $1`,
      [userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_USER_BY_ID_SUCCESS: false,
        GET_USER_BY_ID_MESSAGE: 'User not found.',
      }, event.SessionKey, event.SecurityToken, 'GetUserById'));
    }

    const user = userQuery.rows[0];

    return res.status(200).json(createWebBaseEvent({
      GET_USER_BY_ID_SUCCESS: true,
      user: user
    }, event.SessionKey, event.SecurityToken, 'GetUserById'));

  } catch (error) {
    console.error('❌ Error fetching user by ID:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_USER_BY_ID_SUCCESS: false,
      GET_USER_BY_ID_MESSAGE: 'Server error fetching user by ID.',
    }, event.SessionKey, event.SecurityToken, 'GetUserById'));
  }
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
const handleGetCFHReports = async (event, res) => {
  try {
    console.log('🔍 Fetching CFH reports');

    // 1) Enhanced query to get cost, mode, plus total # of enrolled students and # approved
    //    We GROUP BY c.id (or c.title, c.mode) so we can process each course distinctly.
    const cfhQuery = `
      SELECT 
        c.id AS course_id,
        c.title,
        c.mode,
        c.cost,
        COUNT(sr.id) AS "alumnos",
        COUNT(sr.id) FILTER (WHERE sr.status = 'Approved') AS "alumnosAprobados"
      FROM courses c
      LEFT JOIN student_records sr
        ON sr.course_id = c.id
      GROUP BY c.id, c.title, c.mode, c.cost
    `;

    const cfhResult = await pool.query(cfhQuery);

    // 2) Build a default CFHresultItems object
    const data = {
      online: {
        cfhIngresos: 0,
        alumnos: 0,
        alumnosAprobados: 0,
        beneficios: 'Becas online',
      },
      FC: {
        cfhIngresos: 0,
        alumnos: 0,
        alumnosAprobados: 0,
        beneficios: 'Becas FC',
      },
      tramitador: {
        cfhIngresos: 0,
        alumnos: 0,
        alumnosAprobados: 0,
        beneficios: 'Becas tramitador',
      },
      presencial: {
        cfhIngresos: 0,
        alumnos: 0,
        alumnosAprobados: 0,
        beneficios: 'Becas presencial',
      },
    };

    // 3) Merge DB query results into the data object
    cfhResult.rows.forEach((row) => {
      // row.title might be "Formador & Consultor", or "Técnico OSD", etc.
      // row.mode can be "online" or "presencial" (or others).
      // row.cost is the course cost.
      // row.alumnos is # of enrolled students
      // row.alumnosAprobados is # with sr.status='Approved'

      // A) If we want standard logic for "online", "tramitador", "presencial", etc.,
      //    we handle them the same as before:
      if (row.mode === 'online') {
        data.online.cfhIngresos += Number(row.cost) * Number(row.alumnos);
        data.online.alumnos += Number(row.alumnos);
        data.online.alumnosAprobados += Number(row.alumnosAprobados);
      } 
      else if (row.mode === 'presencial') {
        data.presencial.cfhIngresos += Number(row.cost) * Number(row.alumnos);
        data.presencial.alumnos += Number(row.alumnos);
        data.presencial.alumnosAprobados += Number(row.alumnosAprobados);
      }
      else if (row.mode === 'tramitador') {
        data.tramitador.cfhIngresos += Number(row.cost) * Number(row.alumnos);
        data.tramitador.alumnos += Number(row.alumnos);
        data.tramitador.alumnosAprobados += Number(row.alumnosAprobados);
      }
      
      // B) Special logic for "Formador & Consultor" => the "FC" object
      //    cost * #students * 0.8 if 'presencial', or * 0.4 if 'online'
      //    (Adjust string matching if your DB title differs)
      if (row.title.includes('Formador & Consultor')) {
        const alumnos = Number(row.alumnos) || 0;
        const cost = Number(row.cost) || 0;
        const alumnosAprobados = Number(row.alumnosAprobados) || 0;

        let multiplier = 0;
        if (row.mode === 'presencial') {
          multiplier = 0.8;
        } else if (row.mode === 'online') {
          multiplier = 0.4;
        }

        data.FC.cfhIngresos += cost * alumnos * multiplier;
        data.FC.alumnos += alumnos;
        data.FC.alumnosAprobados += alumnosAprobados;
      }
    });

    // 4) Return the final array with a single CFHresultItems object
    const cfhResultItemsArray = [ data ];

    console.log('✅ CFH reports data compiled:', cfhResultItemsArray);

    return res.status(200).json(
      createWebBaseEvent(
        {
          CFHRESULT_SUCCESS: true,
          cfhResult: cfhResultItemsArray,
        },
        event.SessionKey,
        event.SecurityToken,
        'GetCFHReports'
      )
    );

  } catch (error) {
    console.error('❌ Error fetching CFH reports:', error);

    return res.status(500).json(
      createWebBaseEvent(
        {
          CFHRESULT_SUCCESS: false,
          CFHRESULT_MESSAGE: 'Server error fetching CFH reports.',
        },
        event.SessionKey,
        event.SecurityToken,
        'GetCFHReports'
      )
    );
  }
};

const handleCreateClaimantAndClaimsCustomerPerformance = async (event, res) => {
  try {
    const {
      ClaimId,
      DatePerformance,
      JustifyingDocument,
      JustifyingDocumentBytes,
      Summary,
      Type,
      TypePerformance,
      UserTypePerformance
    } = event.Body;

    if (!ClaimId || !DatePerformance || !Summary || !Type || !TypePerformance || !UserTypePerformance) {
      return res.status(400).json(createWebBaseEvent({
        CREATE_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE_SUCCESS: false,
        CREATE_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE_MESSAGE: 'All fields are required.',
      }, event.SessionKey, event.SecurityToken, 'CreateClaimantAndClaimsCustomerPerformance'));
    }

    const insertPerformanceQuery = `
      INSERT INTO performance_claim_control (
      id, code, claimid, status, dateperformance, justifyingdocument, 
      justifyingdocumentbytes, summary, type, typeperformance, usertypeperformance
      ) VALUES (
      $1, $2, $3, 'Running', $4, $5, $6, $7, $8, $9, $10
      )
    `;

    const performanceId = uuidv4();
    const performanceCode = `PERF-${uuidv4().replace(/-/g, '').substring(0, 8)}`;
    const insertPerformanceResult = await pool.query(insertPerformanceQuery, [
      performanceId,
      performanceCode,
      ClaimId,
      DatePerformance,
      JustifyingDocument,
      JustifyingDocumentBytes,
      Summary,
      Type,
      TypePerformance,
      UserTypePerformance
    ]);

    console.log('✅ Performance claim created successfully:', insertPerformanceResult.rows[0]);

    return res.status(201).json(createWebBaseEvent({
      CREATE_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE_SUCCESS: true,
      performanceClaim: insertPerformanceResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'CreateClaimantAndClaimsCustomerPerformance'));

  } catch (error) {
    console.error('❌ Error creating performance claim:', error);

    return res.status(500).json(createWebBaseEvent({
      CREATE_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE_SUCCESS: false,
      CREATE_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE_MESSAGE: 'Server error creating performance claim.',
    }, event.SessionKey, event.SecurityToken, 'CreateClaimantAndClaimsCustomerPerformance'));
  }
};

const handleGetPerformancesClaimById = async (event, res) => {
  try {
    const claimId = event.Body?.Id;

    if (!claimId) {
      return res.status(400).json(createWebBaseEvent({
        GET_PERFORMANCES_CLAIM_BY_ID_SUCCESS: false,
        GET_PERFORMANCES_CLAIM_BY_ID_MESSAGE: 'Claim ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetPerformancesClaimById'));
    }

    console.log(`🔍 Fetching performance claims for claim ID: ${claimId}`);
    const performanceClaimQuery = `
      SELECT id, code, claimid, status
      FROM performance_claim_control
      WHERE claimid = $1
    `;

    const performanceClaimResult = await pool.query(performanceClaimQuery, [claimId]);

    if (performanceClaimResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_PERFORMANCES_CLAIM_BY_ID_SUCCESS: false,
        GET_PERFORMANCES_CLAIM_BY_ID_MESSAGE: 'No performance claims found for this claim ID.',
      }, event.SessionKey, event.SecurityToken, 'GetPerformancesClaimById'));
    }

    console.log(`📄 Retrieved performance claims: ${JSON.stringify(performanceClaimResult.rows, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_PERFORMANCES_CLAIM_BY_ID_SUCCESS: true,
      performanceClaims: performanceClaimResult.rows
    }, event.SessionKey, event.SecurityToken, 'GetPerformancesClaimById'));

  } catch (error) {
    console.error('❌ Error fetching performance claims by claim ID:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_PERFORMANCES_CLAIM_BY_ID_SUCCESS: false,
      GET_PERFORMANCES_CLAIM_BY_ID_MESSAGE: 'Server error fetching performance claims by claim ID.',
    }, event.SessionKey, event.SecurityToken, 'GetPerformancesClaimById'));
  }
};

const handleCreateClaim = async (event, res) => {
  try {
    const claimForm = event.Body?.ClaimForm;

    if (!claimForm) {
      return res.status(400).json(createWebBaseEvent({
        CREATE_CLAIM_SUCCESS: false,
        CREATE_CLAIM_MESSAGE: 'ClaimForm is required.',
      }, event.SessionKey, event.SecurityToken, 'CreateClaim'));
    }

    const {
      Date,
      claimtype,
      subscriberClaimedName,
      serviceProvided,
      amountClaimed,
      facts,
      firstSupportingDocumentFileName,
      firstSupportingDocumentFileId,
      secondSupportingDocumentFileName,
      secondSupportingDocumentFileId,
      ClaimantId = null // Default to null if not provided
    } = claimForm;

    // Validate required fields
    if (!Date || !claimtype || !subscriberClaimedName || !serviceProvided || !amountClaimed || !facts) {
      return res.status(400).json(createWebBaseEvent({
        CREATE_CLAIM_SUCCESS: false,
        CREATE_CLAIM_MESSAGE: 'All fields in ClaimForm are required.',
      }, event.SessionKey, event.SecurityToken, 'CreateClaim'));
    }

    // Retrieve subscriberClaimedId from osduser table
    const subscriberQuery = await pool.query(
      'SELECT id FROM osduser WHERE name = $1',
      [subscriberClaimedName]
    );

    if (subscriberQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        CREATE_CLAIM_SUCCESS: false,
        CREATE_CLAIM_MESSAGE: 'Subscriber claimed not found.',
      }, event.SessionKey, event.SecurityToken, 'CreateClaim'));
    }

    console.log(`🔍 Subscriber claimed ID: ${subscriberQuery.rows[0].id}`);
    const subscriberClaimedId = subscriberQuery.rows[0].id;

    let claimantId = null;
    if (ClaimantId !== null) {
      const claimantQuery = await pool.query(
        'SELECT id FROM osduser WHERE identity = $1',
        [ClaimantId]
      );

      if (claimantQuery.rows.length === 0) {
        console.log('❌ Claimant not found.');
        return res.status(404).json(createWebBaseEvent({
          CREATE_CLAIM_SUCCESS: false,
          CREATE_CLAIM_MESSAGE: 'Claimant not found.',
        }, event.SessionKey, event.SecurityToken, 'CreateClaim'));
      }

      claimantId = claimantQuery.rows[0].id || null;
      console.log(`🔍 Claimant ID: ${claimantId}`);
      const insertClaimantQuery = `
        INSERT INTO claimant (id, userid)
        VALUES ($1, $2)
        ON CONFLICT (id) DO NOTHING;
      `;
      await pool.query(insertClaimantQuery, [claimantId, claimantId]);
    }

    const insertClaimQuery = `
      INSERT INTO claim_file (
      id, code, datecreated, status, subscriberclaimedid, claimantid, claimtype, 
      serviceprovided, facts, amountclaimed, documentfile1id, documentfile1name, 
      documentfile2id, documentfile2name
      ) VALUES (
      $1, $2, $3, 'Running', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      ) RETURNING id, code, datecreated, status, subscriberclaimedid, claimantid, claimtype, 
      serviceprovided, facts, amountclaimed, documentfile1id, documentfile1name, 
      documentfile2id, documentfile2name;
    `;

    const claimId = uuidv4();
    const claimCode = `CLM-${claimId}`;

    const insertClaimResult = await pool.query(insertClaimQuery, [
      claimId,
      claimCode,
      Date,
      subscriberClaimedId,
      claimantId,
      claimtype,
      serviceProvided,
      facts,
      amountClaimed,
      firstSupportingDocumentFileId,
      firstSupportingDocumentFileName,
      secondSupportingDocumentFileId,
      secondSupportingDocumentFileName
    ]);

    console.log('✅ Claim created successfully:', insertClaimResult.rows[0]);

    return res.status(201).json(createWebBaseEvent({
      CREATE_CLAIM_SUCCESS: true,
      claim: insertClaimResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'CreateClaim'));

  } catch (error) {
    console.error('❌ Error creating claim:', error);

    return res.status(500).json(createWebBaseEvent({
      CREATE_CLAIM_SUCCESS: false,
      CREATE_CLAIM_MESSAGE: 'Server error creating claim.',
    }, event.SessionKey, event.SecurityToken, 'CreateClaim'));
  }
};

const handleUpdateUserProfile = async (event, res) => {
  try {
    const Email = event.Body?.Email;
    console.log(`🔄 Updating profile for user with email: ${Email}`);

    // Validate required fields
    if (!Email) {
      return res.status(400).json(createWebBaseEvent({
        success: false,
        message: 'Email is required.'
      }, event.SessionKey, event.SecurityToken, 'UpdateUserProfile'));
    }

    // Check if the user exists
    const userQuery = await pool.query(
      `SELECT id FROM osduser WHERE email = $1`,
      [Email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        success: false,
        message: 'User not found.'
      }, event.SessionKey, event.SecurityToken, 'UpdateUserProfile'));
    }

    const userId = userQuery.rows[0].id;
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(event.Body)) {
      if (key !== 'Email' && key !== 'Action' && key !== 'TraceIdentifier' && key !== 'Type' && key !== 'Date' && key !== 'ApplicationIdentifier') {
        fields.push(`${key.toLowerCase()} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json(createWebBaseEvent({
        success: false,
        message: 'No fields to update.'
      }, event.SessionKey, event.SecurityToken, 'UpdateUserProfile'));
    }

    values.push(userId);

    const updateQuery = `
      UPDATE osduser
      SET ${fields.join(', ')}
      WHERE id = $${index}
      RETURNING id, name, firstsurname, middlesurname, city, companyname, address, zipcode, landline, mobilephone, email, web;
    `;

    const updateResult = await pool.query(updateQuery, values);

    return res.status(200).json(createWebBaseEvent({
      success: true,
      message: 'User profile updated successfully.',
      data: updateResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'UpdateUserProfile'));
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return res.status(500).json(createWebBaseEvent({
      success: false,
      message: 'Internal server error while updating user profile.'
    }, event.SessionKey, event.SecurityToken, 'UpdateUserProfile'));
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
          isauthorized, isadmin, offering_type
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
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
        false,
        accountForm.cfhOffer
      ]);

      userId = osdUserResult.rows[0].id;
    } else {
      userId = userExists.rows[0].id;
      console.log('✅ User already exists in osduser with ID:', userId);
    }

    console.log("✅ Successfully created user with ID:", userId);

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
        fp.paytpv,
        u.country,
        u.name
      FROM freeprofessional fp
      LEFT JOIN freeprofessionaltype fpt ON fp.freeprofessionaltypeid = fpt.id
      LEFT JOIN osduser u ON fp.userid = u.id
    `);

    res.status(200).json(createWebBaseEvent({
      GET_SUBSCRIBERS_SUCCESS: true,
      subscribers: result.rows
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