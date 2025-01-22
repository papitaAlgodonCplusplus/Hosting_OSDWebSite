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
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// Development
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'osdlogic',
  password: 'sapwd2023',
  port: 5432
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

      case 'AddPerformanceUpdate':
        await handleAddPerformanceUpdate(event, res);
        break;

      case 'CloseClaimFile':
        await handleCloseClaimFile(event, res);
        break;

      case 'GetPerformancesProjectManagerById':
        await handleGetPerformancesProjectManagerById(event, res);
        break;

      case 'GetUnassignedSubscribers':
        await handleGetUnassignedSubscribers(event, res);
        break;

      case 'GetProfessionalFreeTrainers':
        await handleGetProfessionalFreeTrainers(event, res);
        break;

      case 'AssignTrainerToSubscriber':
        await handleAssignTrainerToSubscriber(event, res);
        break;

      case 'ChangingOsdUserAutorizationStatus':
        await handleChangingOsdUserAutorizationStatus(event, res);
        break;

      case 'GettingFreeProfessionalsTR':
        await handleGettingFreeProfessionalsTR(event, res);
        break;

      case 'AssignClaimsToFreeProfessionalTR':
        await handleAssignClaimsToFreeProfessionalTR(event, res);
        break;

      case 'GetSubPerformanceById':
        await handleGetSubPerformanceById(event, res);
        break;

      case 'GetSummaryTypes':
        await handleGetSummaryTypes(event, res);
        break;

      case 'ModifyPerformanceFreeProfessional':
        await handleModifyPerformanceFreeProfessional(event, res);
        break;

      case 'ModifyResponseToPerformanceAssigned':
        await handleModifyResponseToPerformanceAssigned(event, res);
        break;

      case 'DeleteStudentRecord':
        await handleDeleteStudentRecord(event, res);
        break;

      case 'AddResponseToPerformanceAssigned':
        await handleAddResponseToPerformanceAssigned(event, res);
        break;

      case 'LogEvent':
        await handleLogUserAction(event, res);
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
      console.log('❌ FreeProfessional not found or update failed.', updateResult);
      return res.status(404).json(createWebBaseEvent({
        ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: false,
        ADD_FREE_PROFESSIONAL_TO_CFH_MESSAGE: 'FreeProfessional not found or update failed.',
      }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));
    }

    console.log(`✅ FreeProfessional added to CFH successfully: ${JSON.stringify(updateResult.rows[0], null, 2)}`);

    const NewUserId = updateResult.rows[0].cfh_id;
    console.log(`🔍 Checking if user with ID: ${NewUserId} is a subscriber customer.`);
    const subscriberCustomerQuery = `
      SELECT id FROM subscribercustomer WHERE id = $1
    `;
    const subscriberCustomerResult = await pool.query(subscriberCustomerQuery, [NewUserId]);

    if (subscriberCustomerResult.rows.length === 0) {
      console.log(`🔍 User with ID: ${NewUserId} is not a subscriber customer. Inserting into subscribercustomer.`);
      const insertSubscriberCustomerQuery = `
      INSERT INTO subscribercustomer (id, userid, clienttype)
      VALUES ($1, $2, 'Subscriber')
      `;
      await pool.query(insertSubscriberCustomerQuery, [NewUserId, NewUserId]);
    } else {
      console.log(`✅ User with ID: ${NewUserId} is already a subscriber customer.`);
    }

    console.log(`🔍 Checking if FreeProfessional with ID: ${userId} exists.`);
    const freeProfessionalQuery = `
      SELECT id FROM freeprofessional WHERE userid = $1
    `;
    const freeProfessionalResult = await pool.query(freeProfessionalQuery, [userId]);

    if (freeProfessionalResult.rows.length === 0) {
      console.log(`❌ FreeProfessional with ID: ${userId} not found.`);
      return res.status(404).json(createWebBaseEvent({
        ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: false,
        ADD_FREE_PROFESSIONAL_TO_CFH_MESSAGE: 'FreeProfessional not found.',
      }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));
    }

    const NewFreeProfessionalId = freeProfessionalResult.rows[0].id;

    console.log(`🔍 Inserting FreeProfessional with ID: ${NewFreeProfessionalId} into subscribercustomerfreeprofessionalprocessor for user ID: ${NewUserId}.`);
    const insertProcessorQuery = `
      INSERT INTO subscribercustomerfreeprofessionalprocessor (id, subscribercustomerid, freeprofessionalid)
      VALUES ($1, $2, $3)
    `;

    await pool.query(insertProcessorQuery, [
      uuidv4(),
      NewUserId,
      NewFreeProfessionalId
    ]);

    console.log('✅ FreeProfessional added to subscribercustomerfreeprofessionalprocessor successfully.');

    const updateClaimFileQuery = `
      UPDATE claim_file
      SET processor_id = $1
      WHERE subscriberclaimedid = $2
    `;

    await pool.query(updateClaimFileQuery, [NewFreeProfessionalId, NewUserId]);

    console.log('✅ Updated claim_file table with new processor_id.');

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
        fp.id, 
        fp.userid, 
        fp.freeprofessionaltypeid, 
        fp.identificationfileid, 
        fp.identificationfilename, 
        fp.curriculumvitaefileid, 
        fp.curriculumvitaefilename, 
        fp.civilliabilityinsurancefileid, 
        fp.civilliabilityinsurancefilename, 
        fp.servicerates, 
        fp.paytpv, 
        fp.course_id, 
        fp.cfh_id,
        u.name AS username,
        fpt.name AS typename
      FROM freeprofessional fp
      LEFT JOIN osduser u ON fp.userid = u.id
      LEFT JOIN freeprofessionaltype fpt ON fp.freeprofessionaltypeid = fpt.id
      WHERE fp.cfh_id = $1
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
    let claimList = [];
    const economicResultReportDTO = {
      Income: 0,
      ImprovementSavings: 0,
      ClaimsAmount: 0,
      CompensationClaimant: 0,
      Numberfiles: 0
    };

    console.log('⚙️ Starting handleGetTransparencyReportsIncomeExpenses with:', event);
    const { country, SubscriberId } = event.Body;

    if (country && !SubscriberId) {
      console.log('📝 Getting all users for country:', country);
      const usersResult = await pool.query(`SELECT id FROM osduser WHERE country = $1`, [country]);

      if (usersResult.rows.length > 0) {
        const osdUsers = usersResult.rows;
        console.log(`🔎 Found ${osdUsers.length} user(s) in country: ${country}`);
        let subscriberCustomers = [];

        for (const user of osdUsers) {
          const subResult = await pool.query(`SELECT id FROM subscribercustomer WHERE userid = $1`, [user.id]);
          if (subResult.rows.length > 0) {
            subscriberCustomers = subscriberCustomers.concat(subResult.rows);
          }
        }

        if (subscriberCustomers.length > 0) {
          console.log(`🔎 Found ${subscriberCustomers.length} subscriberCustomer(s) for those users.`);
          for (const sub of subscriberCustomers) {
            const claimResult = await pool.query(`
              SELECT id, amountclaimed, amountpaid, improvementsavings 
              FROM claim_file 
              WHERE status = 'Completed' AND subscriberclaimedid = $1
            `, [sub.id]);
            if (claimResult.rows.length > 0) {
              claimList = claimList.concat(claimResult.rows);
            }
          }
        }
      }
    } else if (SubscriberId) {
      console.log('📝 Getting all completed claims for subscriber:', SubscriberId);
      const claimResult = await pool.query(`
        SELECT id, amountclaimed, amountpaid, improvementsavings 
        FROM claim_file 
        WHERE status IN ('Completed', 'Closed') AND subscriberclaimedid = $1
      `, [SubscriberId]);
      claimList = claimResult.rows;
    } else {
      console.log('📝 Getting all completed claims, no country/subscriber filter.');
      const claimResult = await pool.query(`
        SELECT id, amountclaimed, amountpaid, improvementsavings 
        FROM claim_file 
        WHERE status IN ('Completed', 'Closed')
      `);
      claimList = claimResult.rows;
    }

    console.log(`✅ Total claims found: ${claimList.length}`);

    for (const claim of claimList) {
      console.log('📝 Processing claim:', claim);
      const improvementSavings = Number(claim.improvementsavings) || 0;
      const amountClaimed = Number(claim.amountclaimed) || 0;
      const amountPaid = Number(claim.amountpaid) || 0;

      if (improvementSavings > 100) {
        const additional = (improvementSavings - 100) * 0.10;
        economicResultReportDTO.Income += Number((10 + additional).toFixed(2));
      } else {
        economicResultReportDTO.Income += 10;
      }

      economicResultReportDTO.ImprovementSavings += improvementSavings;
      economicResultReportDTO.ClaimsAmount += amountClaimed;
      economicResultReportDTO.CompensationClaimant += amountPaid;
    }

    economicResultReportDTO.Numberfiles = claimList.length;

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

    console.log(`🔍 Fetching free professional ID for user with ID: ${userId}`);

    const freeProfessionalQuery = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1',
      [userId]
    );

    if (freeProfessionalQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: false,
        GET_PERFORMANCE_ASSIGNED_BY_ID_MESSAGE: 'Free professional not found for this user ID.',
      }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));
    }

    const freeProfessionalId = freeProfessionalQuery.rows[0].id;
    console.log(`🔍 Free professional ID: ${freeProfessionalId}`);

    const performanceQuery = `
      SELECT 
        id AS "Id", id AS "id", id AS "id",
        code AS "Code", code AS "code",
        projectmanagerid AS "ProjectManagerId", projectmanagerid AS "projectmanagerid", projectmanagerid AS "project_manager_id",
        summarytypeid AS "SummaryId", summarytypeid AS "summarytypeid", summarytypeid AS "summary_id",
        start_date AS "Start_Date", start_date AS "start_date",
        end_date AS "End_Date", end_date AS "end_date",
        justifying_document AS "JustifyingDocument", justifying_document AS "justifyingdocument", justifying_document AS "justifying_document",
        justifying_document_bytes AS "JustifyingDocumentBytes", justifying_document_bytes AS "justifyingdocumentbytes", justifying_document_bytes AS "justifying_document_bytes",
        freeprofessionalcreatedperformanceid AS "FreeProfessionalCreatedPerformanceId", freeprofessionalcreatedperformanceid AS "freeprofessionalcreatedperformanceid", freeprofessionalcreatedperformanceid AS "free_professional_created_performance_id",
        freeprofessionalassignedid AS "FreeProfessionalAssignedId", freeprofessionalassignedid AS "freeprofessionalassignedid", freeprofessionalassignedid AS "free_professional_assigned_id",
        estimated_transport_expenses AS "EstimatedTransportExpenses", estimated_transport_expenses AS "estimated_transport_expenses",
        estimated_transport_hours AS "EstimatedTransportHours", estimated_transport_hours AS "estimated_transport_hours",
        estimated_work_hours AS "EstimatedWorkHours", estimated_work_hours AS "estimated_work_hours",
        total_forecast_data AS "TotalForecastData", total_forecast_data AS "totalforecastdata", total_forecast_data AS "total_forecast_data",
        (SELECT summary FROM summarytypeperformancefreeprofessional WHERE id = summarytypeid) AS "Summary",
        (SELECT summary FROM summarytypeperformancefreeprofessional WHERE id = summarytypeid) AS "SummaryTypeName",
        (SELECT summary FROM summarytypeperformancefreeprofessional WHERE id = summarytypeid) AS "summary_type_name"
      FROM performance_freeprofessional
      WHERE freeprofessionalassignedid = $1
    `;

    const performanceResult = await pool.query(performanceQuery, [freeProfessionalId]);

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
    LEFT JOIN subscribercustomer sc ON cf.subscriberclaimedid = sc.id
    WHERE cf.claimantid = $1 
          OR sc.userid = $1
          OR cf.processor_id = (
            SELECT id 
            FROM freeprofessional 
            WHERE userid = $1
          )
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
const handleAddResponseToPerformanceAssigned = async (event, res) => {
  try {
    const addResponsePerformanceAssignedEvent = event.Body;
    console.log('🔍 Fetching free professional ID for user with ID:', addResponsePerformanceAssignedEvent.UserId);

    const freeProfessionalQuery = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1',
      [addResponsePerformanceAssignedEvent.UserId]
    );

    if (freeProfessionalQuery.rows.length === 0) {
      console.log('❌ Free professional not found.');
      return res.status(404).json(createWebBaseEvent({
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'AddResponseToPerformanceAssigned'));
    }

    const freeProfessionalId = freeProfessionalQuery.rows[0].id;
    console.log('✅ Free professional ID:', freeProfessionalId);

    console.log('🔍 Fetching performance free professional with ID:', addResponsePerformanceAssignedEvent.PerformanceAssignedId);
    const performanceFreeProfessionalQuery = await pool.query(
      'SELECT id, code FROM performance_freeprofessional WHERE id = $1',
      [addResponsePerformanceAssignedEvent.PerformanceAssignedId]
    );

    if (performanceFreeProfessionalQuery.rows.length === 0) {
      console.log('❌ Performance free professional not found.');
      return res.status(404).json(createWebBaseEvent({
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Performance free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'AddResponseToPerformanceAssigned'));
    }

    const performanceFreeProfessional = performanceFreeProfessionalQuery.rows[0];
    console.log('✅ Performance free professional:', performanceFreeProfessional);

    console.log('🔍 Fetching count of project performance free professional assigned for performance ID:', performanceFreeProfessional.id);
    const projectPerformanceFreeProfessionalAssignedCountQuery = await pool.query(
      'SELECT COUNT(*) FROM project_performance_freeprofessional_assigned WHERE performanceid = $1',
      [performanceFreeProfessional.id]
    );

    const projectPerformanceFreeProfessionalAssignedCount = parseInt(projectPerformanceFreeProfessionalAssignedCountQuery.rows[0].count, 10);
    console.log('✅ Count of project performance free professional assigned:', projectPerformanceFreeProfessionalAssignedCount);

    const projectPerformanceFreeProfessionalAssigned = {
      id: uuidv4(),
      performanceid: performanceFreeProfessional.id,
      code: `A/${projectPerformanceFreeProfessionalAssignedCount + 1}/${performanceFreeProfessional.code}`,
      freeprofessionalid: freeProfessionalId,
      free_professional_work_hours: addResponsePerformanceAssignedEvent.FP_WorkHours,
      free_professional_travel_hours: addResponsePerformanceAssignedEvent.FP_TravelTime,
      free_professional_travel_expenses: parseFloat(addResponsePerformanceAssignedEvent.FP_TravelExpenses),
      total_free_professional_data: parseFloat(addResponsePerformanceAssignedEvent.Total_FP),
      justify_change_estimated_work_hours: addResponsePerformanceAssignedEvent.JustifyChangeEstimatedWorkHours,
      documentincreaseworkinghours: addResponsePerformanceAssignedEvent.DocumentIncreaseWorkingHours
    };

    console.log('💾 Inserting project performance free professional assigned:', projectPerformanceFreeProfessionalAssigned);
    await pool.query(
      `INSERT INTO project_performance_freeprofessional_assigned (
        id, performanceid, code, freeprofessionalid, free_professional_work_hours, free_professional_travel_hours,
        free_professional_travel_expenses, total_free_professional_data, justify_change_estimated_work_hours, documentincreaseworkinghours
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        projectPerformanceFreeProfessionalAssigned.id,
        projectPerformanceFreeProfessionalAssigned.performanceid,
        projectPerformanceFreeProfessionalAssigned.code,
        projectPerformanceFreeProfessionalAssigned.freeprofessionalid,
        projectPerformanceFreeProfessionalAssigned.free_professional_work_hours,
        projectPerformanceFreeProfessionalAssigned.free_professional_travel_hours,
        projectPerformanceFreeProfessionalAssigned.free_professional_travel_expenses,
        projectPerformanceFreeProfessionalAssigned.total_free_professional_data,
        projectPerformanceFreeProfessionalAssigned.justify_change_estimated_work_hours,
        projectPerformanceFreeProfessionalAssigned.documentincreaseworkinghours
      ]
    );

    console.log('✅ Response to performance assigned added successfully.');
    res.status(200).json(createWebBaseEvent({
      ADD_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: true,
      ADD_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Successful response to assigned action',
    }, event.SessionKey, event.SecurityToken, 'AddResponseToPerformanceAssigned'));

  } catch (error) {
    console.error('❌ Error adding response to performance assigned:', error);
    res.status(500).json(createWebBaseEvent({
      ADD_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
      ADD_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Server error adding response to performance assigned.',
    }, event.SessionKey, event.SecurityToken, 'AddResponseToPerformanceAssigned'));
  }
};

const handleDeleteStudentRecord = async (event, res) => {
  try {
    const studentName = event.Body?.StudentName;

    if (!studentName) {
      return res.status(400).json(createWebBaseEvent({
        DELETE_STUDENT_RECORD_SUCCESS: false,
        DELETE_STUDENT_RECORD_MESSAGE: 'Student name is required.',
      }, event.SessionKey, event.SecurityToken, 'DeleteStudentRecord'));
    }

    console.log(`🗑️ Deleting student record for student with name: ${studentName}`);

    const deleteQuery = await pool.query(
      'DELETE FROM student_records WHERE name = $1 RETURNING *',
      [studentName]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        DELETE_STUDENT_RECORD_SUCCESS: false,
        DELETE_STUDENT_RECORD_MESSAGE: 'Student record not found.',
      }, event.SessionKey, event.SecurityToken, 'DeleteStudentRecord'));
    }

    console.log('✅ Student record deleted successfully.');

    return res.status(200).json(createWebBaseEvent({
      DELETE_STUDENT_RECORD_SUCCESS: true,
      DELETE_STUDENT_RECORD_MESSAGE: 'Student record deleted successfully.',
      deletedRecord: deleteQuery.rows[0]
    }, event.SessionKey, event.SecurityToken, 'DeleteStudentRecord'));

  } catch (error) {
    console.error('❌ Error deleting student record:', error);
    return res.status(500).json(createWebBaseEvent({
      DELETE_STUDENT_RECORD_SUCCESS: false,
      DELETE_STUDENT_RECORD_MESSAGE: 'Server error deleting student record.',
    }, event.SessionKey, event.SecurityToken, 'DeleteStudentRecord'));
  }
};

const handleModifyResponseToPerformanceAssigned = async (event, res) => {
  try {
    const modifyResponsePerformanceAssignedEvent = event.Body;
    console.log('🔍 Fetching free professional ID for user with ID:', modifyResponsePerformanceAssignedEvent.UserId);

    const freeProfessionalQuery = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1',
      [modifyResponsePerformanceAssignedEvent.UserId]
    );

    if (freeProfessionalQuery.rows.length === 0) {
      console.log('❌ Free professional not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyResponsePerformanceAssigned'));
    }

    const freeProfessionalId = freeProfessionalQuery.rows[0].id;

    console.log('🔍 Fetching subperformance with ID:', freeProfessionalId);

    let projectPerformanceFreeprofessionalAssigned = await pool.query(
      'SELECT * FROM project_performance_freeprofessional_assigned WHERE freeprofessionalid = $1',
      [freeProfessionalId]
    );

    if (projectPerformanceFreeprofessionalAssigned.rows.length === 0) {
      console.log('❌ SubPerformance not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'SubPerformance not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyResponsePerformanceAssigned'));
    }

    projectPerformanceFreeprofessionalAssigned = projectPerformanceFreeprofessionalAssigned.rows[0];
    console.log('📄 Retrieved subperformance:', projectPerformanceFreeprofessionalAssigned);

    projectPerformanceFreeprofessionalAssigned.free_professional_work_hours = modifyResponsePerformanceAssignedEvent.FP_WorkHours;
    projectPerformanceFreeprofessionalAssigned.free_professional_travel_hours = modifyResponsePerformanceAssignedEvent.FP_TravelTime;
    projectPerformanceFreeprofessionalAssigned.free_professional_travel_expenses = parseFloat(modifyResponsePerformanceAssignedEvent.FP_TravelExpenses);
    projectPerformanceFreeprofessionalAssigned.total_free_professional_data = parseFloat(modifyResponsePerformanceAssignedEvent.Total_FP);

    if (modifyResponsePerformanceAssignedEvent.JustifyChangeEstimatedWorkHours) {
      projectPerformanceFreeprofessionalAssigned.justify_change_estimated_work_hours = modifyResponsePerformanceAssignedEvent.JustifyChangeEstimatedWorkHours;
    }

    if (modifyResponsePerformanceAssignedEvent.DocumentIncreaseWorkingHours) {
      projectPerformanceFreeprofessionalAssigned.documentincreaseworkinghours = modifyResponsePerformanceAssignedEvent.DocumentIncreaseWorkingHours;
    }

    console.log('🔄 Updating subperformance in database:', projectPerformanceFreeprofessionalAssigned);

    await pool.query(
      `UPDATE project_performance_freeprofessional_assigned
       SET free_professional_work_hours = $1, free_professional_travel_hours = $2, free_professional_travel_expenses = $3,
           total_free_professional_data = $4, justify_change_estimated_work_hours = $5, documentincreaseworkinghours = $6
       WHERE id = $7`,
      [
        projectPerformanceFreeprofessionalAssigned.free_professional_work_hours,
        projectPerformanceFreeprofessionalAssigned.free_professional_travel_hours,
        projectPerformanceFreeprofessionalAssigned.free_professional_travel_expenses,
        projectPerformanceFreeprofessionalAssigned.total_free_professional_data,
        projectPerformanceFreeprofessionalAssigned.justify_change_estimated_work_hours,
        projectPerformanceFreeprofessionalAssigned.documentincreaseworkinghours,
        projectPerformanceFreeprofessionalAssigned.id
      ]
    );

    console.log('✅ Subperformance modified successfully.');
    return res.status(200).json(createWebBaseEvent({
      MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: true,
      MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Correctly modified subperformance.',
    }, event.SessionKey, event.SecurityToken, 'ModifyResponsePerformanceAssigned'));

  } catch (error) {
    console.error('❌ Error modifying response to performance assigned:', error);
    return res.status(500).json(createWebBaseEvent({
      MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
      MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Server error modifying response to performance assigned.',
    }, event.SessionKey, event.SecurityToken, 'ModifyResponsePerformanceAssigned'));
  }
};

const handleModifyPerformanceFreeProfessional = async (event, res) => {
  try {
    const addPerformancFPEvent = event.Body;
    const performanceId = addPerformancFPEvent.PerformanceId;

    console.log(`🔍 Fetching performance with ID: ${performanceId}`);
    let performanceFreeprofessional = await pool.query(
      'SELECT * FROM performance_freeprofessional WHERE id = $1',
      [performanceId]
    );

    if (performanceFreeprofessional.rows.length === 0) {
      console.log('❌ Performance not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: false,
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Performance not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyPerformanceFreeProfessional'));
    }

    performanceFreeprofessional = performanceFreeprofessional.rows[0];

    console.log(`🔄 Updating performance details for ID: ${performanceId}`);
    performanceFreeprofessional.summarytypeid = addPerformancFPEvent.SummaryId;
    performanceFreeprofessional.start_date = addPerformancFPEvent.StartDate;
    performanceFreeprofessional.end_date = addPerformancFPEvent.EndDate;
    performanceFreeprofessional.justifying_document = addPerformancFPEvent.JustifyingDocument;

    console.log(`🔍 Fetching free professional with user ID: ${addPerformancFPEvent.FreeProfessionalId}`);
    const freeprofessional = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1',
      [addPerformancFPEvent.FreeProfessionalId]
    );

    if (freeprofessional.rows.length === 0) {
      console.log('❌ Free professional not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: false,
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyPerformanceFreeProfessional'));
    }

    performanceFreeprofessional.freeprofessionalcreatedperformanceid = freeprofessional.rows[0].id;
    performanceFreeprofessional.estimated_transport_expenses = addPerformancFPEvent.ForecastTravelExpenses;
    performanceFreeprofessional.estimated_transport_hours = addPerformancFPEvent.ForecastTravelTime;
    performanceFreeprofessional.estimated_work_hours = addPerformancFPEvent.ForecastWorkHours;
    performanceFreeprofessional.total_forecast_data = addPerformancFPEvent.TotalForecasData;

    console.log(`🔄 Updating performance in database for ID: ${performanceId}`);
    await pool.query(
      `UPDATE performance_freeprofessional
       SET start_date = $1, end_date = $2, justifying_document = $3,
       freeprofessionalcreatedperformanceid = $4, estimated_transport_expenses = $5, estimated_transport_hours = $6,
       estimated_work_hours = $7, total_forecast_data = $8, summarytypeid = $9
       WHERE id = $10`,
      [
        performanceFreeprofessional.start_date,
        performanceFreeprofessional.end_date,
        performanceFreeprofessional.justifying_document,
        performanceFreeprofessional.freeprofessionalcreatedperformanceid,
        performanceFreeprofessional.estimated_transport_expenses,
        performanceFreeprofessional.estimated_transport_hours,
        performanceFreeprofessional.estimated_work_hours,
        performanceFreeprofessional.total_forecast_data,
        performanceFreeprofessional.summarytypeid,
        performanceId
      ]
    );

    console.log('✅ Performance was successfully modified.');
    return res.status(200).json(createWebBaseEvent({
      MODIFY_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: true,
      MODIFY_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Performance was successfully modified.',
    }, event.SessionKey, event.SecurityToken, 'ModifyPerformanceFreeProfessional'));

  } catch (error) {
    console.error('❌ Error modifying performance free professional:', error);
    return res.status(500).json(createWebBaseEvent({
      MODIFY_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: false,
      MODIFY_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Server error modifying performance free professional.',
    }, event.SessionKey, event.SecurityToken, 'ModifyPerformanceFreeProfessional'));
  }
};

const handleGetSummaryTypes = async (event, res) => {
  try {
    const summarytypePerformanceFreeProfessionalDTO = [];
    const summarytypePerformanceBuyDTO = [];

    console.log('🔍 Fetching summary types for performance free professional and performance buy');

    const summarytypesPerformanceFreeProfessionalList = await pool.query('SELECT * FROM summarytypeperformancefreeprofessional');
    const summarytypesPerformanceBuyList = await pool.query('SELECT * FROM summarytypeperformancebuy');

    summarytypePerformanceFreeProfessionalDTO.push(...summarytypesPerformanceFreeProfessionalList.rows);
    summarytypePerformanceBuyDTO.push(...summarytypesPerformanceBuyList.rows);

    console.log('✅ Summary types fetched successfully');

    return res.status(200).json(createWebBaseEvent({
      GET_SUMMARY_TYPES_SUCCESS: true,
      summarytypePerformanceFreeProfessional: summarytypePerformanceFreeProfessionalDTO,
      summarytypePerformanceBuy: summarytypePerformanceBuyDTO
    }, event.SessionKey, event.SecurityToken, 'GetSummaryTypes'));

  } catch (error) {
    console.error('❌ Error fetching summary types:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_SUMMARY_TYPES_SUCCESS: false,
      GET_SUMMARY_TYPES_MESSAGE: 'Server error fetching summary types.',
    }, event.SessionKey, event.SecurityToken, 'GetSummaryTypes'));
  }
};

const handleGetSubPerformanceById = async (event, res) => {
  try {
    const performanceId = event.Body?.PerformanceId;

    if (!performanceId) {
      return res.status(400).json(createWebBaseEvent({
        GET_SUB_PERFORMANCE_BY_ID_SUCCESS: false,
        GET_SUB_PERFORMANCE_BY_ID_MESSAGE: 'Performance ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetSubPerformanceById'));
    }

    console.log(`🔍 Fetching sub performances for performance ID: ${performanceId}`);

    const subPerformanceQuery = `
      SELECT *
      FROM project_performance_freeprofessional_assigned
      WHERE performanceid = $1
    `;

    const subPerformanceResult = await pool.query(subPerformanceQuery, [performanceId]);

    if (subPerformanceResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_SUB_PERFORMANCE_BY_ID_SUCCESS: false,
        GET_SUB_PERFORMANCE_BY_ID_MESSAGE: 'No sub performances found for this performance ID.',
      }, event.SessionKey, event.SecurityToken, 'GetSubPerformanceById'));
    }

    const subPerformanceFreeProfessionalDTO = subPerformanceResult.rows.map(row => ({
      id: row.id,
      code: row.code,
      performanceId: row.performanceid,
      freeProfessionalId: row.freeprofessionalid,
      freeProfessionalWorkHours: row.free_professional_work_hours,
      freeProfessionalTravelHours: row.free_professional_travel_hours,
      freeProfessionalTravelExpenses: row.free_professional_travel_expenses,
      totalFreeProfessionalData: row.total_free_professional_data,
      documentIncreaseWorkingHours: row.documentincreaseworkinghours,
      justifyChangeEstimatedWorkHours: row.justify_change_estimated_work_hours,
      technicalDirectorDate: row.technical_director_date,
      technicalDirectorWorkHours: row.technical_director_work_hours,
      acceptIncreaseInHours: row.acceptincreaseinhours,
      revised: row.revised,
    }));

    console.log(`📄 Retrieved sub performances: ${JSON.stringify(subPerformanceFreeProfessionalDTO, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_SUB_PERFORMANCE_BY_ID_SUCCESS: true,
      subPerformances: subPerformanceFreeProfessionalDTO
    }, event.SessionKey, event.SecurityToken, 'GetSubPerformanceById'));

  } catch (error) {
    console.error('❌ Error fetching sub performances by performance ID:', error);

    return res.status(500).json(createWebBaseEvent({
      GET_SUB_PERFORMANCE_BY_ID_SUCCESS: false,
      GET_SUB_PERFORMANCE_BY_ID_MESSAGE: 'Server error fetching sub performances by performance ID.',
    }, event.SessionKey, event.SecurityToken, 'GetSubPerformanceById'));
  }
};

const handleAssignClaimsToFreeProfessionalTR = async (event, res) => {
  try {
    const assignationFreeProfessionalToClaim = event.Body;
    const freeprofessionalClaim = {
      Id: uuidv4(),
      Claimid: assignationFreeProfessionalToClaim.ClaimId,
      Freeprofessionalid: assignationFreeProfessionalToClaim.FreeProfessionalId
    };

    console.log(`🔍 Fetching claim with ID: ${freeprofessionalClaim.Claimid}`);
    const claimQuery = await pool.query('SELECT * FROM claim_file WHERE id = $1', [freeprofessionalClaim.Claimid]);

    if (claimQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_SUCCESS: false,
        ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_MESSAGE: 'Claim not found.',
      }, event.SessionKey, event.SecurityToken, 'AssignClaimsToFreeProfessionalTR'));
    }

    const claim = claimQuery.rows[0];
    claim.Status = 'Running';

    console.log(`🔄 Updating claim status to 'Running' for claim ID: ${freeprofessionalClaim.Claimid}`);
    await pool.query('UPDATE claim_file SET status = $1 WHERE id = $2', [claim.Status, freeprofessionalClaim.Claimid]);

    console.log('💾 Inserting free professional claim:', freeprofessionalClaim);
    await pool.query('INSERT INTO freeprofessional_claim (id, claimid, freeprofessionalid) VALUES ($1, $2, $3)', [
      freeprofessionalClaim.Id,
      freeprofessionalClaim.Claimid,
      freeprofessionalClaim.Freeprofessionalid
    ]);

    console.log('✅ Free professional successfully assigned to claim.');
    return res.status(200).json(createWebBaseEvent({
      ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_SUCCESS: true,
      ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_MESSAGE: 'It is correctly assigned to the claim.'
    }, event.SessionKey, event.SecurityToken, 'AssignClaimsToFreeProfessionalTR'));

  } catch (error) {
    console.error('❌ Error assigning claims to free professional TR:', error);
    return res.status(500).json(createWebBaseEvent({
      ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_SUCCESS: false,
      ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_MESSAGE: 'Server error assigning claims to free professional TR.',
    }, event.SessionKey, event.SecurityToken, 'AssignClaimsToFreeProfessionalTR'));
  }
};

