export class EventAction {

  public static GET_FREE_PROFESSIONALS_BY_CFH_ID: string = "GetFreeProfessionalsByCFHId";

  public static HANDLE_CONNECTION_INITIALIZED: string = "HandleConnectionInitialized";
  public static NOTIFY_SESSION_TERMINATED: string = "NotifySessionTerminated";

  public static SHOW_LOGIN_FAILURE: string = "ShowLoginFailure";
  public static GET_HORAS_REPORT: string = "GetHorasReport";
  public static GET_DATABASE_CHANGE_LOGS: string = "GetDatabaseChangeLogs";
  public static GET_USERS: string = "GetUsers";
  public static GET_USER_ACTION_LOGS: string = "GetUserActionLogs";

  //#region OSD
  public static LOG_EVENT: string = "LogEvent";
  public static GET_CFH_REPORTS: string = "GetCFHReports";
  public static ADD_FREE_PROFESSIONAL_TO_CFH: string = "AddFreeProfessionalToCFH";
  public static USER_LOGIN: string = "UserLogin";
  public static REGISTER_CUSTOMER: string = "RegisterCustomer";
  public static REGISTER_PROFESSOR: string = "RegisterProfessor";
  public static VERIFY_EMAIL: string = "VerifyEmail";
  public static RESEND_EMAIL_VERIFICATION_CODE: string = "ResendEmailVerificationCode";
  public static GENERATE_MAIL_PASSWORD_RESET_TOKEN: string = "GenerateMailPasswordResetToken";
  public static CHANGE_PASSWORD: string = "ChangePassword";
  public static GET_USER_BY_ID: string = "GetUserById";
  public static CREATE_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE: string = "CreateClaimantAndClaimsCustomerPerformance";
  public static DELETE_STUDENT_RECORD: string = "DeleteStudentRecord";
  public static MODIFIED_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE: string = "ModifiedClaimantAndClaimsCustomerPerformance";
  public static UPDATE_USER_PROFILE: string = "UpdateUserProfile";
  public static UPDATE_CLAIM: string = "UpdateClaim";
  
  public static CREATE_CLAIM_PROCESSOR_PERFORMANCE: string = "CreateClaimProcessorPerformance";
  public static MODIFIED_CLAIM_PROCESSOR_PERFORMANCE: string = "ModifiedClaimProcessorPerformance";

  public static MODIFY_USER_INFORMATION: string = "ModifyUserInformation";
  public static MODIFY_USER_INFORMATION_RESPONSE: string = "ModifyUserInformationResponse";
  public static CREATE_PERFORMANCE: string = "CreatePerformance";
  public static MODIFIED_PERFORMANCE_CLAIM: string = "ModifiedPerformanceClaim";
  public static HANDLE_MODIFIED_PERFORMANCE_CLAIM_RESPONSE: string = "HandleModifiedPerformanceClaimResponse";
  public static GET_CLAIMS: string = "GetClaims";
  public static GET_SUBSCRIBERS: string = "GetSubscribers";
  public static ADD_PERFORMANCE_FREE_PROFESSIONAL: string = "AddPerformanceFreeProfessional";
  public static MODIFY_PERFORMANCE_FREE_PROFESSIONAL: string = "ModifyPerformanceFreeProfessional";

  public static ADD_PERFORMANCE_CLAIM_TRAINER: string = "AddPerformanceClaimTrainer";
  public static ADD_PERFORMANCE_CLAIM_TRAINER_RESPONSE: string = "AddPerformanceClaimTrainerResponse";
  public static MODIFY_PERFORMANCE_CLAIM_TRAINER: string = "ModifyPerformanceClaimTrainer";
  public static MODIFY_PERFORMANCE_CLAIM_TRAINER_RESPONSE: string = "ModifyPerformanceClaimTrainerResponse";

  public static MODIFY_PERFORMANCE_FREE_PROFESSIONAL_RESPONSE: string = "ModifyPerformanceFreeProfessionalResponse";
  public static CREATE_PERFORMANCE_BUY: string = "CreatePerformanceBuy";
  public static MODIFY_PERFORMANCE_BUY: string = "ModifyPerformanceBuy";
  public static UPDATE_PROJECT_DETAILS: string = "UpdateProjectDetails";
  public static MODIFY_PERFORMANCE_BUY_RESPONSE: string = "ModifyPerformanceBuyResponse";
  public static GET_PERFORMANCES_PROJECT_MANAGER_BY_ID: string = "GetPerformancesProjectManagerById";
  public static CREATE_CLAIM: string = "CreateClaim";
  public static HANDLE_CREATE_CLAIM_RESPONSE: string = "HandleCreateClaimResponse";
  public static GET_TRANSPARENCY_REPORTS_SUBSCRIBER_CLIENTES: string = "GetTransparencyReportsSubscriberClients";
  public static GET_TRANSPARENCY_REPORTS_INCOME_EXPENSES: string = "GetTransparencyReportsIncomeExpenses";
  public static GET_TRANSPARENCY_FREE_PROFESSIONALS: string = "GetTransparencyFreeProfessionals";
  public static CREATE_PROJECT: string = "CreateProject";
  public static GET_PROJECTS : string = "GetProjects";
  public static UPDATE_EVALUATION : string = "UpdateEvaluation";

