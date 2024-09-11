export class EventConstants {
  public static MESSAGE: string = "Message";
  public static TRACE_IDENTIFIER: string = "TraceIdentifier";
  public static TYPE_PERFORMANCE: string = "TypePerformance";
  public static TYPE: string = "Type";
  public static DATE: string = "Date";
  public static ACTION: string = "Action";
  public static DATE_PERFORMANCE: string = "DatePerformance";
  public static APPLICATION_IDENTIFIER: string = "ApplicationIdentifier";
  public static COMPONENT: string = "Component";

  public static USER_ID: string = "UserId";
  public static ID: string = "Id";
  public static HASHTOKEN: string = "HashToken";

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

  public static SESSION_EXPIRED: string = "SessionExpired";

  //#region Logic
  public static FIRST_NAME: string = "FirstName";
  public static LAST_NAME: string = "LastName";
  public static EMAIL: string = "Email";
  public static NAME: string = "Name";
  public static SUMMARY: string = "Summary";
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
  public static CLAIMANT_ID: string = "ClaimantId";
  public static FACTS: string = "facts";
  public static CLAIM_TYPE: string = "claimtype";

  public static PERFORMANCE_FORM: string = "PerformanceForm";
  public static USER_INFO: string = "UserInfo";

  public static LIST_CLAIM: string = "ListClaim"
  public static LIST_SUBSCRIBERS: string = "ListSubscribers"
  public static LIST_OSD_USERS_SUBSCRIBERS: string = "ListOsdUsersSubscribers"
  public static PERFORMANCE_FREE_PROFESSIONAL_LIST: string = "PerformanceFreeProfessionalList"
  public static PERFORMANCE_BUY_LIST: string = "PerformanceBuyList"
  public static PERFORMANCE_CLAIM_LIST: string = "PerformanceClaimList"
  public static CLAIM_ID: string = "ClaimId";

  public static FREE_PROFESSIONAL_ID: string = "FreeProfessionalId";
  public static FREE_PROFESSIONAL_ASSIGNED_ID: string = "FreeProfessionalAssignedId"
  public static FREE_PROFESSIONAL_TYPE_ID: string = "FreeProfessionalTypeId";
  public static PROJECT_MANAGER_ID: string = 'ProjectManagerId';
  public static JUSTIFYING_DOCUMENT: string = 'JustifyingDocument';
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

  public static INSTITUTIONS_NAMES: string = "InstitutionsNames";
  public static CLAIMS_AMOUNT: string = "ClaimsAmount";
  public static COMPENASTION_OBTAINED_BY_CLAIMANT: string = "CompensationObtainedByClaimant";
  public static SAVINGS_IMPROVEMENT: string = "SavingsImprovement";
  public static CLAIMANTS_RATING: string = "ClaimantsRating";
  public static CLAIMED_RATING: string = "ClaimedRating";
  public static OSD_RATING: string = "OsdRating";

  public static TOTAL_OSD_EXPENSES: string = "TotalOsdExpenses";
  public static COMPENSATION_OF_CLAIMANT: string = "CompensationOfClaimant";
  public static TOTAL_OSD_INCOMES: string = "TotalOsdIncomes";

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


  public static PROJECTS_LIST: string = "ProjectsList"
  public static OBJECTIVE: string = "Objective"
  public static EXPECTED_HOURS: string = "ExpectedHours"
  public static ECONOMIC_BUDGET: string = "EconomicBudget"
  public static START_DATE: string = "StartDate"
  public static END_DATE: string = "EndDate"

  public static VALUATION_SUBSCRIBER: string = "ValuationSubscriber"
  public static VALUATION_CLAIMANT: string = "ValuationClaimant"
  public static VALUATION_FREE_PROFESSIONAL: string = "ValuationFreeProfessional"

  public static ACTION_OSD_RESULT_MESSAGE: string = "ActionOSDResultMessage"
  public static MODIFIED_RESULT_MESSAGE: string = "ModifiedResultMessage"

  public static SUMMARY_TYPES_PERFORMANCE_FREEPROFESSIONAL_LIST: string = "SummaryTypesPerformanceFreeProfessionalList"
  public static SUMMARY_TYPES_PERFORMANCE_BUY_LIST: string = "SummaryTypesPerformanceBuyList"

  public static UNASSIGNED_SUBSCRIBERS_LIST: string = "UnassignedSubscribersList"

  public static PROFESSIONAL_FREE_TRAINERS_LIST: string = "ProfessionalFreeTrainersList"
  public static PERFORMANCES_CLAIM_LIST: string = "PerformancesClaimList"
  public static PERFORMANCE_ASSIGNED_BY_ID_LIST: string = "PerformanceAssignedByIdList"

  public static PERFORMANCE_ASSIGNED_ID: string = "PerformanceAssignedId"

  public static PERFORMANCE_ID: string = "PerformanceId"
  public static SUBPERFORMANCE_ID: string = "SubPerformanceId"

  public static SUB_PERFORMANCE_LIST: string = "SubPerformanceList"

  public static SUBSCRIBER_ID: string = "SubscriberId"

  //#endregion
  constructor() {

  }

}