const handleGettingFreeProfessionalsTR = async (event, res) => {
  try {
    const getFreeProfessionalTREvent = event.Body;
    const subscriberId = getFreeProfessionalTREvent.SubscriberId;

    console.log(`🔍 Fetching free professionals for subscriber ID: ${subscriberId}`);

    const subscribercustomerfreeprofessionalprocessors = await pool.query(`
      SELECT freeprofessionalid
      FROM subscribercustomerfreeprofessionalprocessor
      WHERE subscribercustomerid = $1
    `, [subscriberId]);

    const freeProfessionalsDTO = [];
    const usersDTO = [];

    for (const subfpp of subscribercustomerfreeprofessionalprocessors.rows) {
      const freeProfessionals = await pool.query(`
        SELECT *
        FROM freeprofessional
        WHERE id = $1
      `, [subfpp.freeprofessionalid]);

      for (const freeProfessional of freeProfessionals.rows) {
        const user = await pool.query(`
          SELECT *
          FROM osduser
          WHERE id = $1
        `, [freeProfessional.userid]);

        if (user.rows[0].isauthorized) {
          freeProfessionalsDTO.push(freeProfessional);
          usersDTO.push(user.rows[0]);
        }
      }
    }

    console.log('✅ Free professionals and users fetched successfully.');

    return res.status(200).json(createWebBaseEvent({
      GETTING_FREE_PROFESSIONALS_TR_SUCCESS: true,
      freeProfessionals: freeProfessionalsDTO,
      users: usersDTO
    }, event.SessionKey, event.SecurityToken, 'GettingFreeProfessionalsTR'));

  } catch (error) {
    console.error('❌ Error fetching free professionals TR:', error);

    return res.status(500).json(createWebBaseEvent({
      GETTING_FREE_PROFESSIONALS_TR_SUCCESS: false,
      GETTING_FREE_PROFESSIONALS_TR_MESSAGE: 'Server error fetching free professionals TR.',
    }, event.SessionKey, event.SecurityToken, 'GettingFreeProfessionalsTR'));
  }
};

