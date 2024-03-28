export class EventConstants {
  public static TRACE_IDENTIFIER: string = "TraceIdentifier";
  public static TYPE: string = "Type";
  public static ACTION: string = "Action";
  public static DATE: string = "Date";
  public static APPLICATION_IDENTIFIER: string = "ApplicationIdentifier";
  public static COMPONENT: string = "Component";

  public static USER_ID: string = "UserId";
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
  //#endregion

  // #region OSD
  public static ACCOUNT_FORM: string = "AccountForm";
  public static PERSONAL_FORM: string = "PersonalForm";
  public static ACCOUNT_TYPE: string = "AccountType";

  public static FREE_PROFESSIONAL: string = "FreeProfessional";
  public static SUBSCRIBER_COSTUMER: string = "SubscriberCustomer";
  public static CLAIMANT: string = "Claimant";
  public static APPROVED_TRAINING_CENTER : string = "ApprovedTrainingCenter";

  public static CLAIM_ID: string = "ClaimId";
  public static FREE_PROFESSIONAL_ID: string = "FreeProfessionalId";
  //#endregion
  constructor()
  {

  }

}
