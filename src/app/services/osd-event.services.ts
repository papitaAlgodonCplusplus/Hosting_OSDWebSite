import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { EventFactoryService } from './event-factory.service';
import { Subscription } from 'rxjs';
import { UserLoginEvent } from '../auth/interfaces/login.interface';
import { WebBaseEvent } from '../models/webBaseEvent';
import { EventAction } from '../models/eventAction';
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
import { Claim } from '../models/claim';


@Injectable({
  providedIn: 'root'
})
export class OSDService {
  osdEventSubscriber: Subscription;

  constructor(
    private store: Store,
    private websocketService: WebsocketService,
    private osdDataService: OSDDataService,
    private securityDataService: SecurityDataService,
    private eventFactoryService: EventFactoryService,
    public authenticationService: AuthenticationService,
    public notificationService: NotificationService
  ) {

    this.osdEventSubscriber = new Subscription();
    this.subscribeToOSDEvents();
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

  public userRegister(accountForm: RegisterUserEvent, personalForm: RegisterUserEvent, accountType: string) {
    const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterUserEvent(accountForm, personalForm, accountType);
    console.log("Enviando mensaje al websocketService.sendOSDEvent");
    this.websocketService.sendOSDEvent(registerUserEvent);
  }

  public createPerformance(performance: Form, claimId: string) {
    const createPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreatePerformanceEvent(performance, claimId);
    this.websocketService.sendOSDEvent(createPerformanceEvent);
  }

  public GetClaims() {
    const createPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreateGetClaims();
    this.websocketService.sendOSDEvent(createPerformanceEvent);
  }

 public GetSubscribers() {
    const createPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreateGetSubscribers();
    this.websocketService.sendOSDEvent(createPerformanceEvent);
  }

  private processOSDEvent(osdEvent: WebBaseEvent) {
    console.log("Llegue al switch");
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
      case EventAction.HANDLE_CREATE_PERFORMANCE_RESPONSE:
        {
          this.HandleCreatePerformanceResponse(osdEvent);
          break;
        }
      case EventAction.HANDLE_GET_CLAIMS_RESPONSE:
        {
          this.HandleGetClaimsResponse(osdEvent);
          break;
        }
        case EventAction.HANDLE_GET_SUBSCRIBERS_RESPONSE:
        {
          this.HandleGetSubscriberResponse(osdEvent);
          break;
        }
      default:
        {
          //TODO: Send event warning to web socket or local log file
          break;
        }
    }
  }

  public HandleGetSubscriberResponse(webBaseEvent: WebBaseEvent) {
    try {
      var actionGetSusbscriberResultMessage = webBaseEvent.getBodyProperty(EventConstants.LIST_SUBSCRIBER);
      if (actionGetSusbscriberResultMessage != null) {
        const subscriberModels = actionGetSusbscriberResultMessage;
        console.log(subscriberModels)
        this.osdDataService.emitGetSubscribersSuccess(subscriberModels);
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No hay subscriptores para mostrar" }));
      }
      this.store.dispatch(ModalActions.openAlert());
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