const handleChangingOsdUserAutorizationStatus = async (event, res) => {
  try {
    const changingOsdUserAutorizationEvent = event.Body;
    const osdUserId = changingOsdUserAutorizationEvent.Id;

    console.log(`🔍 Fetching user with ID: ${osdUserId}`);
    const userQuery = await pool.query('SELECT * FROM osduser WHERE id = $1', [osdUserId]);
    if (userQuery.rows.length === 0) {
      console.log('❌ User not found.');
      return res.status(404).json(createWebBaseEvent({
        CHANGING_OSD_USER_AUTORIZATION_SUCCESS: false,
        CHANGING_OSD_USER_AUTORIZATION_MESSAGE: 'User not found.',
      }, event.SessionKey, event.SecurityToken, 'ChangingOsdUserAutorizationStatus'));
    }

    let osdUser = userQuery.rows[0];
    console.log(`🔍 User found: ${JSON.stringify(osdUser)}`);

    console.log(`🔍 Fetching number of users in the same country: ${osdUser.country}`);
    const usersInCountryQuery = await pool.query('SELECT COUNT(*) FROM osduser WHERE LOWER(TRIM(country)) = LOWER(TRIM($1))', [osdUser.country]);
    const getNumberOfUsers = parseInt(usersInCountryQuery.rows[0].count, 10);
    console.log(`🔍 Number of users in country: ${getNumberOfUsers}`);

    if (osdUser.isauthorized) {
      console.log('✅ User is already authorized.');
      return res.status(200).json(createWebBaseEvent({
        CHANGING_OSD_USER_AUTORIZATION_SUCCESS: true,
        CHANGING_OSD_USER_AUTORIZATION_MESSAGE: 'The user is already authorized.',
      }, event.SessionKey, event.SecurityToken, 'ChangingOsdUserAutorizationStatus'));
    } else {
      osdUser.isauthorized = true;

      console.log(`🔍 Fetching account type for user: ${osdUser.accounttype}`);
      const accountTypeQuery = await pool.query('SELECT * FROM accounttype WHERE id = $1', [osdUser.accounttype]);
      const accountType = accountTypeQuery.rows[0];
      console.log(`🔍 Account type: ${JSON.stringify(accountType)}`);

      if (accountType.type === 'FreeProfessional') {
        console.log(`🔍 Fetching free professional details for user: ${osdUser.id}`);
        const freeProfessionalQuery = await pool.query('SELECT * FROM freeprofessional WHERE userid = $1', [osdUser.id]);
        const freeProfessional = freeProfessionalQuery.rows[0];
        console.log(`🔍 Free professional details: ${JSON.stringify(freeProfessional)}`);

        console.log(`🔍 Fetching free professional type: ${freeProfessional.freeprofessionaltypeid}`);
        const freeProfessionalTypeQuery = await pool.query('SELECT * FROM freeprofessionaltype WHERE id = $1', [freeProfessional.freeprofessionaltypeid]);
        const freeProfessionalType = freeProfessionalTypeQuery.rows[0];
        console.log(`🔍 Free professional type: ${JSON.stringify(freeProfessionalType)}`);

        const acronym = freeProfessionalType.acronym;
        const countryCode = osdUser.country.toUpperCase().trim();
        const year = new Date().getFullYear();

        if (acronym === 'Accounting_Technician') {
          osdUser.code = `${countryCode}/AC/${getNumberOfUsers}/${year}`;
        } else if (acronym === 'Processor') {
          osdUser.code = `${countryCode}/CH/${getNumberOfUsers}/${year}`;
        } else if (acronym === 'IT_administrators') {
          osdUser.code = `${countryCode}/IT/${getNumberOfUsers}/${year}`;
        } else if (acronym === 'OSD_Systems_Engineer') {
          osdUser.code = `${countryCode}/ISOSD/${getNumberOfUsers}/${year}`;
        } else if (acronym === 'Marketing') {
          osdUser.code = `${countryCode}/MK/${getNumberOfUsers}/${year}`;
        } else if (acronym === 'Technical_Director') {
          osdUser.code = `${countryCode}/DT-TM/${getNumberOfUsers}/${year}`;
        } else if (acronym === 'Citizen_service') {
          osdUser.code = `${countryCode}/CS/${getNumberOfUsers}/${year}`;
        } else {
          osdUser.code = `${countryCode}/TC/${getNumberOfUsers}/${year}`;
        }
      } else {
        osdUser.code = `${countryCode}/CL/${getNumberOfUsers}/${year}`;
      }

      console.log(`🔄 Updating user authorization status and code: ${osdUser.code}`);
      await pool.query('UPDATE osduser SET isauthorized = $1, code = $2 WHERE id = $3', [osdUser.isauthorized, osdUser.code, osdUser.id]);

      console.log('✅ User properly authorized.');
      return res.status(200).json(createWebBaseEvent({
        CHANGING_OSD_USER_AUTORIZATION_SUCCESS: true,
        CHANGING_OSD_USER_AUTORIZATION_MESSAGE: 'User properly authorized.',
      }, event.SessionKey, event.SecurityToken, 'ChangingOsdUserAutorizationStatus'));
    }
  } catch (error) {
    console.error('❌ Error changing OSD user authorization status:', error);
    return res.status(500).json(createWebBaseEvent({
      CHANGING_OSD_USER_AUTORIZATION_SUCCESS: false,
      CHANGING_OSD_USER_AUTORIZATION_MESSAGE: 'Server error changing OSD user authorization status.',
    }, event.SessionKey, event.SecurityToken, 'ChangingOsdUserAutorizationStatus'));
  }
};

