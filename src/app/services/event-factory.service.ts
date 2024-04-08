import { Injectable } from '@angular/core';
import { WebBaseEvent } from '../models/webBaseEvent';
import { Guid } from 'guid-typescript';
import { EventType } from '../models/eventType';
import { EventAction } from '../models/eventAction';
import { EventConstants } from '../models/eventConstants';
import { AuthenticationService } from './authentication.service';
import { NotificationEvent } from '../models/notificationEvent';
import { EventComponent } from '../models/eventComponent';
import { UserLoginEvent } from '../auth/interfaces/login.interface';
import { RegisterUserEvent } from '../auth/interfaces/register.interface';
import { VerifyEmailEvent } from '../auth/interfaces/verify-email.interface';
import { EmailVerificationCodeResendEvent } from '../auth/interfaces/resend-email-verification-code.interface';
import { Form, FormGroup } from '@angular/forms';
import { PerformanceFreeProfessional } from '../project-manager/Models/performanceFreeProfessional';
import { PerformanceBuy } from '../project-manager/Models/performanceBuy';

@Injectable({
  providedIn: 'root',
})
export class EventFactoryService {

  constructor(private authenticationService: AuthenticationService) {

  }

  public ConvertJsonToWebBaseEvent(jsonEvent: string): WebBaseEvent {
    const event = new WebBaseEvent();
    const jsonObject = JSON.parse(jsonEvent);
    let bodyObj = { ...jsonObject.Body }

    event.Body = bodyObj;
    event.TraceIdentifier = bodyObj.TraceIdentifier;
    event.Type = bodyObj.Type;
    event.Action = bodyObj.Action;
    event.Date = bodyObj.Date;
    event.ApplicationIdentifier = bodyObj.ApplicationIdentifier;

    event.SessionKey = jsonObject.SessionKey;
    event.SecurityToken = jsonObject.SecurityToken;

    return event;
  }

