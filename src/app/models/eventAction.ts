export class EventAction {


  //project
  public static ADD_PROJECT: string = "AddProject";
  public static ADD_PROJECT_OBJECTIVES: string = "AddProjectObjectives";
  public static GET_PROJECT_RESOURCE_TYPES: string = "GetProjectResourceTypes";
  public static GET_PROJECT_RESOURCE_TYPES_RESPONSE = "GetProjectResourceTypesResponse";
  public static GET_PROJECT_SEARCH_PLATFORM_USER_RESPONSE: string = "GetProjectSearchPlatformUserResponse";
  public static GET_PROJECT_SEARCH_PLATFORM_USER: string = "GetProjectSearchPlatformUser";

  //GOALS
  public static GET_PROJECT_GOALS: string = "GetProjectGoals";
  public static GET_PROJECT_GOALS_RESPONSE = "GetProjectGoalsResponse";

  public static GET_PROJECT_SDGS: string = "GetProjectSDGs";
  public static GET_PROJECT_SDGS_RESPONSE = "GetProjectSDGsResponse";

  public static HANDLE_CONNECTION_INITIALIZED: string = "HandleConnectionInitialized";
  public static NOTIFY_SESSION_TERMINATED: string = "NotifySessionTerminated";

  public static SHOW_LOGIN_FAILURE: string = "ShowLoginFailure";

  //#region Security
  public static USER_LOGIN: string = "UserLogin";
  public static REGISTER_USER: string = "RegisterUser";
  public static VERIFY_EMAIL: string = "VerifyEmail";
  public static RESEND_EMAIL_VERIFICATION_CODE: string = "ResendEmailVerificationCode";
  public static HANDLE_AUTHENTICATION_RESPONSE: string = "HandleAuthenticationResponse";
  public static HANDLE_REGISTER_USER_RESPONSE: string = "HandleRegisterUserResponse";
  public static HANDLE_VERIFY_EMAIL_RESPONSE: string = "HandleVerifyEmailResponse";
  public static HANDLE_RESEND_EMAIL_VERIFICATION_CODE_RESPONSE: string = "HandleResendEmailVerificationCodeResponse";
  public static GENERATE_MAIL_PASSWORD_RESET_TOKEN: string = "GenerateMailPasswordResetToken";
  public static UPDATE_ACCOUNT_PASSWORD: string = "UpdateAccountPassword";
  public static HANDLE_PASSWORD_RESET_EMAIL_RESPONSE: string = "HandlePasswordResetEmailResponse";
  public static HANDLE_UPDATE_ACCOUNT_PASSWORD_RESPONSE: string = "HandleUpdateAccountPasswordResponse";

  public static GET_USER_MENU_OPTIONS_RESPONSE: string ="GetUserMenuOptionsResponse";
  public static GET_USER_ACCOUNTS_RESPONSE: string ="GetUserAccountsResponse";
  public static CHANGE_USER_ACCOUNT_RESPONSE: string ="ChangeUserAccountResponse";
  public static GET_USER_MENU_OPTIONS: string ="GetUserMenuOptions";
  public static GET_USER_ACCOUNTS: string ="GetUserAccounts";
  public static CHANGE_USER_ACCOUNT: string ="ChangeUserAccount";

  //#endregion Security

  //#region Monitoring
  public static REGISTER_USER_INTERFACE_ACTIVITY: string = "RegisterUserInterfaceActivity";
  //#endregion Monitoring

  //Logic
  public static GET_PHILOSOPHICAL_FRAMEWORK: string = "GetPhilosophicalFramework";
  public static GET_PHILOSOPHICAL_FRAMEWORK_RESPONSE: string = "GetPhilosophicalFrameworkResponse";
  public static MODIFY_PHILOSOPHICAL_FRAMEWORK: string = "ModifyPhilosophicalFramework";
  public static MODIFY_PHILOSOPHICAL_FRAMEWORK_RESPONSE: string = "ModifyPhilosophicalFrameworkResponse";
  public static GET_COUNTRY: string = "GetCountry";
  public static GET_COUNTRY_RESPONSE: string = "GetCountryResponse";
  public static GET_CITY: string = "GetCity";
  public static GET_CITY_RESPONSE: string = "GetCityResponse"
  public static GET_ORGANIZATION_GENERAL_INFORMATION: string = "GetOrganizationGeneralInformation";
  public static GET_ORGANIZATION_GENERAL_INFORMATION_RESPONSE: string = "GetOrganizationGeneralInformationResponse";
  public static MODIFY_ORGANIZATION_GENERAL_INFORMATION: string = "ModifyOrganizationGeneralInformation";
  public static MODIFY_ORGANIZATION_GENERAL_INFORMATION_RESPONSE: string = "ModifyOrganizationGeneralInformationResponse";  
  public static GET_CURRENCIES: string = "GetCurrencies";
  public static GET_CURRENCIES_RESPONSE: string = "GetCurrenciesResponse";
  public static REMOVE_SOCIAL_NETWORK: string = "RemoveSocialNetwork";
  public static REMOVE_SOCIAL_NETWORK_RESPONSE: string = "RemoveSocialNetworkResponse";
  public static GET_COUNTRIES_WITH_SUBDIVISIONS: string = "GetCountriesWithSubdivisions";
  public static GET_COUNTRIES_WITH_SUBDIVISIONS_RESPONSE: string = "GetCountriesWithSubdivisionsResponse";
  public static GET_ORGANIZATION_SIZES: string = "GetOrganizationSizes";
  public static GET_ORGANIZATION_SIZES_RESPONSE: string = "GetOrganizationSizesResponse";

  //#endregion


  //#region Onboarding
  public static GET_ONBOARDINGS: string = "GetOnboardings";
  public static GET_ONBOARDINGS_RESPONSE: string = "GetOnboardingsResponse";
  public static GET_ONBOARDING_STEPS_BY_ONBOARDING_ID: string = "GetOnboardingStepsByOnboardingId";
  public static GET_ONBOARDING_STEPS_BY_ONBOARDING_ID_RESPONSE: string = "GetOnboardingStepsByOnboardingIdResponse";
  public static ADD_ORGANIZATION: string = "AddOrganization";
  public static ADD_ORGANIZATION_RESPONSE: string = "AddOrganizationResponse";
  public static MODIFY_ORGANIZATION: string = "ModifyOrganization";
  public static MODIFY_ORGANIZATION_RESPONSE: string = "ModifyOrganizationResponse";
  public static ADD_LEGAL_INFORMATION: string = "AddLegalInformation";
  public static ADD_LEGAL_INFORMATION_RESPONSE: string = "AddLegalInformationResponse";
  public static MODIFY_LEGAL_INFORMATION: string = "ModifyLegalInformation";
  public static MODIFY_LEGAL_INFORMATION_RESPONSE: string = "ModifyLegalInformationResponse";
  public static ADD_LEGAL_REPRESENTATIVE: string = "AddLegalRepresentative";
  public static ADD_LEGAL_REPRESENTATIVE_RESPONSE: string = "AddLegalRepresentativeResponse";
  public static MODIFY_LEGAL_REPRESENTATIVE: string = "ModifyLegalRepresentative";
  public static MODIFY_LEGAL_REPRESENTATIVE_RESPONSE: string = "ModifyLegalRepresentativeResponse";
  //#endregion
}
