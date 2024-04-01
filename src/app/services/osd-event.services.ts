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


@Injectable({
  providedIn: 'root'
})
export class OSDService {
    osdEventSubscriber: Subscription;
    freeProfessionals: any[] = [];
    freeProfessionalsResponse: boolean = false;
    message: string = "";
    messageResponse: boolean = false;
    
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

    cleanFreeProfessionalsList(){
      this.freeProfessionals = []
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

    public changingUsdUserAutorizationStatusEvent(selectedUser: any) {
      const changingUsdUserAutorizationStatusEvent: WebBaseEvent = this.eventFactoryService.CreateChangingUsdUserAutorizationStatusEvent(selectedUser);
      this.websocketService.sendOSDEvent(changingUsdUserAutorizationStatusEvent);
    }

    public gettingFreeProfessionalsData() {
      const gettingFreeProfesionalsEvent: WebBaseEvent = this.eventFactoryService.CreateGettingFreeProfessionalsDataEvent();
      this.websocketService.sendOSDEvent(gettingFreeProfesionalsEvent);
    }

    private subscribeToOSDEvents(): void {
        this.osdEventSubscriber = this.websocketService.osdEventHandler.subscribe((webBaseEvent: WebBaseEvent) =>
            this.processOSDEvent(webBaseEvent));
    }

    public userLogin(loginForm: UserLoginEvent) {
      const userLoginEvent: WebBaseEvent = this.eventFactoryService.CreateUserLoginEvent(loginForm);
      this.websocketService.sendOSDEvent(userLoginEvent);
    }
  
    public userRegister(accountForm: RegisterUserEvent, personalForm: RegisterUserEvent, accountType: string) {
        const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterUserEvent(accountForm, personalForm, accountType);
        this.websocketService.sendOSDEvent(registerUserEvent);
    }

    public GetSubscribers() {
      const createPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreateGetSubscribers();
      this.websocketService.sendOSDEvent(createPerformanceEvent);
    }

  private processOSDEvent(osdEvent: WebBaseEvent) {
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
      case EventAction.HANDLE_GET_FREE_PROFESSIONALS_RESPONSE:
        {
          this.HandleGettingFreeProfessionalsListResponse(osdEvent);
          break;
        }
        case EventAction.HANDLE_CHANGING_OSD_USER_AUTORIZATION_STATUS_RESPONSE:
          {
            console.log('Recupera el mensaje de respuesta para confirmar el autorizar:')
            console.log(osdEvent);
            this.HandleChangingOsdUserAutorizationResponse(osdEvent);
            break;
          }
      default:
        {
          //TODO: Send event warning to web socket or local log file
          break;
        }
    }
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
        this.store.dispatch(ModalActions.addAlertMessage({alertMessage: this.message}));
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay mensaje' }));
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