  public CreateChangingUsdUserAutorizationStatusEvent(selectedUserId: any): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CHANGING_OSD_USER_AUTORIZATION_STATUS;
    event.Date = new Date().toUTCString();
    console.log("Probando aqui");
    event.setBodyProperty(EventConstants.ID, selectedUserId);
    event.ApplicationIdentifier = 'WebClient';
    event.SessionKey = this.authenticationService.sessionKey;
    return event;
  }

  public CreateGettingFreeProfessionalsDataEvent(): WebBaseEvent {
    let event: WebBaseEvent;
    
    event = new WebBaseEvent();
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_FREE_PROFESSIONALS;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.SessionKey = this.authenticationService.sessionKey;
    return event;
  }
  
  public ConvertJsonObjectToWebBaseEvent(jsonObject: any): WebBaseEvent {
    const event = new WebBaseEvent();
    let bodyObj = { ...jsonObject.Body }

    event.Body = bodyObj;
    event.TraceIdentifier = bodyObj.TraceIdentifier;
    event.Type = bodyObj.Type;
    event.Action = bodyObj.Action;
    event.Date = bodyObj.Date;
    event.ApplicationIdentifier = bodyObj.ApplicationIdentifier;

    event.SessionKey = jsonObject.SessionKey;
    event.SecurityToken = jsonObject.SecurityToken;

    return event;
  }

  public CreateUserLoginEvent(loginForm: UserLoginEvent): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.USER_LOGIN;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.EMAIL, loginForm.email);
    event.setBodyProperty(EventConstants.PASSWORD, loginForm.password);

    return event;
  }

  public CreateAddPerformanceFreeProfessionalEvent(performanceFP: PerformanceFreeProfessional): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.ADD_PERFORMANCE_FREE_PROFESSIONAL;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.setBodyProperty(EventConstants.PROJECT_MANAGER_ID, performanceFP.proyectManagerId);
    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performanceFP.date);
    event.setBodyProperty(EventConstants.TYPE_Performance, performanceFP.type);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performanceFP.justifyingDocument);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_WORK_HOURS, performanceFP.freeProfessionalWorkHours);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_TRAVEL_HOURS, performanceFP.freeProfessionalTravelHours);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_TRAVEL_EXPENSES, performanceFP.freeProfessionalTravelExpenses);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_REMUNERATION, performanceFP.freeProfessionalRemuneration);
    event.setBodyProperty(EventConstants.TECHNICAL_DIRECTOR_DATE, performanceFP.technicalDirectorDate);
    event.setBodyProperty(EventConstants.TECHNICAL_DIRECTOR_WORK_HOURS, performanceFP.technicalDirectorWorkHours);
    event.setBodyProperty(EventConstants.TECHNICAL_DIRECTOR_TRAVEL_HOURS, performanceFP.freeProfessionalTravelHours);
    event.setBodyProperty(EventConstants.TECHNICAL_DIRECTOR_TRAVEL_EXPENSES, performanceFP.technicalDirectorTravelExpenses);
    event.setBodyProperty(EventConstants.TECHNICAL_DIRECTOR_REMUNERATION, performanceFP.technicalDirectorRemuneration);
    event.setBodyProperty(EventConstants.SUMMARY, performanceFP.summary);
    event.setBodyProperty(EventConstants.ESTIMATED_TRANSPORT_EXPENSES, performanceFP.estimatedTransportExpenses);
    event.setBodyProperty(EventConstants.ESTIMATED_TRANSPORT_HOURS, performanceFP.estimatedTransportHours);
    event.setBodyProperty(EventConstants.ESTIMATED_WORK_HOURS, performanceFP.estimatedWorkHours);

    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ID, this.authenticationService.userInfo?.id);

    console.log('Se arma el evento Performance: ', event)
    return event;
  }

  public CreateGettingClaimsDataEvent(): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GETTING_CLAIMS;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.SessionKey = this.authenticationService.sessionKey;
    
    return event;
  }
  public gettingFreeProfessionalsTRDataEvent(): WebBaseEvent {
    let event: WebBaseEvent;
    
    event = new WebBaseEvent();
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GETTING_FREE_PROFESSIONALS_TR;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.SessionKey = this.authenticationService.sessionKey;

    return event;
  }
  public assingFreeProfessionalsTRToClaimEvent(idClaim: string, idFreeProfesionalTR: string): WebBaseEvent {
    let event: WebBaseEvent;
    
    event = new WebBaseEvent();
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';

    event.setBodyProperty(EventConstants.CLAIM_ID, idClaim);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ID, idFreeProfesionalTR);

    event.SessionKey = this.authenticationService.sessionKey;

    return event;
  }
  public CreateGetPerformancesList(): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_PERFORMANCES;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
    
    return event;
  }

  public CreatePerformanceEvent(performanceForm: Form, claimId: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CREATE_PERFORMANCE;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.PERFORMANCE_FORM, performanceForm);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ID, this.authenticationService.userInfo?.identity);
    event.setBodyProperty(EventConstants.CLAIM_ID, claimId);
    return event;
  }

  public CreatePerformanceBuyEvent(performanceForm: PerformanceBuy): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CREATE_PERFORMANCE_BUY;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performanceForm.date);
    event.setBodyProperty(EventConstants.PROJECT_MANAGER_ID, "065d461a-cc09-4162-b4e9-f121c11d3348");
    event.setBodyProperty(EventConstants.PRODUCT_SERVICE_ID, performanceForm.productServiceId);
    event.setBodyProperty(EventConstants.MINIMUN_UNITS, performanceForm.minimumUnits);
    event.setBodyProperty(EventConstants.MAXIMUM_UNITS, performanceForm.maximumUnits);
    event.setBodyProperty(EventConstants.UNITARY_COST, performanceForm.unitaryCost);
    event.setBodyProperty(EventConstants.SHELF_LIFE, performanceForm.shelfLife);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performanceForm.justifyingDocument);
    event.setBodyProperty(EventConstants.SUMMARY, performanceForm.summary);
    return event;
  }

  public CreateGetClaims(): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_CLAIMS;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
 
    return event;
  }

  public CreateLoginErrorNotificationEvent(webBaseEvent: WebBaseEvent, message: string): NotificationEvent {
    let event: NotificationEvent;

    event = new NotificationEvent();
    event.TraceIdentifier = webBaseEvent.TraceIdentifier;
    event.Component = EventComponent.Login;
    event.Action = EventAction.SHOW_LOGIN_FAILURE;
    event.Message = message;

    return event;
  }

  public CreateGetSubscribers(): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_SUBSCRIBERS;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
 
    return event;
  }

  public CreateRegisterUserEvent(accountForm: RegisterUserEvent, personalForm: RegisterUserEvent, accounType : String, claimantId: String): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.REGISTER_CUSTOMER; 
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient"; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.ACCOUNT_FORM, accountForm);
    event.setBodyProperty(EventConstants.PERSONAL_FORM, personalForm);
    event.setBodyProperty(EventConstants.ACCOUNT_TYPE, accounType);
    if(claimantId !== ""){
      event.setBodyProperty(EventConstants.CLAIMANT_ID, claimantId);
    }
    return event;
  }

  public CreateAddClaimEvent(claimantId: String, claimType: String, Subscriberclaimed: String, Serviceprovided: String, fact: String, amountClaimed: String, document1: String, document2: String): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CREATE_CLAIM; 
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient"; //TODO: change to use an application identifier
    
    event.setBodyProperty(EventConstants.CLAIMANT_ID, claimantId);
    event.setBodyProperty(EventConstants.CLAIM_TYPE, claimType);
    event.setBodyProperty(EventConstants.SUBSCRIBER_COSTUMER, Subscriberclaimed);
    event.setBodyProperty(EventConstants.SERVICE_PROVIDED, Serviceprovided);
    event.setBodyProperty(EventConstants.FACTS, fact);
    event.setBodyProperty(EventConstants.AMOUNT_CLAIMED, amountClaimed);
    event.setBodyProperty(EventConstants.SUPPORTING_DOCUMENT1, document1);
    event.setBodyProperty(EventConstants.SUPPORTING_DOCUMENT2, document);

    return event;
  }

  public CreateVerifyEmailEvent(verifyEmailForm: VerifyEmailEvent): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.Security;
    event.Action = EventAction.VERIFY_EMAIL;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient"; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.EMAIL, verifyEmailForm.sessionKey);
    event.setBodyProperty(EventConstants.EMAIL_VERIFICATION_CODE, verifyEmailForm.code);

    return event;
  }

  public CreateEmailVerificationCodeResendEvent(emailVerificationCodeResendEvent: EmailVerificationCodeResendEvent): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.Security;
    event.Action = EventAction.RESEND_EMAIL_VERIFICATION_CODE;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient"; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.EMAIL, emailVerificationCodeResendEvent.sessionKey);

    return event;
  }

  public CreateUserInterfaceActivityEvent(sourceContainer: string, sourceControl: string, sourceControlEvent: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();

    event.Action = EventAction.REGISTER_USER_INTERFACE_ACTIVITY;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.Monitoring;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.USERNAME, 'gvillalobos');
    event.setBodyProperty(EventConstants.SOURCE_CONTAINER, sourceContainer);
    event.setBodyProperty(EventConstants.SOURCE_CONTROL, sourceControl);
    event.setBodyProperty(
      EventConstants.SOURCE_CONTROL_EVENT,
      sourceControlEvent
    );

    return event;
  }

  public CreatePasswordResetToken(email: string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GENERATE_MAIL_PASSWORD_RESET_TOKEN;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.Security;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.EMAIL, email);

    return event;
  }

  public UpdatePassword(hash: string, password: string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.UPDATE_ACCOUNT_PASSWORD;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.Security;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.HASHTOKEN, hash);
    event.setBodyProperty(EventConstants.PASSWORD, password);

    return event;
  }

}
