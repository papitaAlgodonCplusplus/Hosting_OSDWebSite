import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { EventFactoryService } from './event-factory.service';
import { Subscription } from 'rxjs';
import { UserLoginEvent } from '../auth/interfaces/login.interface';
import { WebBaseEvent } from '../models/webBaseEvent';
import { EventAction } from '../models/eventAction';
import { AuthenticationService } from './authentication.service';
import { EventConstants } from '../models/eventConstants';
import { ModalActions, AuthenticationActions } from '../store/actions';
import { Store } from '@ngrx/store';
import { NotificationService } from './notification.service';
import { RegisterUserEvent } from '../auth/interfaces/register.interface';
import { SecurityDataService } from './security-data.service';
import { OSDDataService } from './osd-data.service';
import { EventManager } from '@angular/platform-browser';
import { tr } from 'date-fns/locale';


@Injectable({
  providedIn: 'root'
})
export class OSDService {
    osdEventSubscriber: Subscription;
    claims: any[] = [];
    usersFreeProfessionalsTR: any[] = [];
    freeProfessionalsTR: any[] = [];
    claimsResponse: boolean = false;
    freeProfessionalsTRResponse: boolean = false;

    constructor(
        private store: Store,
        private websocketService: WebsocketService,
        private osdDataService: OSDDataService,
        private securityDataService : SecurityDataService,
        private eventFactoryService: EventFactoryService,
        public authenticationService: AuthenticationService,
        public notificationService: NotificationService
    ) {

        this.osdEventSubscriber = new Subscription();
        this.subscribeToOSDEvents();
    }

    cleanClaimList(){
      this.claims = []
      this.claimsResponse = false;
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

    private subscribeToOSDEvents(): void {
        console.log("subscribeToOSDEvents");
        this.osdEventSubscriber = this.websocketService.osdEventHandler.subscribe((webBaseEvent: WebBaseEvent) =>
            this.processOSDEvent(webBaseEvent));
    }

    public userLogin(loginForm: UserLoginEvent) {
      const userLoginEvent: WebBaseEvent = this.eventFactoryService.CreateUserLoginEvent(loginForm);
      this.websocketService.sendOSDEvent(userLoginEvent);
    }

    public gettingClaimsData() {
      const gettingClaimsEvent: WebBaseEvent = this.eventFactoryService.CreateGettingClaimsDataEvent();
      this.websocketService.sendOSDEvent(gettingClaimsEvent);
    }
    public gettingFreeProfessionalsTRData() {
      const gettingFPTREvent: WebBaseEvent = this.eventFactoryService.gettingFreeProfessionalsTRData();
      this.websocketService.sendOSDEvent(gettingFPTREvent);
    }

    public assignFreeProfessionalsTRToClaim(idClaim: string, idFreeProfesionalTR: string) {
      const assignFPTRClaim: WebBaseEvent = this.eventFactoryService.assingFreeProfessionalsTRToClaim(idClaim, idFreeProfesionalTR);
      this.websocketService.sendOSDEvent(assignFPTRClaim);
    }
  
    public userRegister(accountForm: RegisterUserEvent, personalForm: RegisterUserEvent, accountType: string) {
        const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterUserEvent(accountForm, personalForm, accountType);
        console.log("Enviando mensaje al websocketService.sendOSDEvent");
        this.websocketService.sendOSDEvent(registerUserEvent);
    }

    private processOSDEvent(osdEvent: WebBaseEvent) {
      console.log("Llegue al switch");
      console.log(osdEvent)
        switch (osdEvent.Action) {
            case EventAction.HANDLE_REGISTER_USER_RESPONSE:
                {

                    this.HandleRegisterUserResponse(osdEvent);
                    break;
                }
                case EventAction.HANDLE_AUTHENTICATION_RESPONSE:
                  {
                    this.HandleAuthenticationResponse(osdEvent);
                    break;
                  } 
                case EventAction.HANDLE_GETTING_CLAIMS_RESPONSE:
                  {
                    this.HandleGettingClaimListResponse(osdEvent);
                    break;
                  }
                case EventAction.HANDLE_GETTING_FREE_PROFESSIONALS_TR_RESPONSE:
                  {
                    this.HandleGettingFreeProfessionalsTRResponse(osdEvent);
                    break;
                  }
                case EventAction.HANDLE_ASSIGN_CLAIMS_TO_FREE_PROFESSIONALS_RESPONSE:
                    {
                      this.HandleAssignFreeProfessionalsTRToClaimsResponse(osdEvent);
                      break;
                    }
            default:
                {
                    //TODO: Send event warning to web socket or local log file
                    break;
                }
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
          this.usersFreeProfessionalsTR = webBaseEvent.Body['OsdUserList'];
          this.freeProfessionalsTR = webBaseEvent.Body['FreeProfessionalList'];
          this.freeProfessionalsTRResponse = true;
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
    public HandleAuthenticationResponse(webBaseEvent: WebBaseEvent) {
      let userAuthenticationSuccess: boolean;
      let userAuthenticationResultMessage: string;
      let sessionKey: string;

      console.log(webBaseEvent)
      try {
        userAuthenticationSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.USER_AUTHENTICATION_SUCCESS));
        userAuthenticationResultMessage = webBaseEvent.getBodyProperty(EventConstants.USER_AUTHENTICATION_RESULT_MESSAGE);
  
        if (userAuthenticationSuccess) {
          console.log("Estoy registrado")
          sessionKey = webBaseEvent.getBodyProperty(EventConstants.GENERATED_SESSION_KEY);
          this.authenticationService.startSession(sessionKey);
          this.securityDataService.emitUserAuthenticationSuccess("/home");
          this.store.dispatch(AuthenticationActions.signIn());
        }
        else {
          if (userAuthenticationResultMessage == 'Credentials are invalid') {
            this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Las credenciales son inválidas' }));
          }
          this.store.dispatch(ModalActions.toggleErrorModal());
        }
      }
      catch (err) {
        //TODO: create exception event and send to local file or core
      }
    }

    public HandleRegisterUserResponse(webBaseEvent: WebBaseEvent) {
        let registerSuccess: boolean;
        let registerResultMessage: string;
        let sessionKey: string;
    
        try {
          registerSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.REGISTER_USER_SUCCESS));
          registerResultMessage = webBaseEvent.getBodyProperty(EventConstants.REGISTER_USER_RESULT_MESSAGE);
    
          this.securityDataService.emitActionRegisterSuccess(registerSuccess);

          console.log(registerSuccess);
          if (registerSuccess) {

            this.securityDataService.emitUserAuthenticationSuccess("/home");
    
            sessionKey = webBaseEvent.getBodyProperty(EventConstants.GENERATED_SESSION_KEY);
            this.authenticationService.startSession(sessionKey);
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