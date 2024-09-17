import { Injectable } from '@angular/core';
import { RestAPIService } from 'src/app/services/rest-api.service';
import { EventFactoryService } from './event-factory.service';
import { UserLoginEvent } from '../auth/interfaces/login.interface';
import { WebBaseEvent } from '../models/webBaseEvent';
import { AuthenticationService } from './authentication.service';
import { EventConstants } from '../models/eventConstants';
import { ModalActions, AuthenticationActions, ClaimActions } from '../store/actions';
import { Store } from '@ngrx/store';
import { NotificationService } from './notification.service';
import { SecurityDataService } from './security-data.service';
import { OSDDataService } from './osd-data.service';
import { Form } from '@angular/forms';
import { UserInfo } from '../models/userInfo';
import { PerformanceFreeProfessional } from '../project-manager/Models/performanceFreeProfessional';
import { PerformanceBuy } from '../project-manager/Models/performanceBuy';
import { TranslateService } from '@ngx-translate/core';
import { ClaimantAndClaimsCustomerPerformance } from '../functions/models/ClaimantAndClaimsCustomerPerformance';
import { CreateProjectEvent } from '../project-manager/Interface/project.interface';
import { Project } from '../project-manager/Models/project';
import { CreateClaimValuationEvent } from '../functions/Interface/ClaimValuation.interface';
import { SummaryTypes } from '../project-manager/Models/summaryTypes';
import { FreeProfessional } from '../functions/models/FreeProfessional';
import { Subscriber } from '../functions/models/Subscriber';
import { Router } from '@angular/router';
import { ResponseToPerformanceAssignedEvent } from '../project-manager/Interface/responseToPerformanceAssignedEvent.interface';
import { ResponseToPerformanceFreeProfessional } from '../project-manager/Models/responseToperformanceFreeProfessional';
import { ClaimsProcessorPerformance } from '../functions/models/ClaimsProcessorPerformance';

@Injectable({
  providedIn: 'root'
})
export class OSDService {
  claims: any[] = [];
  usersFreeProfessionalsTR: any[] = [];
  freeProfessionalsTR: any[] = [];
  claimsResponse: boolean = false;
  freeProfessionalsTRResponse: boolean = false;
  freeProfessionals: FreeProfessional[] = [];
  freeProfessionalsResponse: boolean = false;
  message: string = "";
  messageResponse: boolean = false;

  constructor(
    private store: Store,
    private restApiService: RestAPIService,
    private osdDataService: OSDDataService,
    private securityDataService: SecurityDataService,
    private eventFactoryService: EventFactoryService,
    public authenticationService: AuthenticationService,
    public notificationService: NotificationService,
    private translate: TranslateService,
    private route: Router
  ) {

  }

  cleanClaimList() {
    this.claims = []
    this.claimsResponse = false;
  }

  cleanFreeProfessionalsList() {
    this.freeProfessionals = []
    this.freeProfessionalsResponse = false;
  }

  getFreeProfessionalsList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const checkResponse = () => {
        if (this.freeProfessionalsResponse) {
          resolve(this.freeProfessionals);
        } else {
          setTimeout(checkResponse, 1000);
        }
      };

