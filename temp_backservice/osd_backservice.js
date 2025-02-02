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
    await pool.query('SELECT 1');
    res.status(200).json({
      success: true,
      message: 'API connection successful',
      timestamp: new Date().toISOString(),
    });

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

      case 'UpdateClaim':
        await handleUpdateClaim(event, res);
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

      case 'GetDatabaseChangeLogs':
        await handleGetDatabaseChangeLogs(event, res);
        break;

      case 'GetUserActionLogs':
        await handleGetUserActionLogs(event, res);
        break;

      case 'GetUsers':
        await handleGetUsers(event, res);
        break;

      case 'GetHorasReport':
        await handleGetHorasReport(event, res);
        break;

      case 'AddPerformanceFreeProfessional':
        await handleAddPerformanceFreeProfessional(event, res);
        break;

      case 'AddSummaryType':
        await handleAddSummaryType(event, res);
        break;

      case 'CreateProject':
        await handleCreateProject(event, res);
        break;

      case 'CreatePerformanceBuy':
        await handleCreatePerformanceBuy(event, res);
        break;

      case 'UpdateProjectDetails':
        await handleUpdateProjectDetails(event, res);
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
    //   const { email, course_id } = req.body;
    //   if (!email || !course_id) {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Email and course_id are required.'
    //     });
    //   }

    //   const approvalQuery = `
    //     SELECT sr.*
    //     FROM student_records sr
    //     INNER JOIN osduser u ON sr.user_id = u.id
    //     WHERE u.email = $1
    //       AND sr.course_id = $2
    //       AND sr.status = 'Approved'
    //   `;

    //   const result = await pool.query(approvalQuery, [email, course_id]);
    //   if (result.rows.length === 0) {
    //     return res.status(200).json({
    //       approved: false,
    //       message: 'User is not approved for the selected course.'
    //     });
    //   }

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
           at.type AS account_type,
           fp.freeprofessionaltypeid AS free_professional_type_id
      FROM osduser u
      LEFT JOIN accounttype at ON u.accounttype = at.id
      LEFT JOIN freeprofessional fp ON u.id = fp.userid AND at.type = 'FreeProfessional'
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
          FreeProfessionalTypeID: user.free_professional_type_id,
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


    const NewUserId = updateResult.rows[0].cfh_id;
    const subscriberCustomerQuery = `
      SELECT id FROM subscribercustomer WHERE id = $1
    `;
    const subscriberCustomerResult = await pool.query(subscriberCustomerQuery, [NewUserId]);

    if (subscriberCustomerResult.rows.length === 0) {
      const insertSubscriberCustomerQuery = `
      INSERT INTO subscribercustomer (id, userid, clienttype)
      VALUES ($1, $2, 'Subscriber')
      `;
      await pool.query(insertSubscriberCustomerQuery, [NewUserId, NewUserId]);
    } else {
    }

    const freeProfessionalQuery = `
      SELECT id FROM freeprofessional WHERE userid = $1
    `;
    const freeProfessionalResult = await pool.query(freeProfessionalQuery, [userId]);

    if (freeProfessionalResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        ADD_FREE_PROFESSIONAL_TO_CFH_SUCCESS: false,
        ADD_FREE_PROFESSIONAL_TO_CFH_MESSAGE: 'FreeProfessional not found.',
      }, event.SessionKey, event.SecurityToken, 'AddFreeProfessionalToCFH'));
    }

    const NewFreeProfessionalId = freeProfessionalResult.rows[0].id;

    const insertProcessorQuery = `
      INSERT INTO subscribercustomerfreeprofessionalprocessor (id, subscribercustomerid, freeprofessionalid)
      VALUES ($1, $2, $3)
    `;

    await pool.query(insertProcessorQuery, [
      uuidv4(),
      NewUserId,
      NewFreeProfessionalId
    ]);


    const updateClaimFileQuery = `
      UPDATE claim_file
      SET processor_id = $1
      WHERE subscriberclaimedid = $2
    `;

    await pool.query(updateClaimFileQuery, [NewFreeProfessionalId, NewUserId]);


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

    const { country, SubscriberId } = event.Body;

    if (country && !SubscriberId) {
      const usersResult = await pool.query(`SELECT id FROM osduser WHERE country = $1`, [country]);

      if (usersResult.rows.length > 0) {
        const osdUsers = usersResult.rows;
        let subscriberCustomers = [];

        for (const user of osdUsers) {
          const subResult = await pool.query(`SELECT id FROM subscribercustomer WHERE userid = $1`, [user.id]);
          if (subResult.rows.length > 0) {
            subscriberCustomers = subscriberCustomers.concat(subResult.rows);
          }
        }

        if (subscriberCustomers.length > 0) {
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
      const claimResult = await pool.query(`
        SELECT id, amountclaimed, amountpaid, improvementsavings 
        FROM claim_file 
        WHERE status IN ('Completed', 'Closed') AND subscriberclaimedid = $1
      `, [SubscriberId]);
      claimList = claimResult.rows;
    } else {
      const claimResult = await pool.query(`
        SELECT id, amountclaimed, amountpaid, improvementsavings 
        FROM claim_file 
        WHERE status IN ('Completed', 'Closed')
      `);
      claimList = claimResult.rows;
    }


    for (const claim of claimList) {
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
      cf.complaint,
      cf.appeal,
      cf.solution_suggestion,
      cf.solution_appeal,
      cf.solution,
      cf.solution_complaint,
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

    // Check freeprofessionaltypeid in freeprofessional table
    const freeProfessionalTypeQuery = await pool.query(
      'SELECT freeprofessionaltypeid FROM freeprofessional WHERE userid = $1',
      [userId]
    );


    let freeProfessionalTypeId;
    if (freeProfessionalTypeQuery.rows.length === 0) {
      freeProfessionalTypeId = null;
    } else {
      freeProfessionalTypeId = freeProfessionalTypeQuery.rows[0].freeprofessionaltypeid;
    }

    let claimsQuery;
    let queryParams = [];

    console.log('freeProfessionalTypeId:', freeProfessionalTypeId, 'userId:', userId);
    if (userId === 'e77b5172-f726-4c1d-9f9e-d2dbd77e03c9') {
      claimsQuery = `
        SELECT cf.*, u.accounttype, u.identity, u.name, u.firstsurname, u.middlesurname, u.city, 
               u.companyname, u.address, u.zipcode, u.country, u.landline, u.mobilephone, u.email, 
               u.password, u.web, u.isauthorized, u.isadmin
        FROM claim_file cf
        LEFT JOIN osduser u ON cf.subscriberclaimedid = u.id
        LEFT JOIN subscribercustomer sc ON cf.subscriberclaimedid = sc.id
      `;

    } else if (freeProfessionalTypeId === 'eea2312e-6a85-4ab6-85ff-0864547e3870') {
      claimsQuery = `SELECT cf.*, 
       u.accounttype, u.identity, u.name, u.firstsurname, u.middlesurname, u.city, 
       u.companyname, u.address, u.zipcode, u.country, u.landline, u.mobilephone, 
       u.email, u.password, u.web, u.isauthorized, u.isadmin,
       trainer_user.name AS trainer_name  -- Fetch trainer's name instead of ID
      FROM claim_file cf
      LEFT JOIN osduser u ON cf.subscriberclaimedid = u.id
      LEFT JOIN subscribercustomer sc ON cf.subscriberclaimedid = sc.id
      LEFT JOIN freeprofessional trainer_fp ON u.assignedtrainer = trainer_fp.id  -- Link assigned trainer (from osduser.assignedtrainer)
      LEFT JOIN osduser trainer_user ON trainer_fp.userid = trainer_user.id  -- Get trainer’s user details
      WHERE trainer_user.id = $1;`;
      queryParams = [userId];
    } else {
      claimsQuery = `
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
            OR cf.id IN (
            SELECT claimid 
            FROM freeprofessional_claim 
            WHERE freeprofessionalid = (
              SELECT id 
              FROM freeprofessional 
              WHERE userid = $1
            )
            )
      `;
      queryParams = [userId];
    }

    const claimsResult = await pool.query(claimsQuery, queryParams);

    if (claimsResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_CLAIMS_SUCCESS: false,
        GET_CLAIMS_MESSAGE: 'No claims found for this user.',
      }, event.SessionKey, event.SecurityToken, 'GettingClaims'));
    }

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

    const freeProfessionalQuery = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1',
      [addResponsePerformanceAssignedEvent.UserId]
    );

    if (freeProfessionalQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'AddResponseToPerformanceAssigned'));
    }

    const freeProfessionalId = freeProfessionalQuery.rows[0].id;

    const performanceFreeProfessionalQuery = await pool.query(
      'SELECT id, code FROM performance_freeprofessional WHERE id = $1',
      [addResponsePerformanceAssignedEvent.PerformanceAssignedId]
    );

    if (performanceFreeProfessionalQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        ADD_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Performance free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'AddResponseToPerformanceAssigned'));
    }

    const performanceFreeProfessional = performanceFreeProfessionalQuery.rows[0];

    const projectPerformanceFreeProfessionalAssignedCountQuery = await pool.query(
      'SELECT COUNT(*) FROM project_performance_freeprofessional_assigned WHERE performanceid = $1',
      [performanceFreeProfessional.id]
    );

    const projectPerformanceFreeProfessionalAssignedCount = parseInt(projectPerformanceFreeProfessionalAssignedCountQuery.rows[0].count, 10);

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
      console.warn('handleDeleteStudentRecord: Student name is required.');
      return res.status(400).json(createWebBaseEvent({
        DELETE_STUDENT_RECORD_SUCCESS: false,
        DELETE_STUDENT_RECORD_MESSAGE: 'Student name is required.',
      }, event.SessionKey, event.SecurityToken, 'DeleteStudentRecord'));
    }


    const deleteQuery = await pool.query(
      'DELETE FROM student_records WHERE name = $1 RETURNING *',
      [studentName]
    );

    if (deleteQuery.rows.length === 0) {
      console.warn('handleDeleteStudentRecord: Student record not found.');
      return res.status(404).json(createWebBaseEvent({
        DELETE_STUDENT_RECORD_SUCCESS: false,
        DELETE_STUDENT_RECORD_MESSAGE: 'Student record not found.',
      }, event.SessionKey, event.SecurityToken, 'DeleteStudentRecord'));
    }


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

    const freeProfessionalQuery = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1',
      [modifyResponsePerformanceAssignedEvent.UserId]
    );

    if (freeProfessionalQuery.rows.length === 0) {
      console.warn('handleModifyResponseToPerformanceAssigned: Free professional not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'Free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyResponsePerformanceAssigned'));
    }

    const freeProfessionalId = freeProfessionalQuery.rows[0].id;


    let projectPerformanceFreeprofessionalAssigned = await pool.query(
      'SELECT * FROM project_performance_freeprofessional_assigned WHERE freeprofessionalid = $1',
      [freeProfessionalId]
    );

    if (projectPerformanceFreeprofessionalAssigned.rows.length === 0) {
      console.warn('handleModifyResponseToPerformanceAssigned: SubPerformance not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_SUCCESS: false,
        MODIFY_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE: 'SubPerformance not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyResponsePerformanceAssigned'));
    }

    projectPerformanceFreeprofessionalAssigned = projectPerformanceFreeprofessionalAssigned.rows[0];


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

    let performanceFreeprofessional = await pool.query(
      'SELECT * FROM performance_freeprofessional WHERE id = $1',
      [performanceId]
    );

    if (performanceFreeprofessional.rows.length === 0) {
      console.warn('handleModifyPerformanceFreeProfessional: Performance not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: false,
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Performance not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyPerformanceFreeProfessional'));
    }

    performanceFreeprofessional = performanceFreeprofessional.rows[0];
    performanceFreeprofessional.summarytypeid = addPerformancFPEvent.SummaryId;
    performanceFreeprofessional.start_date = addPerformancFPEvent.StartDate;
    performanceFreeprofessional.end_date = addPerformancFPEvent.EndDate;
    performanceFreeprofessional.justifying_document = addPerformancFPEvent.JustifyingDocument;

    const freeprofessional = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1 OR id = $1',
      [performanceFreeprofessional.freeprofessionalassignedid]
    );

    if (freeprofessional.rows.length === 0) {
      console.warn('handleModifyPerformanceFreeProfessional: Free professional not found.');
      return res.status(404).json(createWebBaseEvent({
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: false,
        MODIFY_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'ModifyPerformanceFreeProfessional'));
    }

    performanceFreeprofessional.freeprofessionalcreatedperformanceid = freeprofessional.rows[0].id;
    performanceFreeprofessional.estimated_transport_expenses = addPerformancFPEvent.ForecastTravelExpenses;
    performanceFreeprofessional.estimated_transport_hours = addPerformancFPEvent.ForecastTravelTime;
    performanceFreeprofessional.estimated_work_hours = addPerformancFPEvent.ForecastWorkHours;
    performanceFreeprofessional.total_forecast_data = addPerformancFPEvent.TotalForecastData;

    // Optional fields
    if (addPerformancFPEvent.developer_module !== undefined) {
      performanceFreeprofessional.developer_module = addPerformancFPEvent.developer_module;
    }
    if (addPerformancFPEvent.developer_screen_form !== undefined) {
      performanceFreeprofessional.developer_screen_form = addPerformancFPEvent.developer_screen_form;
    }
    if (addPerformancFPEvent.developer_category !== undefined) {
      performanceFreeprofessional.developer_category = addPerformancFPEvent.developer_category;
    }
    if (addPerformancFPEvent.developer_activity !== undefined) {
      performanceFreeprofessional.developer_activity = addPerformancFPEvent.developer_activity;
    }


    await pool.query(
      `UPDATE performance_freeprofessional
       SET start_date = $1, end_date = $2, justifying_document = $3,
       freeprofessionalcreatedperformanceid = $4, estimated_transport_expenses = $5, estimated_transport_hours = $6,
       estimated_work_hours = $7, total_forecast_data = $8, summarytypeid = $9,
       developer_module = $10, developer_category = $11, developer_activity = $12,
       developer_screen_form = $13
       WHERE id = $14`,
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
        performanceFreeprofessional.developer_module,
        performanceFreeprofessional.developer_category,
        performanceFreeprofessional.developer_activity,
        performanceFreeprofessional.developer_screen_form,
        performanceId
      ]
    );


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


    const summarytypesPerformanceFreeProfessionalList = await pool.query('SELECT * FROM summarytypeperformancefreeprofessional');
    const summarytypesPerformanceBuyList = await pool.query('SELECT * FROM summarytypeperformancebuy');

    summarytypePerformanceFreeProfessionalDTO.push(...summarytypesPerformanceFreeProfessionalList.rows);
    summarytypePerformanceBuyDTO.push(...summarytypesPerformanceBuyList.rows);


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
    console.log('📥 Received event:', event);

    const assignationFreeProfessionalToClaim = event.Body;
    console.log('🔍 Extracted assignation details:', assignationFreeProfessionalToClaim);

    const freeprofessionalClaim = {
      Id: uuidv4(),
      Claimid: assignationFreeProfessionalToClaim.ClaimId,
      Freeprofessionalid: assignationFreeProfessionalToClaim.FreeProfessionalId
    };
    console.log('🆔 Generated freeprofessionalClaim object:', freeprofessionalClaim);

    const claimQuery = await pool.query('SELECT * FROM claim_file WHERE id = $1', [freeprofessionalClaim.Claimid]);
    console.log('🔍 Claim query result:', claimQuery.rows);

    if (claimQuery.rows.length === 0) {
      console.warn('⚠️ Claim not found for ID:', freeprofessionalClaim.Claimid);
      return res.status(404).json(createWebBaseEvent({
        ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_SUCCESS: false,
        ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_MESSAGE: 'Claim not found.',
      }, event.SessionKey, event.SecurityToken, 'AssignClaimsToFreeProfessionalTR'));
    }

    const claim = claimQuery.rows[0];
    claim.Status = 'Running';
    console.log('🔄 Updated claim status to Running for claim ID:', freeprofessionalClaim.Claimid);

    await pool.query('UPDATE claim_file SET status = $1 WHERE id = $2', [claim.Status, freeprofessionalClaim.Claimid]);
    console.log('✅ Claim status updated in database.');

    const freeProfessionalResult = await pool.query('SELECT id FROM freeprofessional WHERE userid = $1', [freeprofessionalClaim.Freeprofessionalid]);
    if (freeProfessionalResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_SUCCESS: false,
        ASSIGN_CLAIMS_TO_FREE_PROFESSIONAL_TR_MESSAGE: 'Free professional not found.',
      }, event.SessionKey, event.SecurityToken, 'AssignClaimsToFreeProfessionalTR'));
    }

    const freeProfessionalId = freeProfessionalResult.rows[0].id;

    await pool.query('INSERT INTO freeprofessional_claim (id, claimid, freeprofessionalid) VALUES ($1, $2, $3)', [
      freeprofessionalClaim.Id,
      freeprofessionalClaim.Claimid,
      freeProfessionalId
    ]);
    console.log('✅ Freeprofessional claim inserted into database.');

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


    // const subscribercustomerfreeprofessionalprocessors = await pool.query(`
    //   SELECT freeprofessionalid
    //   FROM subscribercustomerfreeprofessionalprocessor
    //   WHERE subscribercustomerid = $1
    // `, [subscriberId]);

    const subscribercustomerfreeprofessionalprocessors = await pool.query(`
        SELECT * FROM freeprofessional`);

    const freeProfessionalsDTO = [];
    const usersDTO = [];

    for (const subfpp of subscribercustomerfreeprofessionalprocessors.rows) {
      const freeProfessionals = await pool.query(`
        SELECT *
        FROM freeprofessional
        WHERE freeprofessionaltypeid = $1
      `, ['2fc2a66a-69ca-4832-a90e-1ff590b80d24']);

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

    const userQuery = await pool.query('SELECT * FROM osduser WHERE id = $1', [osdUserId]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        CHANGING_OSD_USER_AUTORIZATION_SUCCESS: false,
        CHANGING_OSD_USER_AUTORIZATION_MESSAGE: 'User not found.',
      }, event.SessionKey, event.SecurityToken, 'ChangingOsdUserAutorizationStatus'));
    }

    let osdUser = userQuery.rows[0];
    if (osdUser.isauthorized) {
      return res.status(200).json(createWebBaseEvent({
        CHANGING_OSD_USER_AUTORIZATION_SUCCESS: true,
        CHANGING_OSD_USER_AUTORIZATION_MESSAGE: 'The user is already authorized.',
      }, event.SessionKey, event.SecurityToken, 'ChangingOsdUserAutorizationStatus'));
    } else {
      osdUser.isauthorized = true;
      await pool.query('UPDATE osduser SET isauthorized = $1 WHERE id = $2', [osdUser.isauthorized, osdUser.id]);

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
    console.log('📥 Received event:', event);

    const assignTrainerToSubscriberEvent = event.Body;
    const { SubscriberId, FreeProfessionalId } = assignTrainerToSubscriberEvent;

    console.log('🔍 Extracted details:', assignTrainerToSubscriberEvent);

    // Ensure the subscriber exists and get the user ID
    const subscriberResult = await pool.query(`
      SELECT userid 
      FROM subscribercustomer 
      WHERE id = $1
    `, [SubscriberId]);

    if (subscriberResult.rows.length === 0) {
      console.warn('⚠️ Subscriber not found:', SubscriberId);
      return res.status(404).json(createWebBaseEvent({
        ASSIGN_TRAINER_TO_SUBSCRIBER_SUCCESS: false,
        ASSIGN_TRAINER_TO_SUBSCRIBER_MESSAGE: 'Subscriber not found.'
      }, event.SessionKey, event.SecurityToken, 'AssignTrainerToSubscriber'));
    }

    const userId = subscriberResult.rows[0].userid;
    console.log('✅ Subscriber found, user ID:', userId);

    // Update osduser.assignedtrainer to assign the trainer
    const updateQuery = `
      UPDATE osduser
      SET assignedtrainer = $1
      WHERE id = $2
    `;

    await pool.query(updateQuery, [FreeProfessionalId, userId]);
    console.log('✅ Trainer assigned successfully:', FreeProfessionalId);

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

    // Get IDs of subscribers whose associated user has an assigned trainer
    const subscriberIdsWithTrainers = await pool.query(`
      SELECT sc.id
      FROM subscribercustomer sc
      JOIN osduser u ON sc.userid = u.id
      WHERE u.assignedtrainer IS NOT NULL
    `);

    const subscriberIds = subscriberIdsWithTrainers.rows.map(row => row.id);

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
        SELECT companyname, name
        FROM osduser
        WHERE id = $1
      `, [subscriber.userid]);

      subscriber.companyName = osduser.rows[0]?.companyname || null;
      subscriber.name = osduser.rows[0]?.name || null;
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


    const performancesFreeProfessionalQuery = `
      SELECT id, code, projectmanagerid, summarytypeid, start_date, end_date, justifying_document, 
             freeprofessionalcreatedperformanceid, freeprofessionalassignedid, estimated_transport_expenses, 
             estimated_transport_hours, estimated_work_hours, total_forecast_data, justifying_document_bytes, developer_category, developer_module, developer_screen_form, developer_activity
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
      const summaryTypeResult = await pool.query(
        'SELECT summary FROM summarytypeperformancebuy WHERE id = $1',
        [pfBuyDTO.summarytypeid]
      );
      if (summaryTypeResult.rows.length > 0) {
        pfBuyDTO.SummaryTypeName = summaryTypeResult.rows[0].summary;
      }
    }


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