const handleAssignTrainerToSubscriber = async (event, res) => {
  try {
    const assignTrainerToSubscriberEvent = event.Body;
    const subscribercustomerfreeprofessionaltrainer = {
      Id: uuidv4(),
      Subscribercustomerid: assignTrainerToSubscriberEvent.SubscriberId,
      Freeprofessionalid: assignTrainerToSubscriberEvent.FreeProfessionalId
    };

    const insertQuery = `
      INSERT INTO subscribercustomerfreeprofessionaltrainer (id, subscribercustomerid, freeprofessionalid)
      VALUES ($1, $2, $3)
    `;

    await pool.query(insertQuery, [
      subscribercustomerfreeprofessionaltrainer.Id,
      subscribercustomerfreeprofessionaltrainer.Subscribercustomerid,
      subscribercustomerfreeprofessionaltrainer.Freeprofessionalid
    ]);

    console.log('✅ Trainer assigned to subscriber successfully.');
    res.status(200).json(createWebBaseEvent({
      ASSIGN_TRAINER_TO_SUBSCRIBER_SUCCESS: true,
      ASSIGN_TRAINER_TO_SUBSCRIBER_MESSAGE: 'Successfully assigned'
    }, event.SessionKey, event.SecurityToken, 'AssignTrainerToSubscriber'));

  } catch (error) {
    console.error('❌ Error assigning trainer to subscriber:', error);
    res.status(500).json(createWebBaseEvent({
      ASSIGN_TRAINER_TO_SUBSCRIBER_SUCCESS: false,
      ASSIGN_TRAINER_TO_SUBSCRIBER_MESSAGE: 'Server error assigning trainer to subscriber.'
    }, event.SessionKey, event.SecurityToken, 'AssignTrainerToSubscriber'));
  }
};

