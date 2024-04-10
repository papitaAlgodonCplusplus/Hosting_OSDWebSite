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
import { RegisterUserEvent } from '../auth/interfaces/register.interface';
import { SecurityDataService } from './security-data.service';
import { OSDDataService } from './osd-data.service';
import { Form } from '@angular/forms';
import { UserInfo } from '../models/userInfo';
import { PerformanceFreeProfessional } from '../project-manager/Models/performanceFreeProfessional';
import { PerformanceBuy } from '../project-manager/Models/performanceBuy';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class OSDService {
  //osdEventSubscriber: Subscription;
  claims: any[] = [];
  usersFreeProfessionalsTR: any[] = [];
  freeProfessionalsTR: any[] = [];
  claimsResponse: boolean = false;
  freeProfessionalsTRResponse: boolean = false;
  freeProfessionals: any[] = [];
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
    private translate: TranslateService
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

  getFreeProfessionalsTRList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const checkResponse = () => {
        if (this.freeProfessionalsTRResponse) {
          resolve(this.freeProfessionalsTR);
        } else {
          setTimeout(checkResponse, 1000);
        }
      };

      checkResponse();
    });
  }
  getUsersFreeProfessionalsTRList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const checkResponse = () => {
        if (this.freeProfessionalsTRResponse) {
          resolve(this.usersFreeProfessionalsTR);
        } else {
          setTimeout(checkResponse, 1000);
        }
      };

      checkResponse();
    });
  }

  /*private subscribeToOSDEvents(): void {
      console.log("subscribeToOSDEvents");
      this.osdEventSubscriber = this.websocketService.osdEventHandler.subscribe((webBaseEvent: WebBaseEvent) =>
          this.processOSDEvent(webBaseEvent));
  }*/

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
  public addPerformanceFreeProfessional(performanceFP: PerformanceFreeProfessional) {
    const event: WebBaseEvent = this.eventFactoryService.CreateAddPerformanceFreeProfessionalEvent(performanceFP);
    console.log('Se envia el evento:', event)
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

  public gettingClaimsData() {
    const gettingClaimsEvent: WebBaseEvent = this.eventFactoryService.CreateGettingClaimsDataEvent();
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

  public gettingFreeProfessionalsTRData() {
    const gettingFPTREvent: WebBaseEvent = this.eventFactoryService.gettingFreeProfessionalsTRDataEvent();
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

  public userRegister(accountForm: RegisterUserEvent, personalForm: RegisterUserEvent, accountType: string, claimantId: string) {
    const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterUserEvent(accountForm, personalForm, accountType, claimantId);
    console.log("Enviando mensaje al restAPIService.sendOSDEvent");
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
  public addClaim(claimantId: String | null, claimType: String, Subscriberclaimed: String, Serviceprovided: String, fact: String, amountClaimed: String, document1: String, document2: String) {
    const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateAddClaimEvent(claimantId, claimType, Subscriberclaimed, Serviceprovided, fact, amountClaimed, document1, document2);
    console.log("Enviando mensaje al restAPIService.sendOSDEvent");
    this.restApiService.SendOSDEvent(registerUserEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAddClaimResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public performanceBuy(performanceForm: PerformanceBuy) {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreatePerformanceBuyEvent(performanceForm);
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

  public getPerformanceList() {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreateGetPerformancesList();
    console.log(performanceBuyEvent)
    this.restApiService.SendOSDEvent(performanceBuyEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGetPerformancesResponse(osdEvent);
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

  public HandleChangingOsdUserAutorizationResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['Message']) {
        this.message = webBaseEvent.Body['Message'];
        this.messageResponse = true;
        if(this.translate.currentLang == "en"){
          this.store.dispatch(ModalActions.addAlertMessage({alertMessage: this.message}));
        }
        else{
          if(this.message == "The user is already authorized"){
            this.message = "El usuario ya está autorizado"
            this.store.dispatch(ModalActions.addAlertMessage({alertMessage: this.message}));
          }else if(this.message == "User Properly authorized"){
            this.message = "Usuario debidamente autorizado"
            this.store.dispatch(ModalActions.addAlertMessage({alertMessage: this.message}));
          }else{
            this.message = "No se pudo autorizar"
            this.store.dispatch(ModalActions.addAlertMessage({alertMessage: this.message}));
          }
        }
        
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay mensaje' }));
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleGettingClaimListResponse(webBaseEvent: WebBaseEvent) {
    try {
      console.log('Entra respuesta', webBaseEvent)
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
        this.usersFreeProfessionalsTR = webBaseEvent.Body['OsdUserList'];
        this.freeProfessionalsTR = webBaseEvent.Body['FreeProfessionalList'];
        this.freeProfessionalsTRResponse = true;
        console.log('FR')
        console.log(this.freeProfessionalsTR)
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay reclamaciones existentes' }));
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
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay reclamaciones existentes' }));
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

  public createPerformance(performance: Form, claimId: string) {
    const createPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreatePerformanceEvent(performance, claimId);
    //this.websocketService.sendOSDEvent(createPerformanceEvent);
  }

  public GetClaims() {
    const createPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreateGetClaims();
    //this.websocketService.sendOSDEvent(createPerformanceEvent);
  }

  public HandleAddPerformanceBuyResponse(webBaseEvent: WebBaseEvent) {
    try {
      console.log("llegue bien");
      var actionGetOsdUsersSusbscriberResultMessage = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (actionGetOsdUsersSusbscriberResultMessage != null) {
          this.store.dispatch(ModalActions.addAlertMessage({alertMessage: actionGetOsdUsersSusbscriberResultMessage}))
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

  public HandleGetPerformancesResponse(webBaseEvent: WebBaseEvent) {
    try {
      console.log('Lista de performances Recuperadas:', webBaseEvent)
      var performancesFreeProfessionals = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_FREE_PROFESSIONAL_LIST);

      if (performancesFreeProfessionals != null) {
        var performancesBuy = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_BUY_LIST);
        const performancesFreeProfessionalsModels = performancesFreeProfessionals;
        const performancesBuyModels = performancesBuy;

        console.log('Ventas',performancesBuyModels)
        console.log('FP',performancesFreeProfessionalsModels)

        this.osdDataService.emitPerformanceFreeProfessionalList(performancesFreeProfessionalsModels);
        this.osdDataService.emitPerformanceBuyList(performancesBuyModels);
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
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: createPerformanceResultMessage }));
      this.store.dispatch(ModalActions.openAlert());
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
    } catch(err) {
        //TODO: create exception event and send to local file or core
    }
  }

  public HandleAddPerformanceFreeProfessionalResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.PERFORMANCE_FREE_PROFESSIONAL_MESSAGE);
      this.store.dispatch(ModalActions.addAlertMessage({alertMessage: message}));
      this.store.dispatch(ModalActions.openAlert())
    } catch {

    }
  }

  public HandleAddClaimResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.MESSAGE);
      this.store.dispatch(ModalActions.addAlertMessage({alertMessage: message}));
      this.store.dispatch(ModalActions.openAlert())
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

      this.securityDataService.emitActionRegisterSuccess(registerSuccess);

      if (registerSuccess) {
        userInfo = webBaseEvent.getBodyProperty(EventConstants.USER_INFO);
        this.authenticationService.userInfo = userInfo;
        this.securityDataService.emitUserAuthenticationSuccess("/home");
        this.store.dispatch(AuthenticationActions.signIn());

        if (registerResultMessage == 'Your account has been created.') {
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
        this.securityDataService.emitUserAuthenticationSuccess("/onboarding");
        this.store.dispatch(ModalActions.toggleErrorModal());
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }


}