const handleUpdateClaim = async (event, res) => {
  try {
    console.log('📥 Received event:', event);

    const claimForm = event.Body?.ClaimForm;

    if (!claimForm || !claimForm.id) {
      console.warn('⚠️ ClaimForm and Claim ID are required.');
      return res.status(400).json(createWebBaseEvent({
        UPDATE_CLAIM_SUCCESS: false,
        UPDATE_CLAIM_MESSAGE: 'ClaimForm and Claim ID are required.',
      }, event.SessionKey, event.SecurityToken, 'UpdateClaim'));
    }
    const updateFields = [];
    const updateValues = [];
    let index = 1;

    const fieldsToUpdate = [
      'code', 'datecreated', 'status', 'subscriberclaimedid', 'claimantid', 'claimtype',
      'serviceprovided', 'facts', 'amountclaimed', 'documentfile1id', 'documentfile1name',
      'documentfile2id', 'documentfile2name', 'creditingdate', 'amountpaid', 'improvementsavings',
      'valuationsubscriber', 'valuationclaimant', 'valuationfreeprofessionals', 'processor_id',
      'complaint', 'appeal', 'solution_suggestion', 'solution_appeal', 'answer_to_appeal', 'solution', 'solution_complaint'
    ];

    fieldsToUpdate.forEach(field => {
      if (claimForm[field] !== undefined) {
        updateFields.push(`${field} = $${index}`);
        updateValues.push(claimForm[field]);
        index++;
      }
    });

    if (updateFields.length === 0) {
      console.warn('⚠️ No fields to update.');
      return res.status(400).json(createWebBaseEvent({
        UPDATE_CLAIM_SUCCESS: false,
        UPDATE_CLAIM_MESSAGE: 'No fields to update.',
      }, event.SessionKey, event.SecurityToken, 'UpdateClaim'));
    }

    updateValues.push(claimForm.id);

    const updateQuery = `
      UPDATE claim_file
      SET ${updateFields.join(', ')}
      WHERE id = $${index}
      RETURNING *;
    `;

    console.log('📝 Executing update query:', updateQuery);
    const updateResult = await pool.query(updateQuery, updateValues);

    console.log('✅ Claim updated successfully:', updateResult.rows[0]);
    return res.status(200).json(createWebBaseEvent({
      UPDATE_CLAIM_SUCCESS: true,
      claim: updateResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'UpdateClaim'));

  } catch (error) {
    console.error('❌ Error updating claim:', error);

    return res.status(500).json(createWebBaseEvent({
      UPDATE_CLAIM_SUCCESS: false,
      UPDATE_CLAIM_MESSAGE: 'Server error updating claim.',
    }, event.SessionKey, event.SecurityToken, 'UpdateClaim'));
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
    console.log('🟢 Received event:', event);

    const performanceData = event.Body.Payload;
    if (!performanceData || !performanceData.ClaimId) {
      console.log('⚠️ Missing Claim ID');
      return res.status(400).json(createWebBaseEvent({
        ADD_PERFORMANCE_UPDATE_SUCCESS: false,
        ADD_PERFORMANCE_UPDATE_MESSAGE: 'Claim ID is required.',
      }, event.SessionKey, event.SecurityToken, 'AddPerformanceUpdate'));
    }

    console.log('📨 Performance data received:', performanceData);

    if (performanceData.askForMoreInfo && performanceData.askForMoreInfo === true) {
      console.log('🔄 Updating claim_file due to missing information request...');

      const updateClaimFileQuery = `
        UPDATE claim_file
        SET status = 'Falta Información'
        WHERE id = $1
        RETURNING *;
      `;

      const updateResult = await pool.query(updateClaimFileQuery, [performanceData.ClaimId]);

      console.log('✅ Claim file updated successfully:', updateResult.rows[0]);
    }

    // Generate a unique code for the performance update
    const claimPerformanceCountQuery = await pool.query(
      'SELECT COUNT(*) FROM performance_claim_control WHERE claimid = $1',
      [performanceData.ClaimId]
    );
    const claimPerformanceCount = parseInt(claimPerformanceCountQuery.rows[0].count, 10) + 1;
    const claimCodeQuery = await pool.query(
      'SELECT code FROM claim_file WHERE id = $1',
      [performanceData.ClaimId]
    );
    const claimCode = claimCodeQuery.rows[0].code;
    const numOfClaim = claimCode.split('/')[1];

    const performanceCode = `R/${numOfClaim}/A/${claimPerformanceCount}/2025`;
    console.log('🔢 Generated performance code:', performanceCode);

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
    usertypeperformance,
    filetype,
    documentfile1id,
    justifyingdocument2,
    filetype2,
    documentfile2id,
    answer_to_appeal,
    solution_suggestion,
    appeal,
    complaint,
    solution,
    solution_complaint,
    solution_appeal
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
  ) RETURNING *;
`;

    let documentBase64 = null;
    if (performanceData.Document) {
      documentBase64 = Buffer.from(performanceData.Document).toString('base64');
      console.log('📄 Document converted to Base64');
    }

    let documentBase64_2 = null;
    if (performanceData.Document2) {
      documentBase64_2 = Buffer.from(performanceData.Document2).toString('base64');
      console.log('📄 Document 2 converted to Base64');
    }

    // Fetch existing performance data from the database
    console.log('🔍 Fetching existing performance data...');
    const existingPerformanceQuery = `
  SELECT * FROM performance_claim_control WHERE claimid = $1 ORDER BY dateperformance DESC LIMIT 1
`;
    const existingPerformanceResult = await pool.query(existingPerformanceQuery, [performanceData.ClaimId]);
    const existingPerformance = existingPerformanceResult.rows[0] || {};
    console.log('📌 Existing performance data:', existingPerformance);

    console.log('📝 Inserting new performance update...');
    const result = await pool.query(insertPerformanceQuery, [
      uuidv4(),
      performanceCode,
      performanceData.ClaimId,
      performanceData.NewStatus || existingPerformance.status || 'Running',
      performanceData.datePerformance || existingPerformance.dateperformance || new Date().toISOString().split('T')[0],
      performanceData.Document || existingPerformance.justifyingdocument || '',
      documentBase64 || existingPerformance.justifyingdocumentbytes || null,
      performanceData.Summary || existingPerformance.summary,
      performanceData.type || existingPerformance.type || 8,
      performanceData.typePerformance || existingPerformance.typeperformance || 'Complaint',
      performanceData.userTypePerformance || existingPerformance.usertypeperformance || 'CLAIMANT',
      performanceData.FileType || existingPerformance.filetype || 'txt',
      performanceData.Document || existingPerformance.documentfile1id || '',
      performanceData.Document2 || existingPerformance.justifyingdocument2 || '',
      performanceData.FileType2 || existingPerformance.filetype2 || 'txt',
      performanceData.Document2 || existingPerformance.documentfile2id || '',
      performanceData.answer_to_appeal || existingPerformance.answer_to_appeal || '',
      performanceData.solutionSuggestion || existingPerformance.solutionSuggestion || '',
      performanceData.appeal || existingPerformance.appeal || '',
      performanceData.complaint || existingPerformance.complaint || '',
      performanceData.solution || existingPerformance.solution || '',
      performanceData.solutionComplaint || existingPerformance.solutionComplaint || '',
      performanceData.solutionAppeal || existingPerformance.solutionAppeal || ''
    ]);

    console.log('✅ Performance update inserted successfully:', result.rows[0]);

    // Update claim_file with new fields
    console.log('🔄 Updating claim_file with new performance details...');
    const updateClaimFileQuery = `
      UPDATE claim_file
      SET 
        status = COALESCE($1, status),
        creditingdate = COALESCE($2, creditingdate),
        amountpaid = COALESCE($3, amountpaid),
        improvementsavings = COALESCE($4, improvementsavings),
        facts = COALESCE($6, facts),
        solution_suggestion = COALESCE($7, solution_suggestion),
        appeal = COALESCE($8, appeal),
        complaint = COALESCE($9, complaint),
        answer_to_appeal = COALESCE($10, answer_to_appeal),
        solution = COALESCE($11, solution),
        solution_complaint = COALESCE($12, solution_complaint),
        solution_appeal = COALESCE($13, solution_appeal)
      WHERE id = $5
      RETURNING *;
    `;

    const updateResult = await pool.query(updateClaimFileQuery, [
      performanceData.NewStatus || null,
      performanceData.CreditingDate || null,
      performanceData.AmountPaid || null,
      performanceData.ImprovementSavings || null,
      performanceData.ClaimId || null,
      performanceData.facts || null,
      performanceData.solutionSuggestion || null,
      performanceData.appeal || null,
      performanceData.complaint || null,
      performanceData.answer_to_appeal || null,
      performanceData.solution || null,
      performanceData.solutionComplaint || null,
      performanceData.solutionAppeal || null
    ]);

    console.log('✅ claim_file updated successfully:', updateResult.rows[0]);

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


    for (item of cfhResultItemsArray) {
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

    const performanceClaimQuery = `
      SELECT *
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


    const claimFileQuery = `
      SELECT *
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

    let subscriberClaimedId = subscriberQuery.rows[0].id;

    let claimantId = null;
    if (ClaimantId !== null || Email !== null) {
      const claimantQuery = await pool.query(
        'SELECT id FROM osduser WHERE identity = $1 OR email = $2',
        [ClaimantId, Email]
      );

      if (claimantQuery.rows.length === 0) {
        return res.status(404).json(createWebBaseEvent({
          CREATE_CLAIM_SUCCESS: false,
          CREATE_CLAIM_MESSAGE: 'Claimant not found.',
        }, event.SessionKey, event.SecurityToken, 'CreateClaim'));
      }

      claimantId = claimantQuery.rows[0].id || null;
      const insertClaimantQuery = `
      INSERT INTO claimant (id, userid)
      VALUES ($1, $2)
      ON CONFLICT (id) DO NOTHING;
      `;
      await pool.query(insertClaimantQuery, [claimantId, claimantId]);
    }

    if (subscriberClaimedId !== null) {
      const subscriberCustomerQuery = await pool.query(
        'SELECT id FROM subscribercustomer WHERE userid = $1',
        [subscriberClaimedId]
      );

      if (subscriberCustomerQuery.rows.length === 0) {
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
      const claimantExistsQuery = `
        SELECT 1 FROM claimant WHERE id = $1
      `;
      const claimantExistsResult = await pool.query(claimantExistsQuery, [claimantId]);

      if (claimantExistsResult.rows.length === 0) {
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

    const claimCountQuery = await pool.query(
      'SELECT COUNT(*) FROM claim_file WHERE claimantid = $1',
      [claimantId]
    );
    const claimCount = parseInt(claimCountQuery.rows[0].count, 10) + 1;
    const claimId = uuidv4();
    const claimCode = `RE/${claimCount}/2025`;

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
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
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
    let isClient = false;
    let isClaimant = false;

    console.log("📩 Account Form: ", accountForm, "📩 Personal Form: ", personalForm);

    // Check required fields
    if (!personalForm?.email || !personalForm?.password) {
      console.error("❌ Missing email or password.");
      return res.status(400).json({
        success: false,
        message: 'Email and password are required for registration.'
      });
    }

    // Check if user exists by email
    console.log(`📩 Checking if user exists with email: ${personalForm.email}`);
    const userExists = await pool.query(
      'SELECT * FROM osduser WHERE email = $1',
      [personalForm.email]
    );

    let userId;

    // If user does not exist, create it
    if (userExists.rows.length === 0) {
      userId = uuidv4();
      console.log(`🆕 Creating new user with ID: ${userId}`);

      // Fetch account type ID
      console.log(`📂 Fetching account type for: ${event.Body?.AccountType}`);
      const accountTypeResult = await pool.query(
        'SELECT id FROM accounttype WHERE type = $1',
        [event.Body?.AccountType]
      );

      if (accountTypeResult.rows.length === 0) {
        console.error(`❌ Unknown account type: ${event.Body?.AccountType}`);
        return res.status(400).json({
          success: false,
          message: `Unknown account type: ${event.Body?.AccountType}`
        });
      }

      const accountTypeId = accountTypeResult.rows[0].id;

      // Count rows for generating code
      console.log(`📊 Counting users with account type ID: ${accountTypeId}`);
      const countResult = await pool.query(
        'SELECT COUNT(*) AS count FROM osduser WHERE accounttype = $1',
        [accountTypeId]
      );
      const rowCount = parseInt(countResult.rows[0].count) + 1;

      // Generate code based on account type
      let codePrefix;
      switch (accountTypeId) {
        case '063e12fa-33db-47f3-ac96-a5bdb08ede61':
          codePrefix = `${personalForm.country}/CL/${rowCount}/2025`;
          isClient = true;
          break;
        case '0c61160c-d087-42b6-9fa0-1fc8673a00b2':
          codePrefix = `${personalForm.country}/PL/${rowCount}/2025`;
          break;
        case '7b04ef6e-b6b6-4b4c-98e5-3008512f610e':
          codePrefix = `${personalForm.country}/R/${rowCount}/2025`;
          isClaimant = true;
          break;
        case '8e539a42-4108-4be6-8f77-2d16671d1069':
          codePrefix = `${personalForm.country}/CFH/${rowCount}/2025`;
          break;
        default:
          codePrefix = `${personalForm.country}/IT/${rowCount}/2025`;
      }

      // Handle referral ID
      let referId = null;
      if (accountForm.emailOfRefer) {
        console.log(`📩 Checking referral email: ${accountForm.emailOfRefer}`);
        const referResult = await pool.query(
          'SELECT id FROM osduser WHERE email = $1',
          [accountForm.emailOfRefer]
        );
        if (referResult.rows.length > 0) {
          referId = referResult.rows[0].id;
          console.log(`✅ Found referral ID: ${referId}`);
        } else {
          console.warn(`⚠️ Referral email not found: ${accountForm.emailOfRefer}`);
        }
      }

      // Validate referId is a valid UUID or null
      if (referId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(referId)) {
        console.error(`❌ Invalid referral ID format: ${referId}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid referral ID format.'
        });
      }

      // Insert new user into osduser
      console.log(`📝 Inserting new user into osduser table.`);
      const insertOsdUserQuery = `
        INSERT INTO osduser (
          id, code, accounttype, identity, name, firstsurname, middlesurname, city,
          companyname, address, zipcode, country, landline, mobilephone, email, password, web,
          isauthorized, isadmin, offering_type, refeer, can_be_claimed
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        )
        RETURNING id;
      `;

      const osdUserResult = await pool.query(insertOsdUserQuery, [
        userId,
        codePrefix,
        accountTypeId,
        personalForm.identity,
        personalForm.name || personalForm.companyName,
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
        isClaimant,
        false,
        accountForm.cfhOffer,
        referId || null,
        accountForm.canBeClaimed === 'Yes'
      ]);

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
          console.log(`✅ Inserted new course with ID: ${newCourseId}, title: ${newTitle}`);
        }
      }

      userId = osdUserResult.rows[0].id;
      console.log(`✅ User created with ID: ${userId}`);
    } else {
      userId = userExists.rows[0].id;
      console.log(`🔄 User already exists with ID: ${userId}`);
    }

    if (isClient) {
      const subscriberCustomerQuery = `
      SELECT id FROM subscribercustomer WHERE id = $1
    `;
      const subscriberCustomerResult = await pool.query(subscriberCustomerQuery, [userId]);
      if (subscriberCustomerResult.rows.length === 0) {
        const insertSubscriberCustomerQuery = `
        INSERT INTO subscribercustomer (id, userid, clienttype)
        VALUES ($1, $2, 'Subscriber')
        `;
        await pool.query(insertSubscriberCustomerQuery, [userId, userId]);

        console.log(`✅ Subscriber customer record created for user ID: ${userId}`);
      }
    }

    // Handle specific account types (e.g., courses or freeprofessional)
    if (event.Body?.AccountType === 'FreeProfessional') {
      console.log(`🛠️ Inserting into freeprofessional table for FreeProfessional account.`, userId, accountForm)
      const insertFreeProfessionalQuery = `
        INSERT INTO freeprofessional (
          id, userid, freeprofessionaltypeid, identificationfileid,
          identificationfilename, curriculumvitaefileid, curriculumvitaefilename,
          civilliabilityinsurancefileid, civilliabilityinsurancefilename,
          servicerates, paytpv, course_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
        RETURNING id;
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

      console.log(`✅ FreeProfessional record created for user ID: ${userId}`);
    }


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

    // Return success response
    return res.json({
      success: true,
      message: 'Your account has been created successfully!'
    });

  } catch (error) {
    console.error(`❌ Error processing user registration:`, error);
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
      return res.status(400).json(createWebBaseEvent({
        GET_COURSE_BY_USERID_SUCCESS: false,
        GET_COURSE_BY_USERID_MESSAGE: 'User ID is required.',
      }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
    }


    let courseQuery;
    let queryParams;

    // Check if the user ID matches the special case
    if (userId === 'e77b5172-f726-4c1d-9f9e-d2dbd77e03c9') {

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
        return res.status(404).json(createWebBaseEvent({
          GET_COURSE_BY_USERID_SUCCESS: false,
          GET_COURSE_BY_USERID_MESSAGE: 'No courses found for this professor.',
        }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
      }

      const courseIds = professorCoursesResult.rows.map(row => row.course_id);

      // Ensure courseIds are UUID strings and properly formatted
      const formattedCourseIds = courseIds.map(id => id.trim());


      if (formattedCourseIds.length === 0) {
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

    if (courseResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_COURSE_BY_USERID_SUCCESS: false,
        GET_COURSE_BY_USERID_MESSAGE: 'No course details found.',
      }, event.SessionKey, event.SecurityToken, 'GetCourseByUserId'));
    }


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

const handleGetUsers = async (event, res) => {
  try {
    const result = await pool.query('SELECT * FROM osduser');
    res.status(200).json(createWebBaseEvent({
      GET_USERS_SUCCESS: true,
      users: result.rows
    }, event.SessionKey, event.SecurityToken, 'GetUsers'));
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json(createWebBaseEvent({
      GET_USERS_SUCCESS: false,
      GET_USERS_MESSAGE: 'Server error fetching users.',
    }, event.SessionKey, event.SecurityToken, 'GetUsers'));
  }
};

const handleUpdateProjectDetails = async (event, res) => {
  try {
    const projectDetails = event.Body;
    console.log('📝 Project Details:', projectDetails);

    const { ProjectData } = projectDetails;
    const { projectID, startDate, endDate, economicBudget, expectedTimes } = ProjectData;

    if (!projectID) {
      return res.status(400).json(createWebBaseEvent({
        UPDATE_PROJECT_DETAILS_SUCCESS: false,
        UPDATE_PROJECT_DETAILS_MESSAGE: 'Project ID is required.',
      }, event.SessionKey, event.SecurityToken, 'UpdateProjectDetails'));
    }

    const updateQuery = `
      UPDATE projectmanager
      SET startdate = $1,
          enddate = $2,
          economic_budget = $3,
          expected_hours = $4
      WHERE id = $5
      RETURNING *;
    `;

    const updateResult = await pool.query(updateQuery, [
      startDate || null,
      endDate || null,
      parseFloat(economicBudget.replace('€', '').replace(',', '')) || 0,
      parseFloat(expectedTimes.replace(' Hours', '')) || 0,
      projectID
    ]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        UPDATE_PROJECT_DETAILS_SUCCESS: false,
        UPDATE_PROJECT_DETAILS_MESSAGE: 'Project not found.',
      }, event.SessionKey, event.SecurityToken, 'UpdateProjectDetails'));
    }

    return res.status(200).json(createWebBaseEvent({
      UPDATE_PROJECT_DETAILS_SUCCESS: true,
      project: updateResult.rows[0]
    }, event.SessionKey, event.SecurityToken, 'UpdateProjectDetails'));

  } catch (error) {
    console.error('❌ Error updating project details:', error);
    res.status(500).json(createWebBaseEvent({
      UPDATE_PROJECT_DETAILS_SUCCESS: false,
      UPDATE_PROJECT_DETAILS_MESSAGE: 'Server error updating project details.',
    }, event.SessionKey, event.SecurityToken, 'UpdateProjectDetails'));
  }
};

const handleCreatePerformanceBuy = async (event, res) => {
  try {
    const performanceBuyEvent = event.Body;
    const performanceBuy = {
      Id: uuidv4(),
      Projectmanagerid: performanceBuyEvent.ProjectManagerId,
      Summarytypeid: performanceBuyEvent.SummaryId,
      Freeprofessionalid: performanceBuyEvent.FreeProfessionalAssignedId,
      Date: performanceBuyEvent.Date,
      ProductserviceId: performanceBuyEvent.ProductServiceId,
      MinimumUnits: performanceBuyEvent.MinimumUnits,
      MaximumUnits: performanceBuyEvent.MaximumUnits,
      UnitaryCost: performanceBuyEvent.UnitaryCost,
      ShelfLife: performanceBuyEvent.ShelfLife,
      JustifyingDocument: performanceBuyEvent.JustifyingDocument,
      JustifyingDocumentBytes: performanceBuyEvent.JustifyingDocumentBytes ? Buffer.from(performanceBuyEvent.JustifyingDocumentBytes, 'base64') : null
    };

    const performanceBuyCountQuery = await pool.query(
      'SELECT COUNT(*) FROM performance_buy WHERE projectmanagerid = $1',
      [performanceBuyEvent.ProjectManagerId]
    );

    const performanceBuyCount = parseInt(performanceBuyCountQuery.rows[0].count, 10);
    performanceBuy.Code = `BUY/${performanceBuyCount + 1}/${new Date().getFullYear()}`;
    const insertQuery = `
      INSERT INTO performance_buy (
        id, code, projectmanagerid, summarytypeid, freeprofessionalid, date, productservice_id,
        minimumunits, maximumunits, unitarycost, shelflife, justifying_document, justifying_document_bytes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
    `;

    await pool.query(insertQuery, [
      performanceBuy.Id,
      performanceBuy.Code,
      performanceBuy.Projectmanagerid,
      performanceBuy.Summarytypeid,
      performanceBuy.Freeprofessionalid,
      performanceBuy.Date,
      uuidv4(),
      performanceBuy.MinimumUnits,
      performanceBuy.MaximumUnits,
      performanceBuy.UnitaryCost,
      performanceBuy.ShelfLife,
      performanceBuy.JustifyingDocument,
      performanceBuy.JustifyingDocumentBytes
    ]);

    res.status(200).json(createWebBaseEvent({
      ADD_PERFORMANCE_BUY_SUCCESS: true,
      ADD_PERFORMANCE_BUY_MESSAGE: 'Performance buy was successfully created.',
    }, event.SessionKey, event.SecurityToken, 'CreatePerformanceBuy'));

  } catch (error) {
    console.error('❌ Error creating performance buy:', error);
    res.status(500).json(createWebBaseEvent({
      ADD_PERFORMANCE_BUY_SUCCESS: false,
      ADD_PERFORMANCE_BUY_MESSAGE: 'Server error creating performance buy.',
    }, event.SessionKey, event.SecurityToken, 'CreatePerformanceBuy'));
  }
};

const handleCreateProject = async (event, res) => {
  try {
    const createProjectEvent = event.Body;
    const projectmanager = {
      Id: uuidv4(),
      Objective: createProjectEvent.Objective,
      ExpectedHours: parseFloat(createProjectEvent.ExpectedHours),
      EconomicBudget: parseFloat(createProjectEvent.EconomicBudget),
      Startdate: new Date(createProjectEvent.StartDate),
      Enddate: createProjectEvent.EndDate ? new Date(createProjectEvent.EndDate) : null,
      ExpensesEmployeesVolunteers: parseFloat(createProjectEvent.ExpensesEmployeesVolunteers) || 0,
      SupplierExpensesPurchases: parseFloat(createProjectEvent.SupplierExpensesPurchases) || 0,
      HoursExecuted: parseFloat(createProjectEvent.HoursExecuted) || 0
    };

    const insertQuery = `
      INSERT INTO projectmanager (
        id, objective, expected_hours, economic_budget, startdate, enddate, 
        expensesemployeesvolunteers, supplierexpensespurchases, hours_executed
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
    `;

    await pool.query(insertQuery, [
      projectmanager.Id,
      projectmanager.Objective,
      projectmanager.ExpectedHours,
      projectmanager.EconomicBudget,
      projectmanager.Startdate,
      projectmanager.Enddate,
      projectmanager.ExpensesEmployeesVolunteers,
      projectmanager.SupplierExpensesPurchases,
      projectmanager.HoursExecuted
    ]);

    res.status(200).json(createWebBaseEvent({
      CREATE_PROJECT_SUCCESS: true,
      CREATE_PROJECT_MESSAGE: 'Project created successfully.',
      project: projectmanager
    }, event.SessionKey, event.SecurityToken, 'CreateProject'));

  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json(createWebBaseEvent({
      CREATE_PROJECT_SUCCESS: false,
      CREATE_PROJECT_MESSAGE: 'Server error creating project.',
    }, event.SessionKey, event.SecurityToken, 'CreateProject'));
  }
};

const handleAddSummaryType = async (event, res) => {
  try {
    const addSummaryTypeEvent = event.Body;
    if (addSummaryTypeEvent.SummaryType === "PerformanceBuy") {
      const summaryTypeBuy = {
        Id: uuidv4(),
        Summary: addSummaryTypeEvent.SummaryName
      };
      await pool.query(
        `INSERT INTO summarytypeperformancebuy (id, summary) VALUES ($1, $2)`,
        [summaryTypeBuy.Id, summaryTypeBuy.Summary]
      );
    } else if (addSummaryTypeEvent.SummaryType === "PerformanceFP") {
      const summaryTypeFP = {
        Id: uuidv4(),
        Summary: addSummaryTypeEvent.SummaryName
      };
      await pool.query(
        `INSERT INTO summarytypeperformancefreeprofessional (id, summary) VALUES ($1, $2)`,
        [summaryTypeFP.Id, summaryTypeFP.Summary]
      );
    }

    res.status(200).json(createWebBaseEvent({
      ADD_SUMMARY_TYPE_SUCCESS: true,
      ADD_SUMMARY_TYPE_MESSAGE: 'The summary was successfully added.'
    }, event.SessionKey, event.SecurityToken, 'AddSummaryType'));

  } catch (error) {
    console.error('❌ Error adding summary type:', error);
    res.status(500).json(createWebBaseEvent({
      ADD_SUMMARY_TYPE_SUCCESS: false,
      ADD_SUMMARY_TYPE_MESSAGE: 'Server error adding summary type.'
    }, event.SessionKey, event.SecurityToken, 'AddSummaryType'));
  }
};

const handleAddPerformanceFreeProfessional = async (event, res) => {
  try {
    console.log('📥 Received event:', event);

    const addPerformancFPEvent = event.Body;

    // 1) Prepare the data, converting arrays to hyphen-separated strings
    const performanceFreeprofessional = {
      Id: uuidv4(),
      Projectmanagerid: addPerformancFPEvent.ProjectManagerId,
      Summarytypeid: addPerformancFPEvent.SummaryId,
      StartDate: addPerformancFPEvent.StartDate,
      EndDate: addPerformancFPEvent.EndDate,
      JustifyingDocument: addPerformancFPEvent.JustifyingDocument,
      JustifyingDocumentBytes: addPerformancFPEvent.JustifyingDocumentBytes
        ? Buffer.from(addPerformancFPEvent.JustifyingDocumentBytes, 'base64')
        : null,
      Freeprofessionalcreatedperformanceid: null,
      Freeprofessionalassignedid: addPerformancFPEvent.FreeProfessionalAssignedId,
      EstimatedTransportExpenses: parseFloat(addPerformancFPEvent.ForecastTravelExpenses),
      EstimatedTransportHours: addPerformancFPEvent.ForecastTravelTime,
      EstimatedWorkHours: addPerformancFPEvent.ForecastWorkHours,
      TotalForecastData: parseFloat(addPerformancFPEvent.TotalForecastData),

      // 2) Convert array fields to hyphen-separated strings if they exist
      developer_category: Array.isArray(addPerformancFPEvent.developer_category)
        ? addPerformancFPEvent.developer_category.join(' - ')
        : addPerformancFPEvent.developer_category || null,

      developer_module: Array.isArray(addPerformancFPEvent.developer_module)
        ? addPerformancFPEvent.developer_module.join(' - ')
        : addPerformancFPEvent.developer_module || null,

      developer_screen_form: Array.isArray(addPerformancFPEvent.developer_screen_form)
        ? addPerformancFPEvent.developer_screen_form.join(' - ')
        : addPerformancFPEvent.developer_screen_form || null,

      developer_activity: addPerformancFPEvent.developer_activity || null
    };

    console.log('📝 Prepared performance data:', performanceFreeprofessional);

    // 3) Ensure freeprofessional row actually exists
    const freeProfessionalQuery = await pool.query(
      'SELECT id FROM freeprofessional WHERE userid = $1 OR id = $1',
      [addPerformancFPEvent.FreeProfessionalAssignedId]
    );

    if (freeProfessionalQuery.rows.length === 0) {
      console.warn(
        '⚠️ Free professional not found for user ID:',
        addPerformancFPEvent.FreeProfessionalAssignedId
      );
      return res.status(404).json(
        createWebBaseEvent({
          ADD_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: false,
          ADD_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Free professional not found.',
        }, event.SessionKey, event.SecurityToken, 'AddPerformanceFreeProfessional')
      );
    }

    performanceFreeprofessional.Freeprofessionalcreatedperformanceid = freeProfessionalQuery.rows[0].id;
    console.log('✅ Free professional exists:', performanceFreeprofessional.Freeprofessionalcreatedperformanceid);

    // 4) Generate unique code
    const performanceFreeProfessionalCountQuery = await pool.query(
      'SELECT COUNT(*) FROM performance_freeprofessional WHERE projectmanagerid = $1',
      [addPerformancFPEvent.ProjectManagerId]
    );
    const performanceBuyCountQuery = await pool.query(
      'SELECT COUNT(*) FROM performance_buy WHERE projectmanagerid = $1',
      [addPerformancFPEvent.ProjectManagerId]
    );

    const performanceFreeProfessionalCount = parseInt(performanceFreeProfessionalCountQuery.rows[0].count, 10);
    const performanceBuyCount = parseInt(performanceBuyCountQuery.rows[0].count, 10);
    performanceFreeprofessional.Code = `GETP/${performanceBuyCount + performanceFreeProfessionalCount + 1}/${new Date().getFullYear()}`;
    console.log('🔢 Generated unique code:', performanceFreeprofessional.Code);

    // 5) Insert into DB, adding the new columns at the end
    const insertQuery = `
      INSERT INTO performance_freeprofessional (
        id,
        code,
        projectmanagerid,
        summarytypeid,
        start_date,
        end_date,
        justifying_document,
        justifying_document_bytes,
        freeprofessionalcreatedperformanceid,
        freeprofessionalassignedid,
        estimated_transport_expenses,
        estimated_transport_hours,
        estimated_work_hours,
        total_forecast_data,
        developer_category,
        developer_module,
        developer_screen_form,
        developer_activity
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18
      )
    `;

    await pool.query(insertQuery, [
      performanceFreeprofessional.Id,
      performanceFreeprofessional.Code,
      performanceFreeprofessional.Projectmanagerid,
      performanceFreeprofessional.Summarytypeid,
      performanceFreeprofessional.StartDate,
      performanceFreeprofessional.EndDate,
      performanceFreeprofessional.JustifyingDocument,
      performanceFreeprofessional.JustifyingDocumentBytes,
      performanceFreeprofessional.Freeprofessionalcreatedperformanceid,
      performanceFreeprofessional.Freeprofessionalassignedid,
      performanceFreeprofessional.EstimatedTransportExpenses,
      performanceFreeprofessional.EstimatedTransportHours,
      performanceFreeprofessional.EstimatedWorkHours,
      performanceFreeprofessional.TotalForecastData,
      performanceFreeprofessional.developer_category,
      performanceFreeprofessional.developer_module,
      performanceFreeprofessional.developer_screen_form,
      performanceFreeprofessional.developer_activity
    ]);

    console.log('✅ Inserted performance free professional into DB');

    // 6) Return success
    return res.status(200).json(
      createWebBaseEvent({
        ADD_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: true,
        ADD_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Performance free professional was successfully created.',
      }, event.SessionKey, event.SecurityToken, 'AddPerformanceFreeProfessional')
    );

  } catch (error) {
    console.error('❌ Error adding performance free professional:', error);
    return res.status(500).json(
      createWebBaseEvent({
        ADD_PERFORMANCE_FREE_PROFESSIONAL_SUCCESS: false,
        ADD_PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: 'Server error adding performance free professional.',
      }, event.SessionKey, event.SecurityToken, 'AddPerformanceFreeProfessional')
    );
  }
};

const handleGetHorasReport = async (event, res) => {
  try {
    // Extract filtering parameters from the event body
    const developer = event.Body?.Developer; // Optional filter by developer name
    const category = event.Body?.Category;   // Optional filter by category

    // Base SQL query (columns removed, 'plazo' -> 'fecha')
    let query = `
      SELECT
        id,
        nombre_miembro,
        categoria,
        horas_trabajadas,
        fecha,   
        registro_actividad,
        formulario_pantalla,
        modulo,
        importe,
        aprobado_por_comision
      FROM reporte_horas
    `;
    const queryParams = [];

    // Add filters dynamically based on provided parameters
    if (developer && category) {
      query += ` WHERE nombre_miembro ILIKE $1 AND categoria ILIKE $2`;
      queryParams.push(`%${developer}%`, `%${category}%`);
    } else if (developer) {
      query += ` WHERE nombre_miembro ILIKE $1`;
      queryParams.push(`%${developer}%`);
    } else if (category) {
      query += ` WHERE categoria ILIKE $1`;
      queryParams.push(`%${category}%`);
    }

    // Order by the newly renamed 'fecha' column, with a default limit
    query += ` ORDER BY fecha ASC LIMIT 100`;

    // Execute the query
    const reportResult = await pool.query(query, queryParams);

    // Respond with the retrieved report data
    return res.status(200).json(
      createWebBaseEvent(
        {
          GET_HORAS_REPORT_SUCCESS: true,
          report: reportResult.rows,
        },
        event.SessionKey,
        event.SecurityToken,
        'GetHorasReport'
      )
    );
  } catch (error) {
    console.error('❌ Error fetching horas report:', error);

    // Handle errors
    return res.status(500).json(
      createWebBaseEvent(
        {
          GET_HORAS_REPORT_SUCCESS: false,
          GET_HORAS_REPORT_MESSAGE: 'Server error fetching horas report.',
        },
        event.SessionKey,
        event.SecurityToken,
        'GetHorasReport'
      )
    );
  }
};

const handleGetUserActionLogs = async (event, res) => {
  try {
    // Extract any filtering parameters from the event if needed
    const userId = event.Body?.SelectedUserId; // Optional filtering by user ID
    const limit = event.Body?.Limit || 100; // Default limit to 100 logs
    // Construct the SQL query
    let query = `
      SELECT id, user_id, action, page_url, element_clicked, additional_info, timestamp
      FROM user_action_logs
    `;
    const queryParams = [];

    // Add filtering by user ID if provided
    if (userId) {
      query += ` WHERE user_id = $1`;
      queryParams.push(userId);
    }

    // Add ordering and limit
    query += ` ORDER BY timestamp DESC LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);

    // Execute the query
    const logsResult = await pool.query(query, queryParams);

    // Respond with the retrieved logs
    return res.status(200).json(createWebBaseEvent({
      GET_USER_ACTION_LOGS_SUCCESS: true,
      logs: logsResult.rows,
    }, event.SessionKey, event.SecurityToken, 'GetUserActionLogs'));

  } catch (error) {
    console.error('❌ Error fetching user action logs:', error);

    // Handle any errors that occur
    return res.status(500).json(createWebBaseEvent({
      GET_USER_ACTION_LOGS_SUCCESS: false,
      GET_USER_ACTION_LOGS_MESSAGE: 'Server error fetching user action logs.',
    }, event.SessionKey, event.SecurityToken, 'GetUserActionLogs'));
  }
};