const handleGetProfessionalFreeTrainers = async (event, res) => {
  try {
    const professionalFreeTrainersDTO = [];
    const freeProfessionalTypeResult = await pool.query(`
      SELECT id FROM freeprofessionaltype WHERE acronym = 'FC'
    `);

    if (freeProfessionalTypeResult.rows.length === 0) {
      console.log('❌ Free professional type "Trainer" not found.');
      return res.status(404).json(createWebBaseEvent({
        GET_PROFESSIONAL_FREE_TRAINERS_SUCCESS: false,
        GET_PROFESSIONAL_FREE_TRAINERS_MESSAGE: 'Free professional type "Trainer" not found.',
      }, event.SessionKey, event.SecurityToken, 'GetProfessionalFreeTrainers'));
    }

    const freeProfessionalTypeId = freeProfessionalTypeResult.rows[0].id;
    const professionalFreeTrainersList = await pool.query(`
      SELECT * FROM freeprofessional WHERE freeprofessionaltypeid = $1
    `, [freeProfessionalTypeId]);

    for (const pft of professionalFreeTrainersList.rows) {
      const osdUserResult = await pool.query(`
        SELECT code, name, firstsurname, middlesurname, companyname FROM osduser WHERE id = $1
      `, [pft.userid]);

      if (osdUserResult.rows.length > 0) {
        const osdUser = osdUserResult.rows[0];
        professionalFreeTrainersDTO.push({
          ...pft,
          Code: osdUser.code,
          Name: osdUser.name,
          Firstname: osdUser.firstsurname,
          Middlesurname: osdUser.middlesurname,
          CompanyName: osdUser.companyname,
        });
      }
    }

    console.log('✅ Professional free trainers fetched successfully.');
    return res.status(200).json(createWebBaseEvent({
      GET_PROFESSIONAL_FREE_TRAINERS_SUCCESS: true,
      professionalFreeTrainers: professionalFreeTrainersDTO,
    }, event.SessionKey, event.SecurityToken, 'GetProfessionalFreeTrainers'));

  } catch (error) {
    console.error('❌ Error fetching professional free trainers:', error);
    return res.status(500).json(createWebBaseEvent({
      GET_PROFESSIONAL_FREE_TRAINERS_SUCCESS: false,
      GET_PROFESSIONAL_FREE_TRAINERS_MESSAGE: 'Server error fetching professional free trainers.',
    }, event.SessionKey, event.SecurityToken, 'GetProfessionalFreeTrainers'));
  }
};

