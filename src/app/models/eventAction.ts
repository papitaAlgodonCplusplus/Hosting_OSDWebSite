export class EventAction {

  public static HANDLE_CONNECTION_INITIALIZED: string = "HandleConnectionInitialized";
  public static NOTIFY_SESSION_TERMINATED: string = "NotifySessionTerminated";

  public static SHOW_LOGIN_FAILURE: string = "ShowLoginFailure";

  //#region OSD
  public static USER_LOGIN: string = "UserLogin";
  public static REGISTER_CUSTOMER: string = "RegisterCustomer";
  public static VERIFY_EMAIL: string = "VerifyEmail";
  public static RESEND_EMAIL_VERIFICATION_CODE: string = "ResendEmailVerificationCode";
  public static GENERATE_MAIL_PASSWORD_RESET_TOKEN: string = "GenerateMailPasswordResetToken";
  public static UPDATE_ACCOUNT_PASSWORD: string = "UpdateAccountPassword";
  public static CREATE_PERFORMANCE: string = "CreatePerformance";
  public static GET_CLAIMS: string = "GetClaims";
  public static GET_SUBSCRIBERS: string = "GetSubscribers";
  public static ADD_PERFORMANCE_FREE_PROFESSIONAL: string = "AddPerformanceFreeProfessional";
  public static CREATE_PERFORMANCE_BUY: string = "CreatePerformanceBuy";
  public static GET_PERFORMANCES: string = "GetPerformances";
  public static CREATE_CLAIM: string = "CreateClaim";
  public static HANDLE_CREATE_CLAIM_RESPONSE: string = "HandleCreateClaimResponse";
  public static GET_TRANSPARENCY_REPORTS_SUBSCRIBER_CLIENTES: string = "GetTransparencyReportsSubscriberClients";
  public static GET_TRANSPARENCY_REPORTS_INCOME_EXPENSES: string = "GetTransparencyReportsIncomeExpenses";
  public static GET_TRANSPARENCY_FREE_PROFESSIONALS: string = "GetTransparencyFreeProfessionals";
  public static CREATE_PROJECT: string = "CreateProject";
  public static GET_PROJECTS : string = "GetProjects";
  //Response
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

  public static CHANGING_OSD_USER_AUTORIZATION_STATUS: string = "ChangingOsdUserAutorizationStatus";
  public static HANDLE_CHANGING_OSD_USER_AUTORIZATION_STATUS_RESPONSE: string = "HandleChangingOsdUserAutorizationStatusResponse";
  public static GETTING_FREE_PROFESSIONALS_TR: string = "GettingFreeProfessionalsTR";
  public static HANDLE_GETTING_FREE_PROFESSIONALS_TR_RESPONSE: string = "HandleGettingFreeProfessionalsTRResponse";
  public static ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS: string = "AssignClaimsToFreeProfessionalTR";
  public static HANDLE_ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS_RESPONSE: string = "HandleAssignClaimsToFreeProfessionalTRResponse";
  public static GET_TRANSPARENCY_REPORTS_INCOME_EXPENSES_RESPONSES: string = "GetTransparencyReportsIncomeExpensesResponse";
  public static GET_TRANSPARENCY_REPORTS_SUBSCRIBER_CLIENTES_RESPONSE: string = "GetTransparencyReportsSubscriberClientsResponse";
  //#endregion 

  //#region Monitoring
  public static REGISTER_USER_INTERFACE_ACTIVITY: string = "RegisterUserInterfaceActivity";
  //#endregion Monitoring


}