      checkResponse();
    });
  }

  public GetFreeProfessionalsDataEvent() {
    const gettingFreeProfessionalsEvent: WebBaseEvent = this.eventFactoryService.CreateGettingFreeProfessionalsDataEvent();
    this.restApiService.SendOSDEvent(gettingFreeProfessionalsEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGettingFreeProfessionalsListResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public changingUsdUserAutorizationStatusEvent(selectedUserId: any) {
    const autorizationOsdUser: WebBaseEvent = this.eventFactoryService.CreateChangingUsdUserAutorizationStatusEvent(selectedUserId);
    this.restApiService.SendOSDEvent(autorizationOsdUser).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleChangingOsdUserAutorizationResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  getClaimList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const checkResponse = () => {
        if (this.claimsResponse) {
          resolve(this.claims);
        } else {
          setTimeout(checkResponse, 1000);
        }
      };

      checkResponse();
    });
  }

  public userLogin(loginForm: UserLoginEvent) {
    const userLoginEvent: WebBaseEvent = this.eventFactoryService.CreateUserLoginEvent(loginForm);
    this.restApiService.SendOSDEvent(userLoginEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAuthenticationResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public addPerformanceFreeProfessional(performanceFP: PerformanceFreeProfessional, projectManagerSelectedId: string) {
    const event: WebBaseEvent = this.eventFactoryService.CreateAddPerformanceFreeProfessionalEvent(performanceFP, projectManagerSelectedId);
    console.log(event)
    this.restApiService.SendOSDEvent(event).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAddPerformanceFreeProfessionalResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public modifyPerformanceFreeProfessional(performanceFP: PerformanceFreeProfessional, projectManagerSelectedId: string, performanceId: string) {
    const event: WebBaseEvent = this.eventFactoryService.CreateModifyPerformanceFreeProfessionalEvent(performanceFP, projectManagerSelectedId, performanceId);
    console.log(event)
    this.restApiService.SendOSDEvent(event).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifyPerformanceFreeProfessionalResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public gettingClaimsData(userId: string, accountType: string) {
    const gettingClaimsEvent: WebBaseEvent = this.eventFactoryService.CreateGettingClaimsDataEvent(userId, accountType);
    this.restApiService.SendOSDEvent(gettingClaimsEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGettingClaimListResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public gettingFreeProfessionalsTRData(subscriberId: string) {
    const gettingFPTREvent: WebBaseEvent = this.eventFactoryService.gettingFreeProfessionalsTRDataEvent(subscriberId);
    this.restApiService.SendOSDEvent(gettingFPTREvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGettingFreeProfessionalsTRResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public assignFreeProfessionalsTRToClaim(idClaim: string, idFreeProfesionalTR: string) {
    const assignFPTRClaim: WebBaseEvent = this.eventFactoryService.assingFreeProfessionalsTRToClaimEvent(idClaim, idFreeProfesionalTR);
    this.restApiService.SendOSDEvent(assignFPTRClaim).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAssignFreeProfessionalsTRToClaimsResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public userRegister(accountForm: Form, personalForm: Form, accountType: string) {
    const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterUserEvent(accountForm, personalForm, accountType);
    this.restApiService.SendOSDEvent(registerUserEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleRegisterUserResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public addClaim(claimForm: Form) {
    const addClaimEvent: WebBaseEvent = this.eventFactoryService.CreateAddClaimEvent(claimForm);
    this.restApiService.SendOSDEvent(addClaimEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAddClaimResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public addSummaryType(name: string, type: string) {
    const event: WebBaseEvent = this.eventFactoryService.CreateAddSummaryTypeEvent(name, type);
    this.restApiService.SendOSDEvent(event).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.AddSummaryTypeResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public performanceBuy(performanceForm: PerformanceBuy, projectManagerId: string) {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreatePerformanceBuyEvent(performanceForm, projectManagerId);
    console.log(performanceBuyEvent)
    this.restApiService.SendOSDEvent(performanceBuyEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAddPerformanceBuyResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public modifyPerformanceBuy(performanceForm: PerformanceBuy, projectManagerId: string, performanceId: string) {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreateModifyPerformanceBuyEvent(performanceForm, projectManagerId, performanceId);
    console.log(performanceBuyEvent)
    this.restApiService.SendOSDEvent(performanceBuyEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifyPerformanceBuyResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public getPerformancesProjectManagerById(projectManagerId: string) {
    const GetPerformancesProjectManagerByIdEvent: WebBaseEvent = this.eventFactoryService.CreateGetPerformancesProjectManagerById(projectManagerId);
    this.restApiService.SendOSDEvent(GetPerformancesProjectManagerByIdEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGetPerformancesProjectManagerByIdResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetTransparencyReportsIncomeExpenses() {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreateGetTransparencyReportsIncomeExpenses();
    this.restApiService.SendOSDEvent(performanceBuyEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.GetTransparencyReportsIncomeExpensesResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }
  public GetTransparencyFreeProfessionals() {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreateGetTransparencyFreeProfessionals();
    this.restApiService.SendOSDEvent(performanceBuyEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.GET_TRANSPARENCY_FREE_PROFESSIONALS_RESPONSE(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetTransparencyReportsSubscriberClients() {
    const event: WebBaseEvent = this.eventFactoryService.CreateGetTransparencyReportsSubscriberClients();
    this.restApiService.SendOSDEvent(event).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.GetTransparencyReportsSubscriberClientsResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public UpdateValuation(ClaimValuationForm: CreateClaimValuationEvent) {
    const UpdateValuationEvent: WebBaseEvent = this.eventFactoryService.CreateUpdateValuationEvent(ClaimValuationForm);
    this.restApiService.SendOSDEvent(UpdateValuationEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleUpdateValuationResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public ChangePassword(password: string) {
    const ChangePasswordEvent: WebBaseEvent = this.eventFactoryService.ChangePassword(password);
    this.restApiService.SendOSDEvent(ChangePasswordEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.GetTransparencyReportsSubscriberClientsResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public ModifyUserInformation(osdUser: UserInfo) {
    const ModifyUserInformationEvent: WebBaseEvent = this.eventFactoryService.ModifyUserInformation(osdUser);
    this.restApiService.SendOSDEvent(ModifyUserInformationEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifyUserInformationResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetPerformancesClaimById(id: string) {
    const GetPerformancesClaim: WebBaseEvent = this.eventFactoryService.GetPerformancesClaimById(id);
    this.restApiService.SendOSDEvent(GetPerformancesClaim).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.GetPerformancesClaimByIdResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public getPerformancesAssignedById(userId: string) {
    const CreateGetPerformancesAssignedByIdEvent: WebBaseEvent = this.eventFactoryService.CreateGetPerformancesAssignedById(userId);
    this.restApiService.SendOSDEvent(CreateGetPerformancesAssignedByIdEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreateGetPerformanceAssignedByIdResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public addResponseToPerformanceAssigned(performance: ResponseToPerformanceAssignedEvent, performanceAssignedId: string) {
    const CreateAddResponseToPerformancesAssignedEvent: WebBaseEvent = this.eventFactoryService.CreateAddResponseToPerformancesAssigned(performance, performanceAssignedId);
    this.restApiService.SendOSDEvent(CreateAddResponseToPerformancesAssignedEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAddResponseToPerformanceAssignedResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public modifyResponseToPerformanceAssigned(subPerformanceId: string, performance: ResponseToPerformanceAssignedEvent, performanceAssignedId: string) {
    const CreateModifyResponseToPerformancesAssignedEvent: WebBaseEvent = this.eventFactoryService.CreateModifyResponseToPerformancesAssigned(subPerformanceId, performance, performanceAssignedId);
    this.restApiService.SendOSDEvent(CreateModifyResponseToPerformancesAssignedEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifyResponseToPerformanceAssignedResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public validateResponseToPerformanceAssigned(subPerformanceId: string, performance: ResponseToPerformanceAssignedEvent) {
    const CreateValidateResponseToPerformancesAssignedEvent: WebBaseEvent = this.eventFactoryService.CreateValidateResponseToPerformancesAssigned(subPerformanceId, performance);
    this.restApiService.SendOSDEvent(CreateValidateResponseToPerformancesAssignedEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleValidateResponseToPerformanceAssignedResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetSubPerformanceById(performanceId: string) {
    const CreateGetSubPerformanceByIdEvent: WebBaseEvent = this.eventFactoryService.CreateGetSubPerformanceById(performanceId);
    this.restApiService.SendOSDEvent(CreateGetSubPerformanceByIdEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGetSubPerformanceByIdResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public HandleGettingFreeProfessionalsListResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['ListFreeProfessionals']) {
        this.freeProfessionals = webBaseEvent.Body['ListFreeProfessionals'];
        this.freeProfessionalsResponse = true;
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay profesionales libres registrados' }));
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public GetPerformancesClaimByIdResponse(webBaseEvent: WebBaseEvent) {
    try {
      var ClaimantAndClaimsCustomerPerformanceList = webBaseEvent.getBodyProperty(EventConstants.CLAIMANT_AND_CLAIMS_CUSTOMER_PERFORMANCE_LIST);
      var ClaimsProcessorPerformanceList = webBaseEvent.getBodyProperty(EventConstants.CLAIMS_PROCESSOR_PERFORMANCE_LIST);
      var ClaimsTrainerPerformanceList = webBaseEvent.getBodyProperty(EventConstants.CLAIMS_TRAINER_PERFORMANCE_LIST);

      if (ClaimantAndClaimsCustomerPerformanceList.length > 0 || ClaimsProcessorPerformanceList.length > 0 || ClaimsTrainerPerformanceList.length > 0) {
        this.osdDataService.emitClaimantAndClaimsCustomerPerformanceList(ClaimantAndClaimsCustomerPerformanceList);
        this.osdDataService.emitClaimsProcessorPerformanceList(ClaimsProcessorPerformanceList);
        this.osdDataService.emitClaimsTrainerPerformanceList(ClaimsTrainerPerformanceList);
      }
      else{
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No performance has been created" }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No se ha creado ninguna actuación" }));
        }
        this.store.dispatch(ModalActions.openAlert());
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }



  public HandleChangingOsdUserAutorizationResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['Message']) {
        this.message = webBaseEvent.Body['Message'];
        this.messageResponse = true;
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.message }));
        }
        else {
          if (this.message == "The user is already authorized") {
            this.message = "El usuario ya está autorizado"
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.message }));
          } else if (this.message == "User Properly authorized") {
            this.message = "Usuario debidamente autorizado"
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.message }));
          } else {
            this.message = "No se pudo autorizar"
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.message }));
          }
        }

      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay mensaje' }));
      }
      this.store.dispatch(ModalActions.openAlert());
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleGettingClaimListResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['ClaimList']) {
        this.claims = webBaseEvent.Body['ClaimList'];
        this.claimsResponse = true;
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay reclamaciones existentes' }));
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleGettingFreeProfessionalsTRResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['FreeProfessionalList']) {
        var usersFreeProfessionalsTR = webBaseEvent.Body['OsdUserList'];
        var freeProfessionalsTR = webBaseEvent.Body['FreeProfessionalList'];
        console.log(usersFreeProfessionalsTR)
        if (usersFreeProfessionalsTR.length > 0) {
          this.freeProfessionalsTRResponse = true;
          this.osdDataService.emitFreeProfessionalTR(freeProfessionalsTR)
          this.osdDataService.emitUsersFreeProfessionalTR(usersFreeProfessionalsTR)
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'No hay tramitdores autorizados' }));
          this.store.dispatch(ModalActions.openAlert());
        }
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleAssignFreeProfessionalsTRToClaimsResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['AssignationClaimToFreeProfessionalId']) {
        let message = webBaseEvent.Body['AssignationClaimToFreeProfessionalId'];

        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Se asigno correctamente a la reclamación" }));
        }
        this.store.dispatch(ModalActions.openAlert());
        this.securityDataService.emitUserAuthenticationSuccess("/functions/assign-pltr-claims")
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public GetSubscribers() {
    const createGetSubscribersEvent: WebBaseEvent = this.eventFactoryService.CreateGetSubscribers();
    this.restApiService.SendOSDEvent(createGetSubscribersEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGetSubscriberResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
    // this.websocketService.sendOSDEvent(createPerformanceEvent);
  }

  public createClaimantAndClaimsCustomerPerformance(performance: ClaimantAndClaimsCustomerPerformance, claimId: string) {
    const createClaimantAndClaimsCustomerPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreateClaimantAndClaimsCustomerPerformance(performance, claimId);
    this.restApiService.SendOSDEvent(createClaimantAndClaimsCustomerPerformanceEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreatePerformanceResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public modifiedClaimantAndClaimsCustomerPerformance(performance: ClaimantAndClaimsCustomerPerformance, performanceId: string) {
    const modifiedPerformanceClaimEvent: WebBaseEvent = this.eventFactoryService.modifiedClaimantAndClaimsCustomerPerformance(performance, performanceId);
    this.restApiService.SendOSDEvent(modifiedPerformanceClaimEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifiedPerformanceClaimResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public createClaimsProcessorPerformance(performance: ClaimsProcessorPerformance, claimId: string) {
    const createClaimsProcessorPerformanceEvent: WebBaseEvent = this.eventFactoryService.createClaimsProcessorPerformance(performance, claimId);
    this.restApiService.SendOSDEvent(createClaimsProcessorPerformanceEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreatePerformanceResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public modifiedClaimsProcessorPerformance(performance: ClaimsProcessorPerformance, performanceId: string) {
    const modifiedClaimsProcessorPerformanceEvent: WebBaseEvent = this.eventFactoryService.modifiedClaimsProcessorPerformance(performance, performanceId);
    this.restApiService.SendOSDEvent(modifiedClaimsProcessorPerformanceEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifiedPerformanceClaimResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public createProject(projectForm: CreateProjectEvent) {
    const createProjectEvent: WebBaseEvent = this.eventFactoryService.CreateProjectEvent(projectForm);
    this.restApiService.SendOSDEvent(createProjectEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreateProjectResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetProjects() {
    const createGetProjectsEvent: WebBaseEvent = this.eventFactoryService.CreateGetProjectsEvent();
    this.restApiService.SendOSDEvent(createGetProjectsEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreateGetProjectsResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetSummaryTypes() {
    const createGetSummaryTypesEvent: WebBaseEvent = this.eventFactoryService.CreateGetSummaryTypes();
    this.restApiService.SendOSDEvent(createGetSummaryTypesEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreateGetSummaryTypesResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetUnassignedSubscribers() {
    const CreateGetUnassignedSubscribersEvent: WebBaseEvent = this.eventFactoryService.CreateGetUnassignedSubscribers();
    this.restApiService.SendOSDEvent(CreateGetUnassignedSubscribersEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreateGetUnassignedSubscribersResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public GetProfessionalFreeTrainers() {
    const CreateGetProfessionalFreeTrainersEvent: WebBaseEvent = this.eventFactoryService.CreateGetProfessionalFreeTrainers();
    this.restApiService.SendOSDEvent(CreateGetProfessionalFreeTrainersEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCreateGetProfessionalFreeTrainersResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public assignTrainerToSubscriber(subscriberId: string, trainerId: string) {
    const CreateAssignTrainerToSubscriberEvent: WebBaseEvent = this.eventFactoryService.CreateAssignTrainerToSubscriber(subscriberId, trainerId);
    this.restApiService.SendOSDEvent(CreateAssignTrainerToSubscriberEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAssignTrainerToSubscriberResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public HandleAddPerformanceBuyResponse(webBaseEvent: WebBaseEvent) {
    try {
      var actionGetOsdUsersSusbscriberResultMessage = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (actionGetOsdUsersSusbscriberResultMessage != null) {

        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: actionGetOsdUsersSusbscriberResultMessage }));
        } else {
          if (actionGetOsdUsersSusbscriberResultMessage == "Was Successfully Created") {
            actionGetOsdUsersSusbscriberResultMessage = "Actuación creada correctamente"
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: actionGetOsdUsersSusbscriberResultMessage }));
          }
        }
        this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
        this.store.dispatch(ModalActions.openAlert())
      }

    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleModifyPerformanceBuyResponse(webBaseEvent: WebBaseEvent) {
    try {
      var actionGetOsdUsersSusbscriberResultMessage = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (actionGetOsdUsersSusbscriberResultMessage != null) {

        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: actionGetOsdUsersSusbscriberResultMessage }));
        } else {
          if (actionGetOsdUsersSusbscriberResultMessage == "Was Successfully Modified") {
            actionGetOsdUsersSusbscriberResultMessage = "Actuación modificada correctamente"
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: actionGetOsdUsersSusbscriberResultMessage }));
          }
        }
        this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
        this.store.dispatch(ModalActions.openAlert())
      }

    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleGetSubscriberResponse(webBaseEvent: WebBaseEvent) {
    try {
      var actionGetOsdUsersSusbscriberResultMessage = webBaseEvent.getBodyProperty(EventConstants.LIST_OSD_USERS_SUBSCRIBERS);
      if (actionGetOsdUsersSusbscriberResultMessage != null) {
        var actionGetSusbscribersResultMessage = webBaseEvent.getBodyProperty(EventConstants.LIST_SUBSCRIBERS);
        const osdUsersSubscribersModels = actionGetOsdUsersSusbscriberResultMessage;
        const subscribersModels = actionGetSusbscribersResultMessage;
        this.osdDataService.emitGetOsdUsersSubscribersSuccess(osdUsersSubscribersModels);
        this.osdDataService.emitGetSubscribersSuccess(subscribersModels);
      }

    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleGetPerformancesProjectManagerByIdResponse(webBaseEvent: WebBaseEvent) {
    try {
      var performancesFreeProfessionals = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_FREE_PROFESSIONAL_LIST);
      var performancesBuy = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_BUY_LIST);
      if (performancesFreeProfessionals != null && performancesBuy != null) {
        const performancesFreeProfessionalsModels = performancesFreeProfessionals;
        const performancesBuyModels = performancesBuy;

        console.log(performancesBuyModels)
        this.osdDataService.emitPerformanceFreeProfessionalList(performancesFreeProfessionalsModels);
        this.osdDataService.emitPerformanceBuyList(performancesBuyModels);
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public GetTransparencyReportsSubscriberClientsResponse(webBaseEvent: WebBaseEvent) {
    try {
      var institutionsNames = webBaseEvent.getBodyProperty(EventConstants.INSTITUTIONS_NAMES);
      var claimsAmount = webBaseEvent.getBodyProperty(EventConstants.CLAIMS_AMOUNT);
      var compensationObtainedByClaimant = webBaseEvent.getBodyProperty(EventConstants.COMPENASTION_OBTAINED_BY_CLAIMANT);
      var savingsImprovement = webBaseEvent.getBodyProperty(EventConstants.SAVINGS_IMPROVEMENT);
      var claimantsRating = webBaseEvent.getBodyProperty(EventConstants.CLAIMANTS_RATING);
      var claimedRating = webBaseEvent.getBodyProperty(EventConstants.CLAIMED_RATING);
      var osdRating = webBaseEvent.getBodyProperty(EventConstants.OSD_RATING);


      if (institutionsNames != null && claimsAmount != null && compensationObtainedByClaimant != null && savingsImprovement != null && claimantsRating != null && claimedRating != null && osdRating != null) {
        this.osdDataService.emitInstitutionsNames(institutionsNames);
        this.osdDataService.emitClaimsAmount(claimsAmount);
        this.osdDataService.emitCompensationObtainedByClaimant(compensationObtainedByClaimant);
        this.osdDataService.emitSavingsImprovement(savingsImprovement);
        this.osdDataService.emitClaimantsRating(claimantsRating);
        this.osdDataService.emitClaimedRating(claimedRating);
        this.osdDataService.emitOsdRating(osdRating);
      }

    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleModifyUserInformationResponse(webBaseEvent: WebBaseEvent) {
    try {
      var Message = webBaseEvent.getBodyProperty(EventConstants.MESSAGE);
      if (Message != null) {
        if (this.translate.currentLang == "en") {
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: Message }));
        } else {
          Message = "Se modifico correctamente la informacion del usuario (Vuelve a iniciar session para visualizar los cambios)";
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: Message }));
      }
      }
      this.store.dispatch(ModalActions.openAlert());
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }
  
  public GetTransparencyReportsIncomeExpensesResponse(webBaseEvent: WebBaseEvent) {
    try {
      var totalOsdExpenses = webBaseEvent.getBodyProperty(EventConstants.TOTAL_OSD_EXPENSES);
      var compensationOfClaimant = webBaseEvent.getBodyProperty(EventConstants.COMPENSATION_OF_CLAIMANT);
      var totalOsdIncomes = webBaseEvent.getBodyProperty(EventConstants.TOTAL_OSD_INCOMES);

      var DT_Expenses = webBaseEvent.getBodyProperty(EventConstants.TECHNICAL_DIRECTOR_EXPENSES);
      var TC_Expenses = webBaseEvent.getBodyProperty(EventConstants.ACCOUNTING_TECHNITIAN_EXPENSES);
      var TM_Expenses = webBaseEvent.getBodyProperty(EventConstants.MARKETING_TECHNITIAN_EXPENSES);
      var TS_Expenses = webBaseEvent.getBodyProperty(EventConstants.SAC_TECHNITIAN_EXPENSES);
      var IN_Expenses = webBaseEvent.getBodyProperty(EventConstants.SYSTEM_ENGINEER_EXPENSES);

      if (totalOsdExpenses != null && compensationOfClaimant != null && totalOsdIncomes != null) {
        this.osdDataService.emitTotalOsdExpenses(totalOsdExpenses);
        this.osdDataService.emitCompensationOfClaimant(compensationOfClaimant);
        this.osdDataService.emitTotalOsdIncomes(totalOsdIncomes);

        this.osdDataService.emitDT_Expenses(DT_Expenses);
        this.osdDataService.emitTC_Expenses(TC_Expenses);
        this.osdDataService.emitTM_Expenses(TM_Expenses);
        this.osdDataService.emitTS_Expenses(TS_Expenses);
        this.osdDataService.emitIN_Expenses(IN_Expenses);
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }
  public GET_TRANSPARENCY_FREE_PROFESSIONALS_RESPONSE(webBaseEvent: WebBaseEvent) {
    try {
      var fpFullNames = webBaseEvent.getBodyProperty(EventConstants.FP_FULL_NAMES);
      var hoursPerformances = webBaseEvent.getBodyProperty(EventConstants.HOURS_PERFORMANCES);
      var summationFiles = webBaseEvent.getBodyProperty(EventConstants.SUMMATION_FILES);
      var summationPerformances = webBaseEvent.getBodyProperty(EventConstants.SUMMATION_PERFORMANCES);
      var formationCost = webBaseEvent.getBodyProperty(EventConstants.FORMATION_COST);

      if (fpFullNames != null && hoursPerformances != null && summationFiles != null) {
        this.osdDataService.emitFpFullNames(fpFullNames);
        this.osdDataService.emitHoursPerformances(hoursPerformances);
        this.osdDataService.emitSummationFiles(summationFiles);
        this.osdDataService.emitSummationPerformances(summationPerformances);
        this.osdDataService.emitFormationCost(formationCost);
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleGetClaimsResponse(webBaseEvent: WebBaseEvent) {
    try {
      var actionGetClaimsResultMessage = webBaseEvent.getBodyProperty(EventConstants.LIST_CLAIM);
      if (actionGetClaimsResultMessage != null) {
        const menuOptionsModels = actionGetClaimsResultMessage;
        this.store.dispatch(ClaimActions.setClaims({ claims: menuOptionsModels }))
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No hay reclamaciones para mostrar" }));
      }
      this.store.dispatch(ModalActions.openAlert());
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleCreatePerformanceResponse(webBaseEvent: WebBaseEvent) {
    let createPerformanceResultMessage: string;

    try {
      createPerformanceResultMessage = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
     
      if (createPerformanceResultMessage) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: createPerformanceResultMessage }));
          this.store.dispatch(ModalActions.openAlert());
          this.securityDataService.emitUserAuthenticationSuccess("/functions/file-manager")
        }
        else {
          createPerformanceResultMessage = "La actuación se agregó correctamente.";
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "La actuación se agregó correctamente." }));
          this.store.dispatch(ModalActions.openAlert());
          this.securityDataService.emitUserAuthenticationSuccess("/functions/file-manager")
        }
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleModifiedPerformanceClaimResponse(webBaseEvent: WebBaseEvent) {
    let modifiedPerformanceResultMessage: string;

    try {
      modifiedPerformanceResultMessage = webBaseEvent.getBodyProperty(EventConstants.MODIFIED_RESULT_MESSAGE);


      if (this.translate.currentLang == "en") {
        if (modifiedPerformanceResultMessage) {

          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: modifiedPerformanceResultMessage }));
          this.store.dispatch(ModalActions.openAlert());
          this.securityDataService.emitUserAuthenticationSuccess("/functions/file-manager")
        }
      } else {
        if (modifiedPerformanceResultMessage) {
          modifiedPerformanceResultMessage = "Actuacion modificada correctamente";
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: modifiedPerformanceResultMessage }));
          this.store.dispatch(ModalActions.openAlert());
          this.securityDataService.emitUserAuthenticationSuccess("/functions/file-manager")
        }
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleAuthenticationResponse(webBaseEvent: WebBaseEvent) {
    let userAuthenticationSuccess: boolean;
    let userAuthenticationResultMessage: string;
    let sessionKey: string;
    let userInfo: UserInfo;

    try {
      userAuthenticationSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.USER_AUTHENTICATION_SUCCESS));
      userAuthenticationResultMessage = webBaseEvent.getBodyProperty(EventConstants.USER_AUTHENTICATION_RESULT_MESSAGE);

      if (userAuthenticationSuccess) {
        userInfo = webBaseEvent.getBodyProperty(EventConstants.USER_INFO);
        sessionKey = webBaseEvent.getBodyProperty(EventConstants.GENERATED_SESSION_KEY);
        // this.authenticationService.startSession(sessionKey);
        this.authenticationService.userInfo = userInfo;
        this.securityDataService.emitUserAuthenticationSuccess("/home");
        this.store.dispatch(AuthenticationActions.signIn());
      }
      else {
        if (userAuthenticationResultMessage == 'Credentials are invalid') {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Las credenciales son inválidas' }));
        }
        this.store.dispatch(ModalActions.toggleErrorModal());
      }
    } catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleAddPerformanceFreeProfessionalResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_FREE_PROFESSIONAL_MESSAGE);

      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      } else {
        if (message == "Was Successfully Created") {
          message = "Actuación creada correctamente"
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
          this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
        }
      }
      this.store.dispatch(ModalActions.openAlert())
    } catch {

    }
  }

  public HandleModifyPerformanceFreeProfessionalResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_FREE_PROFESSIONAL_MESSAGE);

      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      } else {
        if (message == "Was Successfully Modified") {
          message = "Actuación modificada correctamente"
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
          this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
        }
      }
      this.store.dispatch(ModalActions.openAlert())
    } catch {

    }
  }

  public HandleAddClaimResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.MESSAGE);
      this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      this.store.dispatch(ModalActions.openAlert())
      if (this.authenticationService.userInfo != null) {
        this.securityDataService.emitUserAuthenticationSuccess("/home");
      }
      else {
        this.securityDataService.emitUserAuthenticationSuccess("/auth");
      }
    } catch {

    }
  }

  public AddSummaryTypeResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.MESSAGE);
      this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      this.store.dispatch(ModalActions.openAlert())
      if (this.authenticationService.userInfo != null) {
        this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
      }
      else {
        this.securityDataService.emitUserAuthenticationSuccess("/auth");
      }
    } catch {

    }
  }

  public HandleRegisterUserResponse(webBaseEvent: WebBaseEvent) {
    let registerSuccess: boolean;
    let registerResultMessage: string;
    let userInfo: UserInfo;

    try {
      registerSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.REGISTER_USER_SUCCESS));
      registerResultMessage = webBaseEvent.getBodyProperty(EventConstants.REGISTER_USER_RESULT_MESSAGE);

      if (registerSuccess) {
        this.securityDataService.emitActionRegisterSuccess(registerSuccess);

        userInfo = webBaseEvent.getBodyProperty(EventConstants.USER_INFO);
        //this.authenticationService.userInfo = userInfo;

        if (registerResultMessage == 'Your account has been created.') {
          this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Tu cuenta ha sido creada.' }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: registerResultMessage }));
        }
        this.store.dispatch(ModalActions.openAlert());

      }
      else {
        if (registerResultMessage == 'An account already exists with that email.') {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Ya existe una cuenta con ese correo electrónico.' }));
        } else {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: registerResultMessage }));
        }
        this.store.dispatch(ModalActions.toggleErrorModal());
      }
      this.securityDataService.emitUserAuthenticationSuccess("/auth");
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleCreateProjectResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      this.store.dispatch(ModalActions.openAlert())

      this.securityDataService.emitUserAuthenticationSuccess("/project-manager");

    } catch {

    }
  }

  public HandleCreateGetSummaryTypesResponse(webBaseEvent: WebBaseEvent) {
    var summaryTypesPerformanceFreeProfessionalList: SummaryTypes[];
    var summaryTypesPerformanceBuyList: SummaryTypes[];

    try {
      summaryTypesPerformanceFreeProfessionalList = webBaseEvent.getBodyProperty(EventConstants.SUMMARY_TYPES_PERFORMANCE_FREEPROFESSIONAL_LIST);
      summaryTypesPerformanceBuyList = webBaseEvent.getBodyProperty(EventConstants.SUMMARY_TYPES_PERFORMANCE_BUY_LIST);

      if (summaryTypesPerformanceFreeProfessionalList.length > 0) {
        this.osdDataService.emitGetSummaryTypesPerformanceFreeProfessionalListSuccess(summaryTypesPerformanceFreeProfessionalList)
      }

      if (summaryTypesPerformanceBuyList.length > 0) {
        this.osdDataService.emitGetSummaryTypesPerformanceBuyListSuccess(summaryTypesPerformanceBuyList)
      }
      else {
        //TODO: NO SUMMARY TYPES FOUND
      }
    } catch {

    }
  }

  public HandleCreateGetProjectsResponse(webBaseEvent: WebBaseEvent) {
    var projectsList: Project[];
    try {
      projectsList = webBaseEvent.getBodyProperty(EventConstants.PROJECTS_LIST);
      if (projectsList.length > 0) {
        this.osdDataService.emitGetProjectsSuccess(projectsList)
      }
      else {
        this.store.dispatch(ModalActions.changeAlertType({ alertType: 'warning' }));
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Error" }));
        this.store.dispatch(ModalActions.openAlert())
      }
    } catch {

    }
  }

  public HandleUpdateValuationResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Éxito en la valuación" }));
      }
      this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));

      this.store.dispatch(ModalActions.openAlert())

    } catch {

    }
  }

  public HandleChangePasswordResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Se ha cambiado la contraseña correctamente" }));
      }
      this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));

      this.store.dispatch(ModalActions.openAlert())
      this.securityDataService.emitUserAuthenticationSuccess("/home");

    } catch {

    }
  }

  public HandleCreateGetUnassignedSubscribersResponse(webBaseEvent: WebBaseEvent) {
    var unassignedSubscribersList: Subscriber[];
    try {
      unassignedSubscribersList = webBaseEvent.getBodyProperty(EventConstants.UNASSIGNED_SUBSCRIBERS_LIST);
      if (unassignedSubscribersList.length > 0) {
        this.osdDataService.emitUnassignedSubscribersListSuccess(unassignedSubscribersList)
      }
      else {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No subscribers to show" }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No hay subscriptores para mostrar" }));
        }
        this.store.dispatch(ModalActions.openAlert())
      }
    } catch {

    }
  }

  public HandleCreateGetProfessionalFreeTrainersResponse(webBaseEvent: WebBaseEvent) {
    var professionalFreeTrainers: FreeProfessional[];
    try {
      professionalFreeTrainers = webBaseEvent.getBodyProperty(EventConstants.PROFESSIONAL_FREE_TRAINERS_LIST);
      if (professionalFreeTrainers.length > 0) {
        this.osdDataService.emitProfessionalFreeTrainersListSuccess(professionalFreeTrainers)
        console.log(professionalFreeTrainers)
      }
      else {
        //TODO: NOT EXISTS PROFESSIONALS FREE BUT IS NECESSARY CATCH ERRORS
      }
    } catch {

    }
  }

  public HandleCreateGetPerformanceAssignedByIdResponse(webBaseEvent: WebBaseEvent) {
    var performanceAssigned: PerformanceFreeProfessional[];
    console.log(webBaseEvent)
    try {
      performanceAssigned = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_ASSIGNED_BY_ID_LIST);
      if (performanceAssigned.length > 0) {
        this.osdDataService.emitPerformanceAssignedListSuccess(performanceAssigned)
      }
      else {
        //TODO: NOT EXISTS PROFESSIONALS FREE BUT IS NECESSARY CATCH ERRORS
      }
    } catch {

    }
  }

  public HandleAddResponseToPerformanceAssignedResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Respuesta exitosa a la actuación asignada" }));
      }

      this.store.dispatch(ModalActions.openAlert())
      this.securityDataService.emitUserAuthenticationSuccess("/project-manager/assigned-performance");

    } catch {

    }
  }

  public HandleModifyResponseToPerformanceAssignedResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.MESSAGE);
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Subactuacion modificada correctamente" }));
      }

      this.store.dispatch(ModalActions.openAlert())
      this.securityDataService.emitUserAuthenticationSuccess("/project-manager");

    } catch {

    }
  }

  public HandleValidateResponseToPerformanceAssignedResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.MESSAGE);
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Subactuacion revisada correctamente" }));
      }

      this.store.dispatch(ModalActions.openAlert())
      this.securityDataService.emitUserAuthenticationSuccess("/project-manager");

    } catch {

    }
  }

  public HandleGetSubPerformanceByIdResponse(webBaseEvent: WebBaseEvent) {
    var subPerformance: ResponseToPerformanceFreeProfessional[];
    try {
      subPerformance = webBaseEvent.getBodyProperty(EventConstants.SUB_PERFORMANCE_LIST);
      if (subPerformance) {
        console.log(subPerformance)
        this.osdDataService.emitSubPerformanceByIdListSuccess(subPerformance)
      }
      else {
        //TODO: NOT EXISTS PROFESSIONALS FREE BUT IS NECESSARY CATCH ERRORS
      }
    } catch {

    }
  }

  public HandleAssignTrainerToSubscriberResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Se asigno correctamente" }));
      }

      this.store.dispatch(ModalActions.openAlert())
      this.securityDataService.emitUserAuthenticationSuccess("/functions/assign-client-to-Trainer");

    } catch {

    }
  }

}