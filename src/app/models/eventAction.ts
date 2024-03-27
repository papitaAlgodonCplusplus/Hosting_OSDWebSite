export class EventAction {

  public static HANDLE_CONNECTION_INITIALIZED: string = "HandleConnectionInitialized";
  public static NOTIFY_SESSION_TERMINATED: string = "NotifySessionTerminated";

  public static SHOW_LOGIN_FAILURE: string = "ShowLoginFailure";

  //#region OSD
  public static USER_LOGIN: string = "UserLogin";
  public static REGISTER_CUSTOMER: string = "RegisterCustomer";
  public static VERIFY_EMAIL: string = "VerifyEmail";
  public static RESEND_EMAIL_VERIFICATION_CODE: string = "ResendEmailVerificationCode";
  public static HANDLE_AUTHENTICATION_RESPONSE: string = "HandleAuthenticationResponse"; 
  public static HANDLE_REGISTER_USER_RESPONSE: string = "HandleRegisterResponse";
  public static HANDLE_VERIFY_EMAIL_RESPONSE: string = "HandleVerifyEmailResponse";
  public static HANDLE_RESEND_EMAIL_VERIFICATION_CODE_RESPONSE: string = "HandleResendEmailVerificationCodeResponse";
  public static GENERATE_MAIL_PASSWORD_RESET_TOKEN: string = "GenerateMailPasswordResetToken";
  public static UPDATE_ACCOUNT_PASSWORD: string = "UpdateAccountPassword";
  public static HANDLE_PASSWORD_RESET_EMAIL_RESPONSE: string = "HandlePasswordResetEmailResponse";
  public static HANDLE_UPDATE_ACCOUNT_PASSWORD_RESPONSE: string = "HandleUpdateAccountPasswordResponse";
  public static GETTING_CLAIMS: string = "GettingClaims";
  public static HANDLE_GETTING_CLAIMS_RESPONSE: string = "HandleGettingClaimsResponse";
  public static FREE_PROFESSIONAL: string = "FreeProfessional";
  public static GETTING_FREE_PROFESSIONALS_TR: string = "GettingFreeProfessionalsTR";
  public static HANDLE_GETTING_FREE_PROFESSIONALS_TR_RESPONSE: string = "HandleGettingFreeProfessionalsTRResponse";
  public static ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS: string = "AssignClaimsToFreeProfessionalTR";
  public static HANDLE_ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS_RESPONSE: string = "HandleAssignClaimsToFreeProfessionalTRResponse";

  //#endregion 

  //#region Monitoring
  public static REGISTER_USER_INTERFACE_ACTIVITY: string = "RegisterUserInterfaceActivity";
  //#endregion Monitoring


}