  public static ADD_SUMMARY_TYPE : string = "AddSummaryType";
  public static GET_SUMMARY_TYPES : string = "GetSummaryTypes";
  public static GET_UNASSIGNED_SUBSCRIBERS : string = "GetUnassignedSubscribers";
  public static GET_PROFRESSIONALFREE_TRAINERS : string = "GetProfessionalFreeTrainers";
  public static GET_PERFORMANCES_CLAIM_BY_ID : string = "GetPerformancesClaimById";
  public static GET_PERFORMANCES_CLAIM_BY_ID_RESPONSE : string = "GetPerformancesClaimByIdResponse";
  public static GET_PERFORMANCES_ASSIGNED_BY_ID : string = "GetPerformanceAssignedById";
  public static UPDATE_STUDENT_RECORDS : string = "UpdateStudentRecords";
  public static GET_STUDENTS_BY_COURSE : string = "GetStudentsByCourse";
  
  public static ADD_RESPONSE_TO_PERFORMANCE_ASSIGNED : string = "AddResponseToPerformanceAssigned";

  public static MODIFY_RESPONSE_TO_PERFORMANCE_ASSIGNED : string = "ModifyResponseToPerformanceAssigned";
  public static MODIFY_RESPONSE_TO_PERFORMANCE_ASSIGNED_RESPONSE : string = "ModifyResponseToPerformanceAssignedResponse";

  public static VALIDATE_RESPONSE_TO_PERFORMANCE_ASSIGNED : string = "ValidateResponseToPerformanceAssigned";
  public static VALIDATE_RESPONSE_TO_PERFORMANCE_ASSIGNED_RESPONSE : string = "ValidateResponseToPerformanceAssignedResponse";

  public static GET_SUB_PERFORMANCE_BY_ID : string = "GetSubPerformanceById";

  public static ASSIGN_TRAINER_TO_SUBSCRIBER : string = "AssignTrainerToSubscriber";

  public static CLOSE_CLAIM_FILE : string = "CloseClaimFile";
  //Response
  
  public static ADD_SUMMARY_TYPE_RESPONSE : string = "AddSummaryTypeResponse";
  public static HANDLE_AUTHENTICATION_RESPONSE: string = "HandleAuthenticationResponse";
  public static HANDLE_REGISTER_USER_RESPONSE: string = "HandleRegisterResponse";
  public static HANDLE_VERIFY_EMAIL_RESPONSE: string = "HandleVerifyEmailResponse";
  public static HANDLE_RESEND_EMAIL_VERIFICATION_CODE_RESPONSE: string = "HandleResendEmailVerificationCodeResponse";
  public static HANDLE_PASSWORD_RESET_EMAIL_RESPONSE: string = "HandlePasswordResetEmailResponse";
  public static HANDLE_UPDATE_ACCOUNT_PASSWORD_RESPONSE: string = "HandleUpdateAccountPasswordResponse";

  public static HANDLE_CREATE_PERFORMANCE_RESPONSE: string = "HandleCreatePerformanceResponse";
  //public static HANDLE_GET_CLAIMS_RESPONSE: string = "HandleGetClaimsResponse";
  public static HANDLE_GET_SUBSCRIBERS_RESPONSE: string = "HandleGetSubscribersResponse";
  public static GETTING_CLAIMS: string = "GettingClaims";
  public static HANDLE_GETTING_CLAIMS_RESPONSE: string = "HandleGettingClaimsResponse";
  public static FREE_PROFESSIONAL: string = "FreeProfessional";
  public static GET_FREE_PROFESSIONALS: string = "GetFreeProfessionals"
  public static HANDLE_GET_FREE_PROFESSIONALS_RESPONSE: string = "HandleGetFreeProfessionalsResponse";
  public static ADD_PERFORMANCE_UPDATE: string = "AddPerformanceUpdate";

  public static CHANGING_OSD_USER_AUTORIZATION_STATUS: string = "ChangingOsdUserAutorizationStatus";
  public static HANDLE_CHANGING_OSD_USER_AUTORIZATION_STATUS_RESPONSE: string = "HandleChangingOsdUserAutorizationStatusResponse";
  public static GETTING_FREE_PROFESSIONALS_TR: string = "GettingFreeProfessionalsTR";
  public static HANDLE_GETTING_FREE_PROFESSIONALS_TR_RESPONSE: string = "HandleGettingFreeProfessionalsTRResponse";
  public static ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS: string = "AssignClaimsToFreeProfessionalTR";
  public static HANDLE_ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS_RESPONSE: string = "HandleAssignClaimsToFreeProfessionalTRResponse";
  public static GET_TRANSPARENCY_REPORTS_INCOME_EXPENSES_RESPONSES: string = "GetTransparencyReportsIncomeExpensesResponse";
  public static GET_TRANSPARENCY_REPORTS_SUBSCRIBER_CLIENTES_RESPONSE: string = "GetTransparencyReportsSubscriberClientsResponse";
  public static GET_COURSE_BY_USER_ID: string = "GetCourseByUserId";
  //#endregion 

  //#region Monitoring
  public static REGISTER_USER_INTERFACE_ACTIVITY: string = "RegisterUserInterfaceActivity";
  //#endregion Monitoring


}
