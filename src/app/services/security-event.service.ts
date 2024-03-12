import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { SecurityDataService } from './security-data.service';
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
import { VerifyEmailEvent } from '../auth/interfaces/verify-email.interface';
import { EmailVerificationCodeResendEvent } from '../auth/interfaces/resend-email-verification-code.interface';

@Injectable({
  providedIn: 'root'
})
export class SecurityEventService {

  securityEventSubscriber: Subscription;

  constructor(
    private store: Store,
    private websocketService: WebsocketService,
    private securityDataService: SecurityDataService,
    private eventFactoryService: EventFactoryService,
    public authenticationService: AuthenticationService,
    public notificationService: NotificationService
  ) {

    this.securityEventSubscriber = new Subscription();
    this.subscribeToSecurityEvents();
  }

  private subscribeToSecurityEvents(): void {
    console.log("subscribeToSecurityEvents");
    this.securityEventSubscriber = this.websocketService.osdEventHandler.subscribe((webBaseEvent: WebBaseEvent) =>
      this.processSecurityEvent(webBaseEvent));
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

  public verifyEmail(verifyEmailForm: VerifyEmailEvent) {
    const verifyEmailEvent: WebBaseEvent = this.eventFactoryService.CreateVerifyEmailEvent(verifyEmailForm);
    this.websocketService.sendSecurityEvent(verifyEmailEvent);
  }

  public resendEmailVerificationCode(emailVerificationCodeResendForm: EmailVerificationCodeResendEvent) {
    const emailVerificationCodeResendEvent: WebBaseEvent = this.eventFactoryService.CreateEmailVerificationCodeResendEvent(emailVerificationCodeResendForm);
    this.websocketService.sendSecurityEvent(emailVerificationCodeResendEvent);
  }

  private processSecurityEvent(securityEvent: WebBaseEvent) {
    switch (securityEvent.Action) {
      case EventAction.HANDLE_CONNECTION_INITIALIZED:
        {
          this.HandleConnectionInitialized(securityEvent);
          break;
        }
      case EventAction.HANDLE_AUTHENTICATION_RESPONSE:
        {
          this.HandleAuthenticationResponse(securityEvent);
          break;
        }
      case EventAction.HANDLE_REGISTER_USER_RESPONSE:
        {

          this.HandleRegisterUserResponse(securityEvent);
          break;
        }
      case EventAction.HANDLE_VERIFY_EMAIL_RESPONSE:
        {
          this.HandleVerifyEmailResponse(securityEvent);
          break;
        }
      case EventAction.HANDLE_RESEND_EMAIL_VERIFICATION_CODE_RESPONSE:
        {
          this.HandleResendEmailVerificationCodeResponse(securityEvent);
          break;
        }
      case EventAction.NOTIFY_SESSION_TERMINATED:
        {
          this.NotifySessionExpired(securityEvent);
          break;
        }
      case EventAction.HANDLE_PASSWORD_RESET_EMAIL_RESPONSE:
        {
          this.HandlePasswordResetEmailResponse(securityEvent);
          break;
        }
      case EventAction.HANDLE_UPDATE_ACCOUNT_PASSWORD_RESPONSE:
        {
          this.HandleUpdatePasswordResponse(securityEvent);
          break;
        }
      default:
        {
          //TODO: Send event warning to web socket or local log file
          break;
        }
    }

  }

  public HandleConnectionInitialized(webBaseEvent: WebBaseEvent) {
    let sessionlessKey: string;
    try {
      sessionlessKey = webBaseEvent.SessionKey;
      this.authenticationService.initialize(sessionlessKey);
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
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

      if (registerSuccess) {

        this.securityDataService.emitUserAuthenticationSuccess("/home");

        sessionKey = webBaseEvent.getBodyProperty(EventConstants.GENERATED_SESSION_KEY);
        //this.authenticationService.startSession(sessionKey);
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

  public HandleVerifyEmailResponse(webBaseEvent: WebBaseEvent) {
    let verifyEmailSuccess: boolean;
    let verifyEmailSuccessResultMessage: string;
    let sessionKey: string;

    try {
      verifyEmailSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.VERIFY_EMAIL_SUCCESS));
      verifyEmailSuccessResultMessage = webBaseEvent.getBodyProperty(EventConstants.VERIFY_EMAIL_RESULT_MESSAGE);

      this.securityDataService.emitActionVerifyEmailSuccess(verifyEmailSuccess);

      if (verifyEmailSuccess) {

        if (verifyEmailSuccessResultMessage == 'Your email has been verified.') {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Su correo electrónico ha sido verificado.' }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: verifyEmailSuccessResultMessage }));
        }
        this.store.dispatch(ModalActions.openAlert());

      } else {
        if (verifyEmailSuccessResultMessage == 'This code has already expired.') {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No se pudo enviar el correo electrónico.' }));
        } else if (verifyEmailSuccessResultMessage == 'The code is incorrect.') {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'El código es incorrecto.' }));
        } else if (verifyEmailSuccessResultMessage == 'You will have to wait 10 minutes to enter a new code again.') {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Tendrás que esperar 10 minutos para volver a introducir un nuevo código.' }));
        }
        else {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: verifyEmailSuccessResultMessage }));
        }
        this.store.dispatch(ModalActions.toggleErrorModal());
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleResendEmailVerificationCodeResponse(webBaseEvent: WebBaseEvent) {
    let sendCodeSuccess: boolean;
    let sendCodeResultMessage: string;
    let sessionKey: string;

    try {
      sendCodeSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.EMAIL_VERIFICATION_CODE_SUCCESS));
      sendCodeResultMessage = webBaseEvent.getBodyProperty(EventConstants.EMAIL_VERIFICATION_CODE_RESULT_MESSAGE);

      if (sendCodeSuccess) {

        this.store.dispatch(AuthenticationActions.signIn());
        if (sendCodeResultMessage == 'A new code has been forwarded to your email') {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Se ha enviado un nuevo código a su correo electrónico.' }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: sendCodeResultMessage }));
        }
        this.store.dispatch(ModalActions.openAlert());

      }
      else {
        if (sendCodeResultMessage == 'Your email is already verified') {
          this.store.dispatch(ModalActions.changeAlertType({ alertType: 'warning' }))
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Tu correo electrónico ya está verificado.' }));
          this.store.dispatch(ModalActions.openAlert());
        } else if (sendCodeResultMessage == 'The email could not be sent') {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No se pudo enviar el correo electrónico.' }));
          this.store.dispatch(ModalActions.toggleErrorModal());
        } else if (sendCodeResultMessage == 'You will have to wait 10 minutes to generate a new code again.') {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Tendrás que esperar 10 minutos para generar un nuevo código.' }));
          this.store.dispatch(ModalActions.toggleErrorModal());
        } else {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: sendCodeResultMessage }));
          this.store.dispatch(ModalActions.toggleErrorModal());
        }
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public NotifySessionExpired(webBaseEvent: WebBaseEvent) {
    let expiredSessionKey: string;
    let sessionlessKey: string;

    try {
      expiredSessionKey = webBaseEvent.getBodyProperty(EventConstants.RELATED_SESSION_KEY);
      sessionlessKey = webBaseEvent.getBodyProperty(EventConstants.SESSIONLESS_KEY);

      if (expiredSessionKey == this.authenticationService.sessionKey) {
        this.authenticationService.endSession(sessionlessKey);
        this.notificationService.showNotificationToastr(EventConstants.SESSION_EXPIRED, EventConstants.INFORMATION);
      }
      else {
        //TODO: send warning event to monitoring or local log file
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandlePasswordResetEmailResponse(webBaseEvent: WebBaseEvent) {
    let mailResetTokenSuccess: boolean;
    let mailResetTokenMessage: string;

    try {
      mailResetTokenSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.MAIL_SUCCESS_RESET_TOKEN));
      mailResetTokenMessage = webBaseEvent.getBodyProperty(EventConstants.MAIL_MESSAGE_RESET_TOKEN);

      if (mailResetTokenSuccess) {
        if (mailResetTokenMessage == "Check your email, the mail was sent") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Revisa tu correo electrónico, el correo fue enviado" }));
          this.store.dispatch(ModalActions.openAlert());
        }
      }
      else {
        if (mailResetTokenMessage == "There is no user with that email") {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: "No existe un usuario con ese correo electrónico" }));
          this.store.dispatch(ModalActions.toggleErrorModal());
        }
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleUpdatePasswordResponse(webBaseEvent: WebBaseEvent) {
    let updatePasswordSuccess: boolean;
    let updatePasswordMessage: string;

    try {
      updatePasswordSuccess = JSON.parse(webBaseEvent.getBodyProperty(EventConstants.UPDATE_PASSWORD_SUCCESS));
      updatePasswordMessage = webBaseEvent.getBodyProperty(EventConstants.UPDATE_PASSWORD_MESSAGES);

      if (updatePasswordSuccess) {
        if (updatePasswordMessage == "Your password has been successfully updated") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Su contraseña se ha actualizado correctamente" }));
          this.store.dispatch(ModalActions.openAlert());
        }
      }
      else {
        if (updatePasswordMessage == "The link expired, remember that you have 30 minutes to use it") {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: "El link expiro, recuerda que tienes 30 minutos para realizar el cambio de contraseña" }));
          this.store.dispatch(ModalActions.toggleErrorModal());
        }
        else if (updatePasswordMessage == "The link has already been used") {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: "El link ya fue usado" }));
          this.store.dispatch(ModalActions.toggleErrorModal());
        }
        else if (updatePasswordMessage == "The link is incorrect") {
          this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: "El link es incorrecto" }));
          this.store.dispatch(ModalActions.toggleErrorModal());
        }
      }
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

}
