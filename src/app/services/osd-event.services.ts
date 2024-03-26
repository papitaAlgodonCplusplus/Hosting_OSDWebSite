import { Injectable } from '@angular/core';
import { RestAPIService } from 'src/app/services/rest-api.service';
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
import { OSDDataService } from './osd-data.service';

@Injectable({
  providedIn: 'root'
})
export class OSDService {
    //osdEventSubscriber: Subscription;

    constructor(
        private store: Store,
        private restApiService: RestAPIService, 
        private osdDataService: OSDDataService,
        private eventFactoryService: EventFactoryService,
        public authenticationService: AuthenticationService,
        public notificationService: NotificationService
    ) {

        //this.osdEventSubscriber = new Subscription();
        //this.subscribeToOSDEvents();
    }

/*    private subscribeToOSDEvents(): void {
        console.log("subscribeToOSDEvents");
        this.osdEventSubscriber = this.websocketService.osdEventHandler.subscribe((webBaseEvent: WebBaseEvent) =>
            this.processOSDEvent(webBaseEvent));
    }*/

    public userLogin(loginForm: UserLoginEvent) {
      const userLoginEvent: WebBaseEvent = this.eventFactoryService.CreateUserLoginEvent(loginForm);
      this.restApiService.SendOSDEvent(userLoginEvent).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonToWebBaseEvent(response);
          this.HandleAuthenticationResponse(osdEvent);
        },
        error: (error) => {
          //TODO: Pending implementation
        }
      });   
    }
  
    public userRegister(accountForm: RegisterUserEvent, personalForm: RegisterUserEvent, accountType: string) {
        const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterUserEvent(accountForm, personalForm, accountType);
        console.log("Enviando mensaje al restAPIService.sendOSDEvent");
        this.restApiService.SendOSDEvent(registerUserEvent).subscribe({
          next: (response) => {
            var osdEvent = this.eventFactoryService.ConvertJsonToWebBaseEvent(response);
            this.HandleRegisterUserResponse(osdEvent);
          },
          error: (error) => {
            //TODO: Pending implementation
          }
        });
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
            default:
                {
                    //TODO: Send event warning to web socket or local log file
                    break;
                }
        }
    }

    public HandleAuthenticationResponse(webBaseEvent: WebBaseEvent) {
      let userAuthenticationSuccess: boolean;
      let userAuthenticationResultMessage: string;
      let sessionKey: string;
      
      try {
        userAuthenticationSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.USER_AUTHENTICATION_SUCCESS));
        userAuthenticationResultMessage = webBaseEvent.getBodyProperty(EventConstants.USER_AUTHENTICATION_RESULT_MESSAGE);
  
        if (userAuthenticationSuccess) {
          this.osdDataService.emitUserAuthenticationSuccess("/home");
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
    
          this.osdDataService.emitActionRegisterSuccess(registerSuccess);
    
          if (registerSuccess) {
    
            this.osdDataService.emitUserAuthenticationSuccess("/home");
    
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
            this.store.dispatch(ModalActions.toggleErrorModal());
          }
        }
        catch (err) {
          //TODO: create exception event and send to local file or core
        }
      }
    

}