const handleGetDatabaseChangeLogs = async (event, res) => {
  try {
    // Extract optional UserId from the event body
    const userId = event.Body?.SelectedUserId;

    // Build the base query
    let changeLogsQuery = `
      SELECT id, table_name, operation_type, row_data, change_time
      FROM database_change_logs
    `;

    // Add filtering by user ID if provided
    const params = [];
    if (userId) {
      changeLogsQuery += `
        WHERE row_data->>'user_id' = $1
      `;
      params.push(userId);
    }

    // Add ordering to the query
    changeLogsQuery += `
      ORDER BY change_time DESC
    `;

    // Execute the query
    const changeLogsResult = await pool.query(changeLogsQuery, params);

    // Check if logs exist
    if (changeLogsResult.rows.length === 0) {
      return res.status(404).json(createWebBaseEvent({
        GET_DATABASE_CHANGE_LOGS_SUCCESS: false,
        GET_DATABASE_CHANGE_LOGS_MESSAGE: 'No database change logs found.',
      }, event.SessionKey, event.SecurityToken, 'GetDatabaseChangeLogs'));
    }

    // Format and return the logs
    return res.status(200).json(createWebBaseEvent({
      GET_DATABASE_CHANGE_LOGS_SUCCESS: true,
      logs: changeLogsResult.rows,
    }, event.SessionKey, event.SecurityToken, 'GetDatabaseChangeLogs'));

  } catch (error) {
    console.error('❌ Error fetching database change logs:', error);

    // Handle errors gracefully
    return res.status(500).json(createWebBaseEvent({
      GET_DATABASE_CHANGE_LOGS_SUCCESS: false,
      GET_DATABASE_CHANGE_LOGS_MESSAGE: 'Server error fetching database change logs.',
    }, event.SessionKey, event.SecurityToken, 'GetDatabaseChangeLogs'));
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


    let studentsQuery;
    let studentsResult;

    if (userId === 'e77b5172-f726-4c1d-9f9e-d2dbd77e03c9') {
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
        return res.status(404).json(createWebBaseEvent({
          GET_STUDENTS_BY_COURSE_SUCCESS: false,
          GET_STUDENTS_BY_COURSE_MESSAGE: 'No courses found for this professor.',
        }, event.SessionKey, event.SecurityToken, 'GetStudentsByCourse'));
      }

      const courseIds = professorCoursesResult.rows.map(row => row.course_id);


      // Step 2: Fetch students enrolled in these courses along with course names
      studentsQuery = `
        SELECT sr.*, c.title AS course_name
        FROM student_records sr
        LEFT JOIN courses c ON sr.course_id = c.id
        WHERE sr.course_id = ANY($1::uuid[])
      `;

      studentsResult = await pool.query(studentsQuery, [courseIds]);
    }


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
    u.code,
    u.firstsurname,
    u.middlesurname,
    u.city,
    u.companyname,
    u.address,
    u.zipcode,
    u.landline,
    u.mobilephone,
    u.web,
    u.refeer,
    u.can_be_claimed,
    sc.clienttype,
    sc.id AS scid,
    sc.userid AS scuserid,
    trainer_user.name AS trainerassigned  -- Fetch trainer's name instead of ID
FROM freeprofessional fp
LEFT JOIN freeprofessionaltype fpt ON fp.freeprofessionaltypeid = fpt.id
LEFT JOIN osduser u ON fp.userid = u.id
LEFT JOIN subscribercustomer sc ON u.id = sc.userid
LEFT JOIN freeprofessional trainer_fp ON u.assignedtrainer = trainer_fp.id  -- Join freeprofessional first
LEFT JOIN osduser trainer_user ON trainer_fp.userid = trainer_user.id  -- Get trainer's user details
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
    u.code,
    u.firstsurname,
    u.middlesurname,
    u.city,
    u.companyname,
    u.address,
    u.zipcode,
    u.landline,
    u.mobilephone,
    u.web,
    u.refeer,
    u.can_be_claimed,
    NULL AS clienttype,
    NULL AS scid,
    NULL AS scuserid,
    trainer_user.name AS trainerassigned  -- Fetch trainer name in UNION as well
FROM osduser u
LEFT JOIN freeprofessional trainer_fp ON u.assignedtrainer = trainer_fp.id
LEFT JOIN osduser trainer_user ON trainer_fp.userid = trainer_user.id
WHERE u.accounttype IN ('063e12fa-33db-47f3-ac96-a5bdb08ede61', 
                        '8e539a42-4108-4be6-8f77-2d16671d1069', 
                        '7b04ef6e-b6b6-4b4c-98e5-3008512f610e');
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
    const result = await pool.query('SELECT id, title, mode FROM Courses');
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
});