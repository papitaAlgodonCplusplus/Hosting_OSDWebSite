export class EventConstants {
  public static LOG_DATA: string = "LogData";
  public static CFH_REPORTS: string = "cfhResult";
  public static CFH_ID: string = "CfhId";
  public static MESSAGE: string = "Message";
  public static TRACE_IDENTIFIER: string = "TraceIdentifier";
  public static TYPE_PERFORMANCE: string = "TypePerformance";
  public static USER_TYPE_PERFORMANCE: string = "UserTypePerformance";
  public static TYPE: string = "Type";
  public static DATE: string = "Date";
  public static ACTION: string = "Action";
  public static LOG: string = "Log";
  public static CLAIM: string = "Claim";
  public static PROJECT_ID: string = "ProjectId"; 
  public static EXPLANATION_TEXT: string = "ExplanationText";
  public static REQUEST: string = "Request";
  public static SERVICE_ID: string = "ServiceId";

  public static DATE_PERFORMANCE: string = "DatePerformance";
  public static APPLICATION_IDENTIFIER: string = "ApplicationIdentifier";
  public static COMPONENT: string = "Component";
  public static COMPANY_NAME: string = "CompanyName";
  public static FIRST_SURNAME: string = "FirstSurname";
  public static MY_FIRST_NAME: string = "MyFirstName";
  public static MIDDLE_SURNAME: string = "MiddleSurname";
  public static CITY: string = "City";
  public static COMPANY_NAME_SPANISH: string = "CompanyNameSpanish";
  public static ADDRESS: string = "Address";
  public static ZIPCODE: string = "Zipcode";
  public static LANDLINE: string  = "Landline";
  public static MOBILE_PHONE: string = "MobilePhone";
  public static WEB: string = "Web";
  public static PAYLOAD: string = "Payload";
  public static FINAL_RATING: string = "FinalRating";
  public static CATEGORY: string = "Category";
  public static DEVELOPER : string = "Developer";

  public static USER_ID: string = "UserId";
  public static ID: string = "Id";
  public static HASHTOKEN: string = "HashToken";
  public static PHONE: string = "Phone";
  public static USER_AUTHENTICATION_SUCCESS: string = "UserAuthenticationSuccess";
  public static USER_AUTHENTICATION_RESULT_MESSAGE: string = "UserAuthenticationResultMessage";
  public static USER_AUTHENTICATION_RESULT_CODE: string = "UserAuthenticationResultCode";
  public static SESSIONLESS_KEY: string = "SessionlessKey";
  public static GENERATED_SESSION_KEY: string = "GeneratedSessionKey";
  public static GENERATED_SESSION_KEYS: string = "GeneratedSessionKeys";
  public static ACCOUNT_ID: string = "AccountId";
  public static RELATED_SESSION_KEY: string = "RelatedSessionKey";
  public static MAIL_SUCCESS_RESET_TOKEN: string = "MailSuccessResetToken";
  public static MAIL_MESSAGE_RESET_TOKEN: string = "MailMessageResetToken";
  public static UPDATE_PASSWORD_SUCCESS: string = "UpdatePasswordSucces";
  public static UPDATE_PASSWORD_MESSAGES: string = "UpdatePasswordMessages";

  //#region Security
  public static USERNAME: string = "Username";
  public static PASSWORD: string = "Password";
  public static EMAIL_VERIFICATION_CODE: string = "EmailVerificationCode";
  public static DEVICE_IDENTIFIER: string = "DeviceIdentifier";
  public static DEVELOPER_CATEGORY: string = "developer_category";
  public static DEVELOPER_MODULE: string = "developer_module";
  public static DEVELOPER_SCREEN_FORM: string = "developer_screen_form";
  public static DEVELOPER_ACTIVITY: string = "developer_activity";
  public static ACTION_REGISTER_SUCCESS: string = "ActionRegisterSuccess";
  public static ACTION_REGISTER_RESULT_MESSAGE: string = "ActionRegisterResultMessage";

  public static REGISTER_USER_SUCCESS: string = "ActionRegisterSuccess";
  public static REGISTER_USER_RESULT_MESSAGE: string = "ActionRegisterResultMessage";

  public static VERIFY_EMAIL_SUCCESS: string = "VerifyEmailSuccess";
  public static VERIFY_EMAIL_RESULT_MESSAGE: string = "VerifyEmailResultMessage";

  public static EMAIL_VERIFICATION_CODE_SUCCESS: string = "EmailVerificationCodeSuccess";
  public static EMAIL_VERIFICATION_CODE_RESULT_MESSAGE: string = "EmailVerificationCodeResultMessage";
  //#endregion Security

  //#region Monitoring
  public static SOURCE_CONTAINER: string = "SourceContainer";
  public static SOURCE_CONTROL: string = "SourceControl";
  public static SOURCE_CONTROL_EVENT: string = "SourceControlEvent";
  //#endregion Monitoring

  //RESOURCETYPE
  public static ERROR_LOGIN_MESSAGE: string = "ErrorLoginMessage";

  public static SUCCESS: string = "Success";
  public static ERROR: string = "Error";
  public static INFORMATION: string = "Information";
  public static SAVINGS_IMPROVEMENT: string = "SavingsImprovement";
  public static CLAIMANT_PAYMENT: string = "ClaimantPayment";

  public static SESSION_EXPIRED: string = "SessionExpired";

  //#region Logic
  public static FIRST_NAME: string = "FirstName";
  public static LAST_NAME: string = "LastName";
  public static EMAIL: string = "Email";
  public static NAME: string = "Name";
  public static SUMMARY: string = "Summary";
  public static COUNTRY: string = "country";
  //#endregion

  // #region OSD
  public static ACCOUNT_FORM: string = "AccountForm";
  public static PERSONAL_FORM: string = "PersonalForm";
  public static ACCOUNT_TYPE: string = "AccountType";
  public static CLAIM_FORM: string = "ClaimForm";

  public static SERVICE_PROVIDED: string = "serviceProvided";
  public static SUBSCRIBER_CLAIMED: string = "subscriberClaimed";
  public static AMOUNT_CLAIMED: string = "amountClaimed";
  public static SUPPORTING_DOCUMENT1: string = "supportingDocument1";
  public static SUPPORTING_DOCUMENT2: string = "supportingDocument2";
  public static SUPPORTING_DOCUMENT3: string = "supportingDocument3";
  public static CLAIMANT_ID: string = "ClaimantId";
  public static FACTS: string = "facts";
  public static CLAIM_TYPE: string = "claimtype";

  public static PERFORMANCE_FORM: string = "PerformanceForm";
  public static USER_INFO: string = "UserInfo";

  public static LIST_CLAIM: string = "ListClaim"
  public static LIST_SUBSCRIBERS: string = "subscribers"
  public static LIST_OSD_USERS_SUBSCRIBERS: string = "ListOsdUsersSubscribers"
  public static PERFORMANCE_FREE_PROFESSIONAL_LIST: string = "performancesFreeProfessional"
  public static PERFORMANCE_BUY_LIST: string = "performancesBuy"
  public static PERFORMANCE_CLAIM_LIST: string = "PerformanceClaimList"
  public static CLAIM_ID: string = "ClaimId";

  public static FREE_PROFESSIONAL_ID: string = "FreeProfessionalId";
  public static FREE_PROFESSIONAL_ASSIGNED_ID: string = "FreeProfessionalAssignedId"
  public static FREE_PROFESSIONAL_TYPE_ID: string = "FreeProfessionalTypeId";
  public static PROJECT_MANAGER_ID: string = 'ProjectManagerId';
  public static JUSTIFYING_DOCUMENT: string = 'JustifyingDocument';
  public static JUSTIFYING_DOCUMENT_BYTES: string = 'JustifyingDocumentBytes';
  public static JUSTIFYING_DOCUMENT_BYTES2: string = 'JustifyingDocumentBytes2';
  public static SUMMARY_ID: string = "SummaryId";
  public static FREE_PROFESSIONAL_WORK_HOURS: string = 'FP_WorkHours';
  public static FREE_PROFESSIONAL_TRAVEL_HOURS: string = 'FP_TravelTime';
  public static TD_WORK_HOURS: string = 'TD_work_hours';
  public static TD_DATE: string = "TD_Date";

  public static FREE_PROFESSIONAL_TRAVEL_EXPENSES: string = 'FP_TravelExpenses';
  public static TOTAL_FREE_PROFESSIONAL: string = 'Total_FP';
  public static DOCUMENT_INCREASE_WORKING_HOURS: string = 'DocumentIncreaseWorkingHours';

  public static TECHNICAL_DIRECTOR_DATE: string = 'TD_Date';
  public static TECHNICAL_DIRECTOR_WORK_HOURS: string = 'TD_WorkHours';

  public static PROCESSOR_WORK_HOURS: string = 'Processor_WorkHours';
  public static PROCESSOR_TRAVEL_HOURS: string = 'Processor_TravelTime';
  public static PROCESSOR_TRAVEL_EXPENSES: string = 'Processor_TravelExpenses';
  public static PROCESSOR_REMUNERATION: string = 'Processor_Remuneration';

  public static TRAINER_DATE: string = 'Trainer_Date';
  public static TRAINER_WORK_HOURS: string = 'Trainer_WorkHours';
  public static TRAINER_TRAVEL_HOURS: string = 'Trainer_TravelTime';
  public static TRAINER_TRAVEL_EXPENSES: string = 'Trainer_TravelExpenses';
  public static TRAINER_REMUNERATION: string = 'Trainer_Remuneration';
  
  public static ACCEPT_INCREASE_IN_HOURS: string = 'AcceptIncreaseInHours';
  public static PERFORMANCE_FREE_PROFESSIONAL: string = 'PerformanceFreeProfessional';
  public static PERFORMANCE_FREE_PROFESSIONAL_MESSAGE: string = 'PerformanceFreeProfessionalMessage';
  public static PERFORMANCE_CLAIM_ID: string = 'PerformanceClaimId';

  public static FORECAST_WORK_HOURS: string = "ForecastWorkHours";
  public static FORECAST_TRAVEL_TIME: string = "ForecastTravelTime";
  public static FORECAST_TRAVEL_EXPENSES: string = "ForecastTravelExpenses";
  public static TOTAL_FORECAST_DATA: string = "TotalForecasData";
  public static JUSTIFY_CHANGE_ESTIMATED_WORK_HOURS: string = "JustifyChangeEstimatedWorkHours";

  public static PERFORMANCE_BUY: string = "PerformanceBuy"
  public static PRODUCT_SERVICE_ID: string = "ProductServiceId";
  public static MINIMUN_UNITS: string = "MinimumUnits";
  public static MAXIMUM_UNITS: string = "MaximumUnits";
  public static UNITARY_COST: string = "UnitaryCost";
  public static SHELF_LIFE: string = "ShelfLife";
  public static SUMMARY_NAME: string = "SummaryName";
  public static SUMMARY_TYPE: string = "SummaryType";
  public static FREE_PROFESSIONAL: string = 'FreeProfessional';
  public static SUBSCRIBER_CUSTOMER: string = 'SubscriberCustomer';
  public static CLAIMANT: string = "Claimant";
  public static APPROVED_TRAINING_CENTER: string = 'ApprovedTrainingCenter';
  public static UNREGISTERED: string = 'Unregistered';

  public static TRANSPARENCY_REPORTS_SUBSCRIBER_CLIENT_LIST: string = "TransparencyReportsSubscriberClientList";

  public static TRANSPARENCY_INCOME_EXPENSES: string = "TransparencyIncomeExpenses";
  public static COMPENSATION_OF_CLAIMANT: string = "CompensationOfClaimant";
  public static TOTAL_OSD_INCOMES: string = "TotalOsdIncomes";
  public static PROJECT_DATA: string = "ProjectData";
  
  public static TECHNICAL_DIRECTOR_EXPENSES: string = "TD_Expenses";
  public static ACCOUNTING_TECHNITIAN_EXPENSES: string = "TC_Expenses";
  public static MARKETING_TECHNITIAN_EXPENSES: string = "TM_Expenses";
  public static SYSTEM_ENGINEER_EXPENSES: string = "IN_Expenses";
  public static SAC_TECHNITIAN_EXPENSES: string = "TS_Expenses";

  public static FP_FULL_NAMES: string = "fpFullNames";
  public static HOURS_PERFORMANCES: string = "hoursPerformances";
  public static SUMMATION_FILES: string = "summationFiles";
  public static SUMMATION_PERFORMANCES: string = "summationPerformances";
  public static FORMATION_COST: string = "formationCost"


  public static PROJECTS_LIST: string = "projects"
  public static OBJECTIVE: string = "Objective"
  public static EXPECTED_HOURS: string = "ExpectedHours"
  public static ECONOMIC_BUDGET: string = "EconomicBudget"
  public static START_DATE: string = "StartDate"
  public static END_DATE: string = "EndDate"

  public static VALUATION_SUBSCRIBER: string = "ValuationSubscriber"
  public static VALUATION_CLAIMANT: string = "ValuationClaimant"
  public static VALUATION_FREE_PROFESSIONAL: string = "ValuationFreeProfessional"

  public static ACTION_OSD_RESULT_MESSAGE: string = "ADD_RESPONSE_PERFORMANCE_ASSIGNED_MESSAGE"
  public static MODIFIED_RESULT_MESSAGE: string = "ModifiedResultMessage"

  public static SUMMARY_TYPES_PERFORMANCE_FREEPROFESSIONAL_LIST: string = "summarytypePerformanceFreeProfessional"
  public static SUMMARY_TYPES_PERFORMANCE_BUY_LIST: string = "summarytypePerformanceBuy"

  public static UNASSIGNED_SUBSCRIBERS_LIST: string = "subscribers"

  public static PROFESSIONAL_FREE_TRAINERS_LIST: string = "professionalFreeTrainers"

  public static CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE_LIST: string = "ClaimantAndClaimsCustomerPerformanceList"
  public static CLAIMS_PROCESSOR_PERFORMANCE_LIST: string = "ClaimsProcessorPerformanceList"
  public static CLAIMS_TRAINER_PERFORMANCE_LIST: string = "ClaimsTrainerPerformanceList"

  public static FREE_PROFESSIONALS_LIST: string = "FreeProfessionalsList"
  public static PERFORMANCE_ASSIGNED_BY_ID_LIST: string = "PerformanceAssignedByIdList"

  public static PERFORMANCE_ASSIGNED_ID: string = "PerformanceAssignedId"

  public static PERFORMANCE_ID: string = "PerformanceId"
  public static SUBPERFORMANCE_ID: string = "SubPerformanceId"

  public static SUB_PERFORMANCE_LIST: string = "subPerformances"

  public static SUBSCRIBER_ID: string = "SubscriberId"

  public static AMOUNT_PAID: string = "AmountPaid"
  public static PAYMENT_DATE: string = "PaymentDate"
  public static SAVINGS_INSTITUTION: string = "SavingsInstitution"

  public static STUDENT_NAME: string = "StudentName";
  public static STUDENT_ATTENDANCE: string = "StudentAttendance";
  public static STUDENT_GRADE: string = "StudentGrade";
  public static STUDENT_STATUS: string = "StudentStatus";

  //#endregion
  constructor() {

  }

}