const handleGetUnassignedSubscribers = async (event, res) => {
  try {
    const subscriberUnassignedListDTO = [];
    const subscriberIdsWithFreeProfessionals = await pool.query(`
      SELECT subscribercustomerid
      FROM subscribercustomerfreeprofessionaltrainer
    `);

    const subscriberIds = subscriberIdsWithFreeProfessionals.rows.map(row => row.subscribercustomerid);

    let subscribersList;
    if (subscriberIds.length > 0) {
      subscribersList = await pool.query(`
        SELECT *
        FROM subscribercustomer
        WHERE id NOT IN (${subscriberIds.map((_, i) => `$${i + 1}`).join(', ')})
      `, subscriberIds);
    } else {
      subscribersList = await pool.query(`
        SELECT *
        FROM subscribercustomer
      `);
    }

    for (const subscriber of subscribersList.rows) {
      const osduser = await pool.query(`
        SELECT companyname
        FROM osduser
        WHERE id = $1
      `, [subscriber.userid]);

      subscriber.companyName = osduser.rows[0]?.companyname || null;
      subscriberUnassignedListDTO.push(subscriber);
    }

    res.status(200).json(createWebBaseEvent({
      GET_UNASSIGNED_SUBSCRIBERS_SUCCESS: true,
      subscribers: subscriberUnassignedListDTO
    }, event.SessionKey, event.SecurityToken, 'GetUnassignedSubscribers'));

  } catch (error) {
    console.error('❌ Error fetching unassigned subscribers:', error);
    res.status(500).json(createWebBaseEvent({
      GET_UNASSIGNED_SUBSCRIBERS_SUCCESS: false,
      GET_UNASSIGNED_SUBSCRIBERS_MESSAGE: 'Server error fetching unassigned subscribers.',
    }, event.SessionKey, event.SecurityToken, 'GetUnassignedSubscribers'));
  }
};

