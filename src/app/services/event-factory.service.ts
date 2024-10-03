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
import { VerifyEmailEvent } from '../auth/interfaces/verify-email.interface';
import { EmailVerificationCodeResendEvent } from '../auth/interfaces/resend-email-verification-code.interface';
import { Form } from '@angular/forms';
import { PerformanceFreeProfessional } from '../project-manager/Models/performanceFreeProfessional';
import { PerformanceBuy } from '../project-manager/Models/performanceBuy';
import { ClaimantAndClaimsCustomerPerformance } from '../functions/models/ClaimantAndClaimsCustomerPerformance';
import { CreateProjectEvent } from '../project-manager/Interface/project.interface';
import { CreateClaimValuationEvent } from '../functions/Interface/ClaimValuation.interface';
import { ResponseToPerformanceAssignedEvent } from '../project-manager/Interface/responseToPerformanceAssignedEvent.interface';
import { UserInfo } from '../models/userInfo';
import { ClaimsProcessorPerformance } from '../functions/models/ClaimsProcessorPerformance';
import { ClaimsTrainerPerformance } from '../functions/models/ClaimsTrainerPerformance';
import { CloseClaimFileEvent } from '../functions/models/CloseClaimFileEvent';

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

  public CreateAddPerformanceFreeProfessionalEvent(performanceFP: PerformanceFreeProfessional, projectManagerSelectedId : string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.ADD_PERFORMANCE_FREE_PROFESSIONAL;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.setBodyProperty(EventConstants.PROJECT_MANAGER_ID, projectManagerSelectedId);
    event.setBodyProperty(EventConstants.START_DATE, performanceFP.Start_Date);
    event.setBodyProperty(EventConstants.END_DATE, performanceFP.End_Date);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ID, this.authenticationService.userInfo?.Id);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ASSIGNED_ID, performanceFP.FreeProfessionalAssignedId);
    event.setBodyProperty(EventConstants.SUMMARY_ID, performanceFP.SummaryId);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performanceFP.JustifyingDocument);

    event.setBodyProperty(EventConstants.FORECAST_TRAVEL_EXPENSES, performanceFP.ForecastTravelExpenses);
    event.setBodyProperty(EventConstants.FORECAST_TRAVEL_TIME, performanceFP.ForecastTravelTime);
    event.setBodyProperty(EventConstants.FORECAST_WORK_HOURS, performanceFP.ForecastWorkHours);  
    event.setBodyProperty(EventConstants.TOTAL_FORECAST_DATA, performanceFP.TotalForecastData);  
    return event;
  }

  public CreateModifyPerformanceFreeProfessionalEvent(performanceFP: PerformanceFreeProfessional, projectManagerSelectedId : string, performanceId : string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.MODIFY_PERFORMANCE_FREE_PROFESSIONAL;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.setBodyProperty(EventConstants.PERFORMANCE_ID, performanceId);
    event.setBodyProperty(EventConstants.PROJECT_MANAGER_ID, projectManagerSelectedId);
    event.setBodyProperty(EventConstants.START_DATE, performanceFP.Start_Date);
    event.setBodyProperty(EventConstants.END_DATE, performanceFP.End_Date);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ID, this.authenticationService.userInfo?.Id);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ASSIGNED_ID, performanceFP.FreeProfessionalAssignedId);
    event.setBodyProperty(EventConstants.SUMMARY_ID, performanceFP.SummaryId);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performanceFP.JustifyingDocument);

    event.setBodyProperty(EventConstants.FORECAST_TRAVEL_EXPENSES, performanceFP.ForecastTravelExpenses);
    event.setBodyProperty(EventConstants.FORECAST_TRAVEL_TIME, performanceFP.ForecastTravelTime);
    event.setBodyProperty(EventConstants.FORECAST_WORK_HOURS, performanceFP.ForecastWorkHours);  
    event.setBodyProperty(EventConstants.TOTAL_FORECAST_DATA, performanceFP.TotalForecastData);  
    return event;
  }

  public CreateClaimTrainerEvent(claimTrainer: ClaimsTrainerPerformance, claimId : string, documentBytes: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.ADD_PERFORMANCE_CLAIM_TRAINER;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';

    event.setBodyProperty(EventConstants.CLAIM_ID, claimId);
    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, claimTrainer.Date);
    event.setBodyProperty(EventConstants.TYPE_PERFORMANCE, claimTrainer.Type);
    event.setBodyProperty(EventConstants.SUMMARY, claimTrainer.Summary);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, claimTrainer.JustifyingDocument);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT_BYTES, documentBytes);
    event.setBodyProperty(EventConstants.TRAINER_WORK_HOURS, claimTrainer.TrainerWorkHours);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_HOURS, claimTrainer.TrainerTravelHours);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_EXPENSES, claimTrainer.TrainerTravelExpenses);
    event.setBodyProperty(EventConstants.TRAINER_REMUNERATION, claimTrainer.TrainerRemuneration);

    console.log("Evento: ",event)
    return event;
  }

  public ModifyPerformanceTrainerEvent(claimTrainer: ClaimsTrainerPerformance, performanceId : string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.MODIFY_PERFORMANCE_CLAIM_TRAINER;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';

    event.setBodyProperty(EventConstants.PERFORMANCE_ID, performanceId);
    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, claimTrainer.Date);
    event.setBodyProperty(EventConstants.TYPE_PERFORMANCE, claimTrainer.Type);
    event.setBodyProperty(EventConstants.SUMMARY, claimTrainer.Summary);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, claimTrainer.JustifyingDocument);
    event.setBodyProperty(EventConstants.TRAINER_WORK_HOURS, claimTrainer.TrainerWorkHours);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_HOURS, claimTrainer.TrainerTravelHours);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_EXPENSES, claimTrainer.TrainerTravelExpenses);
    event.setBodyProperty(EventConstants.TRAINER_REMUNERATION, claimTrainer.TrainerRemuneration);

    return event;
  }

  public CreateGettingClaimsDataEvent(userId: string, accountType: string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GETTING_CLAIMS;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.SessionKey = this.authenticationService.sessionKey;
    event.setBodyProperty(EventConstants.USER_ID, userId);
    event.setBodyProperty(EventConstants.ACCOUNT_TYPE, accountType);

    return event;
  }
  public gettingFreeProfessionalsTRDataEvent(subscriberId : string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GETTING_FREE_PROFESSIONALS_TR;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient';
    event.SessionKey = this.authenticationService.sessionKey;

    event.setBodyProperty(EventConstants.SUBSCRIBER_ID, subscriberId);

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

  public CreateGetPerformancesProjectManagerById(projectManagerId : string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_PERFORMANCES_PROJECT_MANAGER_BY_ID;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.PROJECT_MANAGER_ID, projectManagerId);
    return event;
  }

  public CreateGetTransparencyReportsSubscriberClients(): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_TRANSPARENCY_REPORTS_SUBSCRIBER_CLIENTES;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    return event;
  }
  public CreateGetTransparencyReportsIncomeExpenses(subscriberId: string, country: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_TRANSPARENCY_REPORTS_INCOME_EXPENSES;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.COUNTRY, country);
    event.setBodyProperty(EventConstants.SUBSCRIBER_ID, subscriberId);

    return event;
  }
  public CreateGetTransparencyFreeProfessionals(): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.GET_TRANSPARENCY_FREE_PROFESSIONALS;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    return event;
  }

  public CreateClaimantAndClaimsCustomerPerformance(performance: ClaimantAndClaimsCustomerPerformance, claimId: string, userTypePerformance: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CREATE_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performance.Date);
    event.setBodyProperty(EventConstants.TYPE_PERFORMANCE, performance.Type);
    event.setBodyProperty(EventConstants.USER_TYPE_PERFORMANCE,userTypePerformance);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performance.JustifyingDocument);
    event.setBodyProperty(EventConstants.SUMMARY, performance.Summary);
    event.setBodyProperty(EventConstants.CLAIM_ID, claimId);
    return event;
  }

  public modifiedClaimantAndClaimsCustomerPerformance(performance: ClaimantAndClaimsCustomerPerformance, performanceId: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.MODIFIED_CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performance.Date);
    event.setBodyProperty(EventConstants.TYPE_PERFORMANCE, performance.Type);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performance.JustifyingDocument);
    event.setBodyProperty(EventConstants.TRAINER_DATE, performance.TrainerDate);
    event.setBodyProperty(EventConstants.TRAINER_WORK_HOURS, performance.TrainerWorkHours);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_HOURS, performance.TrainerTravelHours);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_EXPENSES, performance.TrainerTravelExpenses);
    event.setBodyProperty(EventConstants.TRAINER_REMUNERATION, performance.TrainerRemuneration);
    event.setBodyProperty(EventConstants.SUMMARY, performance.Summary);
    event.setBodyProperty(EventConstants.PERFORMANCE_CLAIM_ID, performanceId);
 
    return event;
  }

  public createClaimsProcessorPerformance(performance: ClaimsProcessorPerformance, claimId: string, documentBytes: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CREATE_CLAIM_PROCESSOR_PERFORMANCE;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performance.Date);
    event.setBodyProperty(EventConstants.TYPE_PERFORMANCE, performance.Type);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performance.JustifyingDocument);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT_BYTES, documentBytes);
    event.setBodyProperty(EventConstants.PROCESSOR_WORK_HOURS, performance.Processor_WorkHours);
    event.setBodyProperty(EventConstants.PROCESSOR_TRAVEL_HOURS, performance.Processor_TravelTime);
    event.setBodyProperty(EventConstants.PROCESSOR_TRAVEL_EXPENSES, performance.Processor_TravelExpenses);
    event.setBodyProperty(EventConstants.PROCESSOR_REMUNERATION, performance.Processor_Remuneration);
    event.setBodyProperty(EventConstants.SUMMARY, performance.Summary);
    event.setBodyProperty(EventConstants.CLAIM_ID, claimId);
    return event;
  }

  public modifiedClaimsProcessorPerformance(performance: ClaimsProcessorPerformance, performanceId: string, documentBase64: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.MODIFIED_CLAIM_PROCESSOR_PERFORMANCE;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performance.Date);
    event.setBodyProperty(EventConstants.TYPE_PERFORMANCE, performance.Type);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performance.JustifyingDocument);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT_BYTES, documentBase64);
    event.setBodyProperty(EventConstants.PROCESSOR_WORK_HOURS, performance.Processor_WorkHours);
    event.setBodyProperty(EventConstants.PROCESSOR_TRAVEL_HOURS, performance.Processor_TravelTime);
    event.setBodyProperty(EventConstants.PROCESSOR_TRAVEL_EXPENSES, performance.Processor_TravelExpenses);
    event.setBodyProperty(EventConstants.PROCESSOR_REMUNERATION, performance.Processor_Remuneration);
    event.setBodyProperty(EventConstants.TRAINER_DATE, performance.Trainer_Date);
    event.setBodyProperty(EventConstants.TRAINER_WORK_HOURS, performance.Trainer_WorkHours);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_HOURS, performance.Trainer_TravelTime);
    event.setBodyProperty(EventConstants.TRAINER_TRAVEL_EXPENSES, performance.Trainer_TravelExpenses);
    event.setBodyProperty(EventConstants.TRAINER_REMUNERATION, performance.Trainer_Remuneration);
    event.setBodyProperty(EventConstants.SUMMARY, performance.Summary);
    event.setBodyProperty(EventConstants.PERFORMANCE_CLAIM_ID, performanceId);
 
    return event;
  }

  public CreatePerformanceBuyEvent(performanceForm: PerformanceBuy, projectManagerId: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CREATE_PERFORMANCE_BUY;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performanceForm.Date);
    event.setBodyProperty(EventConstants.USER_ID, this.authenticationService.userInfo?.Id);
    event.setBodyProperty(EventConstants.PROJECT_MANAGER_ID, projectManagerId);
    event.setBodyProperty(EventConstants.PRODUCT_SERVICE_ID, performanceForm.ProductServiceId);
    event.setBodyProperty(EventConstants.MINIMUN_UNITS, performanceForm.MinimumUnits);
    event.setBodyProperty(EventConstants.MAXIMUM_UNITS, performanceForm.MaximumUnits);
    event.setBodyProperty(EventConstants.UNITARY_COST, performanceForm.UnitaryCost);
    event.setBodyProperty(EventConstants.SHELF_LIFE, performanceForm.ShelfLife);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performanceForm.JustifyingDocument);
    event.setBodyProperty(EventConstants.SUMMARY_ID, performanceForm.SummaryTypeId);
    return event;
  }

  public CreateModifyPerformanceBuyEvent(performanceForm: PerformanceBuy, projectManagerId: string, performanceId: string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.MODIFY_PERFORMANCE_BUY;
    event.Date = new Date().toUTCString();
    event.ApplicationIdentifier = 'WebClient'; //TODO: change to use an application identifier
    event.setBodyProperty(EventConstants.PERFORMANCE_ID, performanceId);
    event.setBodyProperty(EventConstants.DATE_PERFORMANCE, performanceForm.Date);
    event.setBodyProperty(EventConstants.USER_ID, this.authenticationService.userInfo?.Id);
    event.setBodyProperty(EventConstants.PROJECT_MANAGER_ID, projectManagerId);
    event.setBodyProperty(EventConstants.PRODUCT_SERVICE_ID, performanceForm.ProductServiceId);
    event.setBodyProperty(EventConstants.MINIMUN_UNITS, performanceForm.MinimumUnits);
    event.setBodyProperty(EventConstants.MAXIMUM_UNITS, performanceForm.MaximumUnits);
    event.setBodyProperty(EventConstants.UNITARY_COST, performanceForm.UnitaryCost);
    event.setBodyProperty(EventConstants.SHELF_LIFE, performanceForm.ShelfLife);
    event.setBodyProperty(EventConstants.JUSTIFYING_DOCUMENT, performanceForm.JustifyingDocument);
    event.setBodyProperty(EventConstants.SUMMARY_ID, performanceForm.SummaryTypeId);
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

  public CreateRegisterUserEvent(accountForm: Form, personalForm: Form, accounType: String): WebBaseEvent {
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

    return event;
  }

  public CreateAddClaimEvent(claimForm: Form): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.CREATE_CLAIM;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient"; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.CLAIM_FORM, claimForm);

    return event;
  }

  public CreateAddSummaryTypeEvent(name: string, type: string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Action = EventAction.ADD_SUMMARY_TYPE;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient"; //TODO: change to use an application identifier

    event.setBodyProperty(EventConstants.SUMMARY_NAME, name);
    event.setBodyProperty(EventConstants.SUMMARY_TYPE, type);

    return event;
  }

  public CreateProjectEvent(projectForm : CreateProjectEvent): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.CREATE_PROJECT;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.OBJECTIVE, projectForm.Objective);
    event.setBodyProperty(EventConstants.EXPECTED_HOURS, projectForm.Expected_hours);
    event.setBodyProperty(EventConstants.ECONOMIC_BUDGET, projectForm.Economic_budget);
    event.setBodyProperty(EventConstants.START_DATE, projectForm.Start_Date);
    return event;
  }

  public CreateGetProjectsEvent(): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GET_PROJECTS;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
   
    return event;
  }

  public CreateUpdateValuationEvent(ClaimValuationForm : CreateClaimValuationEvent): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.UPDATE_EVALUATION;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.CLAIM_ID, ClaimValuationForm.ClaimId);
    event.setBodyProperty(EventConstants.VALUATION_SUBSCRIBER, ClaimValuationForm.ValuationSubscriber);
    event.setBodyProperty(EventConstants.VALUATION_CLAIMANT, ClaimValuationForm.ValuationClaimant);
    event.setBodyProperty(EventConstants.VALUATION_FREE_PROFESSIONAL, ClaimValuationForm.ValuationFreeProfessionals);
   
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

  public ChangePassword(password: string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.CHANGE_PASSWORD;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";

    event.setBodyProperty(EventConstants.PASSWORD, password);
    event.setBodyProperty(EventConstants.USER_ID, this.authenticationService.userInfo?.Id);

    return event;
  }

  public ModifyUserInformation(osdUser: UserInfo): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.MODIFY_USER_INFORMATION;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";

    event.setBodyProperty(EventConstants.NAME, osdUser.Name);
    event.setBodyProperty(EventConstants.FIRST_NAME, osdUser.Firstname);
    event.setBodyProperty(EventConstants.LAST_NAME, osdUser.Middlesurname);
    event.setBodyProperty(EventConstants.COUNTRY, osdUser.Country);
    event.setBodyProperty(EventConstants.EMAIL, osdUser.Email);
    event.setBodyProperty(EventConstants.USER_ID, this.authenticationService.userInfo?.Id);

    return event;
  }


  public GetPerformancesClaimById(id: string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GET_PERFORMANCES_CLAIM_BY_ID;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.ID, id);

    return event;
  }

  public CreateGetSummaryTypes(): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GET_SUMMARY_TYPES;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";

    return event;
  }

  public CreateGetUnassignedSubscribers(): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GET_UNASSIGNED_SUBSCRIBERS;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";

    return event;
  }

  public CreateGetProfessionalFreeTrainers(): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GET_PROFRESSIONALFREE_TRAINERS;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";

    return event;
  }

  public CreateGetPerformancesAssignedById(userId : string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GET_PERFORMANCES_ASSIGNED_BY_ID;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.USER_ID, userId);

    return event;
  }

  public CreateAddResponseToPerformancesAssigned(performance : ResponseToPerformanceAssignedEvent, performanceAssignedId : string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.ADD_RESPONSE_TO_PERFORMANCE_ASSIGNED;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.PERFORMANCE_ASSIGNED_ID, performanceAssignedId);
    event.setBodyProperty(EventConstants.USER_ID, this.authenticationService.userInfo?.Id);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_WORK_HOURS, performance.FP_WorkHours);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_TRAVEL_HOURS, performance.FP_TravelTime);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_TRAVEL_EXPENSES, performance.FP_TravelExpenses);
    event.setBodyProperty(EventConstants.TOTAL_FREE_PROFESSIONAL, performance.Total_FP);
    event.setBodyProperty(EventConstants.JUSTIFY_CHANGE_ESTIMATED_WORK_HOURS, performance.JustifyChangeEstimatedWorkHours);
    event.setBodyProperty(EventConstants.DOCUMENT_INCREASE_WORKING_HOURS, performance.DocumentIncreaseWorkingHours);

    return event;
  }

  public CreateModifyResponseToPerformancesAssigned(subPerformanceId : string, performance : ResponseToPerformanceAssignedEvent, performanceAssignedId : string): WebBaseEvent {
    let event: WebBaseEvent;
    event = new WebBaseEvent();
    event.Action = EventAction.MODIFY_RESPONSE_TO_PERFORMANCE_ASSIGNED;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.PERFORMANCE_ASSIGNED_ID, performanceAssignedId);
    event.setBodyProperty(EventConstants.SUBPERFORMANCE_ID, subPerformanceId);
    event.setBodyProperty(EventConstants.USER_ID, this.authenticationService.userInfo?.Id);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_WORK_HOURS, performance.FP_WorkHours);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_TRAVEL_HOURS, performance.FP_TravelTime);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_TRAVEL_EXPENSES, performance.FP_TravelExpenses);
    event.setBodyProperty(EventConstants.TOTAL_FREE_PROFESSIONAL, performance.Total_FP);
    event.setBodyProperty(EventConstants.JUSTIFY_CHANGE_ESTIMATED_WORK_HOURS, performance.JustifyChangeEstimatedWorkHours);
    event.setBodyProperty(EventConstants.DOCUMENT_INCREASE_WORKING_HOURS, performance.DocumentIncreaseWorkingHours);

    return event;
  }

  public CreateValidateResponseToPerformancesAssigned(subPerformanceId: string, performance : ResponseToPerformanceAssignedEvent): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.VALIDATE_RESPONSE_TO_PERFORMANCE_ASSIGNED;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.SUBPERFORMANCE_ID, subPerformanceId);
    event.setBodyProperty(EventConstants.USER_ID, this.authenticationService.userInfo?.Id);
    event.setBodyProperty(EventConstants.TD_WORK_HOURS, performance.TD_WorkHours);
    event.setBodyProperty(EventConstants.TD_DATE, performance.TD_Date);
    event.setBodyProperty(EventConstants.ACCEPT_INCREASE_IN_HOURS, performance.AcceptIncreaseInHours);

    return event;
  }

  public CreateGetSubPerformanceById(performanceId : string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.GET_SUB_PERFORMANCE_BY_ID;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.PERFORMANCE_ID, performanceId);

    return event;
  }

  public CreateAssignTrainerToSubscriber(subscriberId : string, trainerId : string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.ASSIGN_TRAINER_TO_SUBSCRIBER;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.SUBSCRIBER_ID, subscriberId);
    event.setBodyProperty(EventConstants.FREE_PROFESSIONAL_ID, trainerId);


    return event;
  }

  public CreateCloseClaimFile(closeClaimfileForm: CloseClaimFileEvent, ClaimId : string): WebBaseEvent {
    let event: WebBaseEvent;

    event = new WebBaseEvent();
    event.Action = EventAction.CLOSE_CLAIM_FILE;
    event.SessionKey = this.authenticationService.sessionKey;
    event.SecurityToken = "3746736473";
    event.TraceIdentifier = Guid.create().toString();
    event.Type = EventType.OSD;
    event.Date = (new Date()).toUTCString();
    event.ApplicationIdentifier = "WebClient";
    event.setBodyProperty(EventConstants.CLAIM_ID, ClaimId);
    event.setBodyProperty(EventConstants.AMOUNT_PAID, closeClaimfileForm.AmountPaid);
    event.setBodyProperty(EventConstants.PAYMENT_DATE, closeClaimfileForm.creditingDate);
    event.setBodyProperty(EventConstants.SAVINGS_INSTITUTION, closeClaimfileForm.AAsavingsPP);

    return event;
  }
}