const handleGetPerformancesProjectManagerById = async (event, res) => {
  try {
    const projectManagerId = event.Body?.ProjectManagerId;

    if (!projectManagerId) {
      return res.status(400).json(createWebBaseEvent({
        GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: false,
        GET_PERFORMANCE_ASSIGNED_BY_ID_MESSAGE: 'Project Manager ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));
    }

    console.log(`🔍 Fetching performances for Project Manager with ID: ${projectManagerId}`);

    const performancesFreeProfessionalQuery = `
      SELECT id, code, projectmanagerid, summarytypeid, start_date, end_date, justifying_document, 
             freeprofessionalcreatedperformanceid, freeprofessionalassignedid, estimated_transport_expenses, 
             estimated_transport_hours, estimated_work_hours, total_forecast_data, justifying_document_bytes
      FROM performance_freeprofessional
      WHERE projectmanagerid = $1
    `;
    const performancesBuyQuery = `
      SELECT id, code, projectmanagerid, summarytypeid, freeprofessionalid, date, productservice_id, 
             minimumunits, maximumunits, unitarycost, shelflife, justifying_document, justifying_document_bytes
      FROM performance_buy
      WHERE projectmanagerid = $1
    `;

    const performancesFreeProfessionalResult = await pool.query(performancesFreeProfessionalQuery, [projectManagerId]);
    const performancesBuyResult = await pool.query(performancesBuyQuery, [projectManagerId]);
    console.log(`📝 Result performancesFreeProfessionalResult: ${JSON.stringify(performancesFreeProfessionalResult.rows, null, 2)}
    📝 Result performancesBuyResult: ${JSON.stringify(performancesBuyResult.rows, null, 2)}`);

    const performancesFreeProfessionalDto = performancesFreeProfessionalResult.rows.map(pfp => ({
      ...pfp,
      SummaryTypeName: null,
      FreeProfessionalAssignedCode: null
    }));

    const performancesBuyDto = performancesBuyResult.rows.map(pb => ({
      ...pb,
      SummaryTypeName: null
    }));

    for (const pfDTO of performancesFreeProfessionalDto) {
      console.log(`🔍 Fetching summary type for performance free professional with ID: ${pfDTO.summarytypeid}`);
      const summaryTypeResult = await pool.query(
        'SELECT summary FROM summarytypeperformancefreeprofessional WHERE id = $1',
        [pfDTO.summarytypeid]
      );
      if (summaryTypeResult.rows.length > 0) {
        pfDTO.SummaryTypeName = summaryTypeResult.rows[0].summary;
      }

      const freeProfessionalResult = await pool.query(
        'SELECT userid FROM freeprofessional WHERE id = $1',
        [pfDTO.freeprofessionalassignedid]
      );
      if (freeProfessionalResult.rows.length > 0) {
        const userId = freeProfessionalResult.rows[0].userid;
        const userResult = await pool.query(
          'SELECT code FROM osduser WHERE id = $1',
          [userId]
        );
        if (userResult.rows.length > 0) {
          pfDTO.FreeProfessionalAssignedCode = userResult.rows[0].code;
        }
      }
    }

    for (const pfBuyDTO of performancesBuyDto) {
      console.log(`🔍 Fetching summary type for performance buy with ID: ${pfBuyDTO.summarytypeid}`);
      const summaryTypeResult = await pool.query(
        'SELECT summary FROM summarytypeperformancebuy WHERE id = $1',
        [pfBuyDTO.summarytypeid]
      );
      if (summaryTypeResult.rows.length > 0) {
        pfBuyDTO.SummaryTypeName = summaryTypeResult.rows[0].summary;
      }
    }

    console.log(`📄 Retrieved performances: ${JSON.stringify(performancesFreeProfessionalDto, null, 2)}`);

    return res.status(200).json(createWebBaseEvent({
      GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: true,
      performancesFreeProfessional: performancesFreeProfessionalDto,
      performancesBuy: performancesBuyDto
    }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));

  } catch (error) {
    console.error('❌ Error fetching performances by Project Manager ID:', error);
    return res.status(500).json(createWebBaseEvent({
      GET_PERFORMANCE_ASSIGNED_BY_ID_SUCCESS: false,
      GET_PERFORMANCE_ASSIGNED_BY_ID_MESSAGE: 'Server error fetching performances by Project Manager ID.',
    }, event.SessionKey, event.SecurityToken, 'GetPerformanceAssignedById'));
  }
};

const handleCloseClaimFile = async (event, res) => {
  try {
    const claimId = event.Body?.ClaimId;
    const rating = event.Body?.FinalRating;
    const userId = event.Body?.UserId;

    if (!claimId || !userId) {
      return res.status(400).json(createWebBaseEvent({
        CLOSE_CLAIM_FILE_SUCCESS: false,
        CLOSE_CLAIM_FILE_MESSAGE: 'Claim ID and user ID are required.',
      }, event.SessionKey, event.SecurityToken, 'CloseClaimFile'));
    }

    console.log(`🔍 Closing claim file with ID: ${claimId}`);

    // Retrieve claimantid and subscriberclaimedid from claim_file
    const claimQuery = `
      SELECT claimantid, subscriberclaimedid
      FROM claim_file
      WHERE id = $1
    `;

    const claimResult = await pool.query(claimQuery, [claimId]);

    if (claimResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        CLOSE_CLAIM_FILE_SUCCESS: false,
        CLOSE_CLAIM_FILE_MESSAGE: 'Claim not found.',
      }, event.SessionKey, event.SecurityToken, 'CloseClaimFile'));
    }

    const { claimantid, subscriberclaimedid } = claimResult.rows[0];

    let updateQuery;
    console.log(`🔍 User ID: ${userId}, Claimant ID: ${claimantid}, Subscriber ID: ${subscriberclaimedid}`);
    if (userId === claimantid) {
      // Update valuationclaimant if userId matches claimantid
      updateQuery = `
        UPDATE claim_file
        SET status = 'Closed', valuationclaimant = $2
        WHERE id = $1
        RETURNING id, status, valuationclaimant;
      `;
    } else if (userId === subscriberclaimedid) {
      // Update valuationsubscriber if userId matches subscriberclaimedid
      updateQuery = `
          UPDATE claim_file
          SET status = 'Closed', valuationsubscriber = $2
          WHERE id = $1
          RETURNING id, status, valuationsubscriber;
        `;
    } else {
      // Update valuationfreeprofessionals if userId does not match claimantid or subscriberclaimedid
      updateQuery = `
          UPDATE claim_file
          SET status = 'Closed', valuationfreeprofessionals = $2
          WHERE id = $1
          RETURNING id, status, valuationfreeprofessionals;
        `;
    }

    const updateResult = await pool.query(updateQuery, [claimId, rating]);
    console.log(`✅ Claim file closed and updated successfully: ${JSON.stringify(updateResult.rows[0], null, 2)}`);
    return res.status(200).json(createWebBaseEvent({
      CLOSE_CLAIM_FILE_SUCCESS: true,
      claim: updateResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'CloseClaimFile'));

  } catch (error) {
    console.error('❌ Error closing claim file:', error);

    return res.status(500).json(createWebBaseEvent({
      CLOSE_CLAIM_FILE_SUCCESS: false,
      CLOSE_CLAIM_FILE_MESSAGE: 'Server error closing claim file.',
    }, event.SessionKey, event.SecurityToken, 'CloseClaimFile'));
  }
};

const handleAddPerformanceUpdate = async (event, res) => {
  try {
    const performanceData = event.Body.Payload;
    console.log('🔍 Adding performance update:', performanceData);
    if (!performanceData || !performanceData.ClaimId) {
      return res.status(400).json(createWebBaseEvent({
        ADD_PERFORMANCE_UPDATE_SUCCESS: false,
        ADD_PERFORMANCE_UPDATE_MESSAGE: 'Claim ID is required.',
      }, event.SessionKey, event.SecurityToken, 'AddPerformanceUpdate'));
    }

    // Generate a unique code for the performance update
    const performanceCode = `PERF-${Math.random().toString(16).slice(2, 10)}`;


    const insertPerformanceQuery = `
      INSERT INTO performance_claim_control (
        id,
        code,
        claimid,
        status,
        dateperformance,
        justifyingdocument,
        justifyingdocumentbytes,
        summary,
        type,
        typeperformance,
        usertypeperformance
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *;
    `;

    let documentBase64 = null;
    if (performanceData.Document) {
      documentBase64 = Buffer.from(performanceData.Document).toString('base64');
    }

    console.log('📄 Inserting performance update:', performanceData);
    const result = await pool.query(insertPerformanceQuery, [
      uuidv4(), // Generate new UUID for id
      performanceCode,
      performanceData.ClaimId,
      performanceData.NewStatus || 'Running',
      performanceData.datePerformance || new Date().toISOString().split('T')[0],
      performanceData.Document || '',
      documentBase64 || null,
      performanceData.Summary,
      performanceData.type || 8,
      performanceData.typePerformance || 'Complaint',
      performanceData.userTypePerformance || 'CLAIMANT'
    ]);

    // Update claim_file with new fields
    const updateClaimFileQuery = `
      UPDATE claim_file
      SET 
        status = $1,
        creditingdate = $2,
        amountpaid = $3,
        improvementsavings = $4
      WHERE id = $5
      RETURNING *;
    `;

    const updateResult = await pool.query(updateClaimFileQuery, [
      performanceData.NewStatus,
      performanceData.CreditingDate,
      performanceData.AmountPaid,
      performanceData.ImprovementSavings,
      performanceData.ClaimId
    ]);

    console.log('✅ Performance update added successfully:', result.rows[0]);
    console.log('✅ Claim file updated successfully:', updateResult.rows[0]);

    return res.status(200).json(createWebBaseEvent({
      ADD_PERFORMANCE_UPDATE_SUCCESS: true,
      ADD_PERFORMANCE_UPDATE_MESSAGE: 'Performance update added successfully',
      performanceUpdate: result.rows[0],
      updatedClaimFile: updateResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'AddPerformanceUpdate'));

  } catch (error) {
    console.error('❌ Error adding performance update:', error);

    return res.status(500).json(createWebBaseEvent({
      ADD_PERFORMANCE_UPDATE_SUCCESS: false,
      ADD_PERFORMANCE_UPDATE_MESSAGE: 'Server error adding performance update.',
    }, event.SessionKey, event.SecurityToken, 'AddPerformanceUpdate'));
  }
};

const handleGetCFHReports = async (event, res) => {
  try {
    console.log('🔍 Fetching CFH reports');

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

    // Structure to group rows into Formador/Consultor and Tecnico OSD
    const data = {
      formadorConsultor: {
        online: {
          cfhIngresos: 0,
          alumnos: 0,
          alumnosAprobados: 0,
          beneficios: 'Becas online',
        },
        presencial: {
          cfhIngresos: 0,
          alumnos: 0,
          alumnosAprobados: 0,
          beneficios: 'Becas presencial',
        },
      },
      tecnicoOSD: {
        online: {
          cfhIngresos: 0,
          alumnos: 0,
          alumnosAprobados: 0,
          beneficios: 'Becas online',
        },
        presencial: {
          cfhIngresos: 0,
          alumnos: 0,
          alumnosAprobados: 0,
          beneficios: 'Becas presencial',
        },
      },
    };

    // Process the query results
    cfhResult.rows.forEach((row) => {
      const { title, mode, cost, alumnos, alumnosAprobados } = row;

      if (title.includes('Formador & Consultor')) {
        if (mode === 'online') {
          data.formadorConsultor.online.cfhIngresos += Number(cost) * Number(alumnos);
          data.formadorConsultor.online.alumnos += Number(alumnos);
          data.formadorConsultor.online.alumnosAprobados += Number(alumnosAprobados);
        } else if (mode === 'presencial') {
          data.formadorConsultor.presencial.cfhIngresos += Number(cost) * Number(alumnos);
          data.formadorConsultor.presencial.alumnos += Number(alumnos);
          data.formadorConsultor.presencial.alumnosAprobados += Number(alumnosAprobados);
        }
      } else if (title.includes('Técnico OSD')) {
        if (mode === 'online') {
          data.tecnicoOSD.online.cfhIngresos += Number(cost) * Number(alumnos);
          data.tecnicoOSD.online.alumnos += Number(alumnos);
          data.tecnicoOSD.online.alumnosAprobados += Number(alumnosAprobados);
        } else if (mode === 'presencial') {
          data.tecnicoOSD.presencial.cfhIngresos += Number(cost) * Number(alumnos);
          data.tecnicoOSD.presencial.alumnos += Number(alumnos);
          data.tecnicoOSD.presencial.alumnosAprobados += Number(alumnosAprobados);
        }
      }
    });

    const cfhResultItemsArray = [data];

    console.log('✅ CFH reports data compiled:', cfhResultItemsArray);

    for (item of cfhResultItemsArray) {
      console.log('📄 CFH report:', JSON.stringify(item, null, 2))
    };

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

    const claimFileQuery = `
      SELECT
        id, code, datecreated, status, subscriberclaimedid, claimantid, claimtype,
        serviceprovided, facts, amountclaimed, documentfile1id, documentfile1name,
        documentfile2id, documentfile2name, creditingdate, amountpaid, improvementsavings,
        valuationsubscriber, valuationclaimant, valuationfreeprofessionals
      FROM claim_file
      WHERE id = $1
    `;

    const claimFileResult = await pool.query(claimFileQuery, [claimId]);

    if (claimFileResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_PERFORMANCES_CLAIM_BY_ID_SUCCESS: false,
        GET_PERFORMANCES_CLAIM_BY_ID_MESSAGE: 'No claim file found for this claim ID.',
      }, event.SessionKey, event.SecurityToken, 'GetPerformancesClaimById'));
    }

    console.log(`📄 Retrieved claim file details: ${JSON.stringify(claimFileResult.rows[0], null, 2)}`);
    return res.status(200).json(createWebBaseEvent({
      GET_PERFORMANCES_CLAIM_BY_ID_SUCCESS: true,
      performanceClaims: performanceClaimResult.rows,
      claimDetails: claimFileResult.rows[0]
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
      ClaimantId = null, // Default to null if not provided
      Email = null
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
    let subscriberClaimedId = subscriberQuery.rows[0].id;

    let claimantId = null;
    if (ClaimantId !== null || Email !== null) {
      console.log('🚹 Checking if user is a claimant: ', ClaimantId, Email);
      const claimantQuery = await pool.query(
        'SELECT id FROM osduser WHERE identity = $1 OR email = $2',
        [ClaimantId, Email]
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

    console.log("🚹 Checking if user is a subscriber getting claimed: ", subscriberClaimedId);
    if (subscriberClaimedId !== null) {
      const subscriberCustomerQuery = await pool.query(
        'SELECT id FROM subscribercustomer WHERE userid = $1',
        [subscriberClaimedId]
      );

      if (subscriberCustomerQuery.rows.length === 0) {
        console.log('💥 Subscriber not found, inserting new subscriber');
        const insertSubscriberCustomerQuery = `
      INSERT INTO subscribercustomer (id, userid, clienttype)
      VALUES ($1, $2, 'Subscriber')
      `;
        await pool.query(insertSubscriberCustomerQuery, [subscriberClaimedId, subscriberClaimedId]);
      } else {
        subscriberClaimedId = subscriberCustomerQuery.rows[0].id;
      }
    }

    if (claimantId) {
      console.log("🚹 Checking if user is a claimant: ", claimantId);
      const claimantExistsQuery = `
        SELECT 1 FROM claimant WHERE id = $1
      `;
      const claimantExistsResult = await pool.query(claimantExistsQuery, [claimantId]);

      if (claimantExistsResult.rows.length === 0) {
        console.log('💥 Claimant not found, inserting new claimant');
        const insertClaimantQuery = `
          INSERT INTO claimant (id, userid)
          VALUES ($1, $2)
        `;
        await pool.query(insertClaimantQuery, [claimantId, claimantId]);
      }
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
    console.log('🔐 Registering user:', personalForm, 'with Account Info', accountForm);

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

      let referId = null;
      if (accountForm.emailOfRefer) {
        const referResult = await pool.query(
          'SELECT id FROM osduser WHERE email = $1',
          [accountForm.emailOfRefer]
        );
        if (referResult.rows.length > 0) {
          referId = referResult.rows[0].id;
        }
      }

      const insertOsdUserQuery = `
        INSERT INTO osduser (
          id, code, accounttype, identity, name, firstsurname, middlesurname, city,
          companyname, address, zipcode, country, landline, mobilephone, email, password, web,
          isauthorized, isadmin, offering_type, refeer
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
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
        false,
        false,
        accountForm.cfhOffer,
        referId
      ]);

      userId = osdUserResult.rows[0].id;
    } else {
      userId = userExists.rows[0].id;
      console.log('✅ User already exists in osduser with ID:', userId);
    }

    console.log("✅ Successfully created user with ID:", userId);

    const accountTypeId = accountForm.accountType || personalForm.accountType;

    if (accountTypeId === '8e539a42-4108-4be6-8f77-2d16671d1069') {
      const coursesResult = await pool.query('SELECT * FROM courses');
      const insertedCourseIds = new Set();
      for (const course of coursesResult.rows) {
        const newCourseId = uuidv4();

        if (insertedCourseIds.has(newCourseId)) {
          console.error(`❌ Duplicate newCourseId detected: ${newCourseId}. Stopping the insertion process.`);
          break;
        }

        const newTitle = `${course.title} (${personalForm.companyName})`;

        await pool.query(
          `INSERT INTO courses (
        id, osduser_id, title, cost, mode
        ) VALUES (
        $1, $2, $3, $4, $5F
        )`,
          [
            newCourseId,
            userId,
            newTitle,
            course.cost,
            course.mode
          ]
        );
        insertedCourseIds.add(newCourseId);
      }
      console.log('✅ Courses copied successfully for the new user.');
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
        accountForm.course || null
      ]);

      console.log('✅ FreeProfessional record created successfully.');

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
        fp.paytpv,
        u.name AS username,
        u.companyname AS usercompanyname,
        (SELECT COUNT(*) FROM osduser WHERE refeer = fp.userid) AS n_refeers
      FROM freeprofessional fp
      LEFT JOIN freeprofessionaltype fpt ON fp.freeprofessionaltypeid = fpt.id
      LEFT JOIN osduser u ON fp.userid = u.id
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

    console.log(`📚 Fetching courses for user with ID: ${userId}`);

    let courseQuery;
    let queryParams;

    // Check if the user ID matches the special case
    if (userId === 'e77b5172-f726-4c1d-9f9e-d2dbd77e03c9') {
      console.log('📖 Special user detected, retrieving all courses.');

      // Query to fetch all courses
      courseQuery = `
        SELECT id, osduser_id, title, cost, mode
        FROM courses
      `;
      queryParams = [];
    } else {
      // Query to fetch courses for a specific professor
      const professorCoursesQuery = `
        SELECT course_id
        FROM professores
        WHERE professor_id = $1
        UNION
        SELECT id AS course_id
        FROM courses
        WHERE osduser_id = $1
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
      const formattedCourseIds = courseIds.map(id => id.trim());

      console.log(`📖 Professor is teaching courses with IDs: ${formattedCourseIds.join(', ')}`);

      if (formattedCourseIds.length === 0) {
        console.log('⚠️ No valid course IDs found for this professor.');
        return res.status(404).json(createWebBaseEvent({
          GET_COURSE_BY_USERID_SUCCESS: false,
          GET_COURSE_BY_USERID_MESSAGE: 'No valid course IDs found for this professor.',
        }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
      }

      courseQuery = `
        SELECT id, osduser_id, title, cost, mode
        FROM courses
        WHERE id = ANY($1::uuid[])
      `;
      queryParams = [formattedCourseIds];
    }

    const courseResult = await pool.query(courseQuery, queryParams);
    console.log(`📚 Result of Query`, courseResult.rows);

    if (courseResult.rows.length === 0) {
      console.log('⚠️ No course details found.');
      return res.status(404).json(createWebBaseEvent({
        GET_COURSE_BY_USERID_SUCCESS: false,
        GET_COURSE_BY_USERID_MESSAGE: 'No course details found.',
      }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
    }

    console.log(`📖 Retrieved course details:`, courseResult.rows);

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

const handleLogUserAction = async (req, res) => {
  try {
    const { userId, action, pageUrl, elementClicked, additionalInfo } = req.Body?.LogData || {};

    if (!userId || !action) {
      return res.status(400).json({ success: false, message: 'User ID and action are required.' });
    }

    // Format additionalInfo as a JSON string
    const formattedAdditionalInfo = additionalInfo ? JSON.stringify(additionalInfo) : null;

    const logQuery = `
      INSERT INTO user_action_logs (user_id, action, page_url, element_clicked, additional_info)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(logQuery, [
      userId,
      action,
      pageUrl || null,
      elementClicked || null,
      formattedAdditionalInfo
    ]);

    res.status(200).json({ success: true, message: 'Action logged successfully.' });
  } catch (error) {
    console.error('Error logging user action:', error);
    res.status(500).json({ success: false, message: 'Server error logging action.' });
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

    let studentsQuery;
    let studentsResult;

    if (userId === 'e77b5172-f726-4c1d-9f9e-d2dbd77e03c9') {
      console.log('🔍 Fetching all students from all courses');
      studentsQuery = `
        SELECT sr.*, c.title AS course_name
        FROM student_records sr
        LEFT JOIN courses c ON sr.course_id = c.id
      `;
      studentsResult = await pool.query(studentsQuery);
    } else {
      // Step 1: Fetch course IDs where the professor is teaching
      const professorCoursesQuery = `
        SELECT course_id
        FROM professores
        WHERE professor_id = $1
        UNION
        SELECT id AS course_id
        FROM courses
        WHERE osduser_id = $1
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

      // Step 2: Fetch students enrolled in these courses along with course names
      studentsQuery = `
        SELECT sr.*, c.title AS course_name
        FROM student_records sr
        LEFT JOIN courses c ON sr.course_id = c.id
        WHERE sr.course_id = ANY($1::uuid[])
      `;

      studentsResult = await pool.query(studentsQuery, [courseIds]);
    }

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
      u.name,
      u.email,
      u.identity,
      u.isauthorized,
      sc.clienttype,
      sc.id AS scid,
      sc.userid AS scuserid,
      (
      SELECT ou.name
      FROM subscribercustomerfreeprofessionaltrainer scfpt
      LEFT JOIN freeprofessional fpt ON scfpt.freeprofessionalid = fpt.id
      LEFT JOIN osduser ou ON fpt.userid = ou.id
      WHERE scfpt.subscribercustomerid = sc.id OR scfpt.freeprofessionalid = fp.id
      LIMIT 1
      ) AS trainerAssigned
      FROM freeprofessional fp
      LEFT JOIN freeprofessionaltype fpt ON fp.freeprofessionaltypeid = fpt.id
      LEFT JOIN osduser u ON fp.userid = u.id
      LEFT JOIN subscribercustomer sc ON u.id = sc.userid
      UNION
      SELECT
      NULL AS id,
      u.id AS userid,
      NULL AS freeprofessionaltypeid,
      NULL AS "FreeprofessionaltypeAcronym",
      NULL AS identificationfileid,
      NULL AS identificationfilename,
      NULL AS curriculumvitaefileid,
      NULL AS curriculumvitaefilename,
      NULL AS civilliabilityinsurancefileid,
      NULL AS civilliabilityinsurancefilename,
      NULL AS servicerates,
      NULL AS paytpv,
      u.country,
      u.name,
      u.email,
      u.identity,
      u.isauthorized,
      NULL AS clienttype,
      NULL AS scid,
      NULL AS scuserid,
      NULL AS trainerAssigned
      FROM osduser u
      WHERE u.accounttype = '063e12fa-33db-47f3-ac96-a5bdb08ede61'
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