import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestAPIService } from 'src/app/services/rest-api.service';
import { EventFactoryService } from './event-factory.service';
import { UserLoginEvent } from '../auth/interfaces/login.interface';
import { WebBaseEvent } from '../models/webBaseEvent';
import { AuthenticationService } from './authentication.service';
import { EventConstants } from '../models/eventConstants';
import { ModalActions, AuthenticationActions, ClaimActions, UiActions } from '../store/actions';
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
import { ClaimsTrainerPerformance } from '../functions/models/ClaimsTrainerPerformance';
import { CloseClaimFileEvent } from '../functions/models/CloseClaimFileEvent';
import { claim } from '../store/selectors/claim.selectors';

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

  logEvent(logData: any): Observable<any> {
    const logEvent: WebBaseEvent = this.eventFactoryService.CreateLogEvent(logData);
    return this.restApiService.SendOSDEvent(logEvent);
  }

  cleanClaimList() {
    this.claims = []
    this.claimsResponse = false;
  }

  cleanFreeProfessionalsList() {
    this.freeProfessionals = []
    this.freeProfessionalsResponse = false;
  }

  public sendClaimReadyEmailToUser(UserId: string): Observable<any> {
    const event: WebBaseEvent = this.eventFactoryService.CreateSendClaimReadyEmailToUserEvent(UserId);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(event).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public deletePerformance(performanceId: string): Observable<any> {
    const deletePerformanceEvent: WebBaseEvent = this.eventFactoryService.CreateDeletePerformanceEvent(performanceId);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(deletePerformanceEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public deleteClaim(claimId: string): Observable<any> {
    const deleteClaimEvent: WebBaseEvent = this.eventFactoryService.CreateDeleteClaimEvent(claimId);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(deleteClaimEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getServiceRequests(): Observable<any> {
    const getServiceRequestsEvent: WebBaseEvent = this.eventFactoryService.CreateGetServiceRequestsEvent();
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(getServiceRequestsEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public deleteProject(projectId: string): Observable<any> {
    const deleteProjectEvent: WebBaseEvent = this.eventFactoryService.CreateDeleteProjectEvent(projectId);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(deleteProjectEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getFreeProfessionals(): Observable<FreeProfessional[]> {
    const getFreeProfessionalsEvent: WebBaseEvent = this.eventFactoryService.CreateGetFreeProfessionalsEvent();
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(getFreeProfessionalsEvent).subscribe({
        next: (response) => {
          const freeProfessionals = response.Body?.['ListFreeProfessionals'] || [];
          observer.next(freeProfessionals);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getMyAssignedProcessors(userId: string): Observable<any> {
    const getMyAssignedProcessorsEvent: WebBaseEvent = this.eventFactoryService.CreateGetMyAssignedProcessorsEvent(userId);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(getMyAssignedProcessorsEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getClaims(): Observable<any> {
    const getClaimsEvent: WebBaseEvent = this.eventFactoryService.CreateGetClaimsEvent();
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(getClaimsEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public sendNewPerformanceUpdateToEveryone(claim: any, UserId: any): Observable<any> {
    const event: WebBaseEvent = this.eventFactoryService.CreateSendNewPerformanceUpdateToEveryoneEvent(claim, UserId);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(event).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getOperatingProcessors(): Observable<any> {
    const getOperatingProcessorsEvent: WebBaseEvent = this.eventFactoryService.CreateGetOperatingProcessorsEvent();
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(getOperatingProcessorsEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
  getUserByID(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const event: WebBaseEvent = this.eventFactoryService.CreateGetUserByIdEvent(userId);
      this.restApiService.SendOSDEvent(event).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.HandleGetUserByIdResponse(osdEvent);
          resolve(osdEvent);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
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

  public changingUsdUserAutorizationStatusEvent(selectedUserId: any): Observable<any> {
    const autorizationOsdUser: WebBaseEvent = this.eventFactoryService.CreateChangingUsdUserAutorizationStatusEvent(selectedUserId);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(autorizationOsdUser).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.HandleChangingOsdUserAutorizationResponse(osdEvent);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public restoreDatabaseLog(log: any) {
    const restoreDatabaseLogEvent: WebBaseEvent = this.eventFactoryService.CreateRestoreDatabaseLogEvent(log);
    return this.restApiService.SendOSDEvent(restoreDatabaseLogEvent);
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

  public deleteUser(userId: string): Observable<any> {
    const deleteUserEvent: WebBaseEvent = this.eventFactoryService.CreateDeleteUserEvent(userId);
    return this.restApiService.SendOSDEvent(deleteUserEvent);
  }

  public userLogin(loginForm: UserLoginEvent): Observable<any> {
    const userLoginEvent: WebBaseEvent =
      this.eventFactoryService.CreateUserLoginEvent(loginForm);
    return this.restApiService.SendOSDEvent(userLoginEvent).pipe(
      map((response) => {
        const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAuthenticationResponse(osdEvent);
        return response;
      })
    );
  }

  public addFreeProfessionalToCfh(cfhId: string, email: string) {
    const addFreeProfessionalToCfhEvent: WebBaseEvent = this.eventFactoryService.CreateAddFreeProfessionalToCfhEvent(cfhId, email);
    return this.restApiService.SendOSDEvent(addFreeProfessionalToCfhEvent);
  }

  public addPerformanceFreeProfessional(performanceFP: PerformanceFreeProfessional, projectManagerSelectedId: string, documentBase64: string) {
    const event: WebBaseEvent = this.eventFactoryService.CreateAddPerformanceFreeProfessionalEvent(performanceFP, projectManagerSelectedId, documentBase64);
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

  public createPerformanceClaimTrainer(performanceTrainer: ClaimsTrainerPerformance, claimId: string, documentBase64: string) {
    const event: WebBaseEvent = this.eventFactoryService.CreateClaimTrainerEvent(performanceTrainer, claimId, documentBase64);
    this.restApiService.SendOSDEvent(event).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleAddPerformanceTrainerResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public ModifyPerformanceClaimTrainer(performanceTrainer: ClaimsTrainerPerformance, performanceId: string, documentBase64: string) {
    const event: WebBaseEvent = this.eventFactoryService.ModifyPerformanceTrainerEvent(performanceTrainer, performanceId, documentBase64);
    this.restApiService.SendOSDEvent(event).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifyPerformanceTrainerResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public userRegisterEmail(payload: any, url: string): Observable<any> {
    console.log('userRegisterEmail', payload);
    return new Observable((observer) => {
      const jsonEvent = {
        url,
        email: payload.to_email,
        Body: {
          Action: 'RegisterUserEmail',
          email: payload.to_email,
          template_id: payload.template_id,
          UserCode: payload.UserCode,
        }
      };
      this.restApiService.SendOSDEvent(jsonEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
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

  public updateClaimStates(): Observable<any> {
    const updateClaimStatesEvent: WebBaseEvent = this.eventFactoryService.CreateUpdateClaimStatesEvent();
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(updateClaimStatesEvent).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getIncomes(): Observable<any> {
    return new Observable((observer) => {
    })
  }

  public getPurchases(): Observable<any> {
    return new Observable((observer) => {
    })
  }

  public getServiceDetails(): Observable<any> {
    return new Observable((observer) => {
    })
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

  public professorRegister(accountForm: Form, personalForm: Form, accountType: string): Observable<any> {
    const registerProfessorEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterProfessorEvent(accountForm, personalForm, accountType);
    return this.restApiService.SendOSDEvent(registerProfessorEvent);
  }

  public userRegister(accountForm: Form, personalForm: Form, accountType: string): Observable<any> {
    const registerUserEvent: WebBaseEvent = this.eventFactoryService.CreateRegisterUserEvent(accountForm, personalForm, accountType);
    return this.restApiService.SendOSDEvent(registerUserEvent);
  }

  public updateClaim(updatedClaim: any): Observable<any> {
    const updateClaimEvent: WebBaseEvent = this.eventFactoryService.CreateUpdateClaimEvent(updatedClaim);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(updateClaimEvent).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.HandleUpdateClaimResponse(osdEvent);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public addClaim(claimForm: Form): Observable<any> {
    const addClaimEvent: WebBaseEvent = this.eventFactoryService.CreateAddClaimEvent(claimForm);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(addClaimEvent).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.HandleAddClaimResponse(osdEvent);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
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


  public getMyPendingClaims(userId: string): Observable<any> {
    const getMyPendingClaimsEvent: WebBaseEvent = this.eventFactoryService.CreateGetMyPendingClaimsEvent(userId);
    return new Observable((observer) => {
      console.log('Checking for pending claims...', getMyPendingClaimsEvent);
      this.restApiService.SendOSDEvent(getMyPendingClaimsEvent).subscribe({
        next: (response) => {
          console.log('Pending claims response:', response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public performanceBuy(performanceForm: PerformanceBuy, projectManagerId: string, documentBase64: string) {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreatePerformanceBuyEvent(performanceForm, projectManagerId, documentBase64);
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

  public GetHorasReport(developer?: string, category?: string) {
    const event: WebBaseEvent = this.eventFactoryService.CreateGetHorasReport(developer, category);
    return this.restApiService.SendOSDEvent(event);
  }

  public GetTransparencyReportsIncomeExpenses(subscriberId: string, country: string): Observable<any> {
    const performanceBuyEvent: WebBaseEvent = this.eventFactoryService.CreateGetTransparencyReportsIncomeExpenses(subscriberId, country);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(performanceBuyEvent).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.GetTransparencyReportsIncomeExpensesResponse(osdEvent);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public getUsers(): Observable<any> {
    const event: WebBaseEvent = this.eventFactoryService.CreateGetUsersEvent();
    return this.restApiService.SendOSDEvent(event);
  }

  public getUserActionLogs(): Observable<any> {
    const event: WebBaseEvent = this.eventFactoryService.CreateGetUserActionLogsEvent();
    return this.restApiService.SendOSDEvent(event);
  }

  public getDatabaseChangeLogs(): Observable<any> {
    const event: WebBaseEvent = this.eventFactoryService.CreateGetDatabaseChangeLogsEvent();
    return this.restApiService.SendOSDEvent(event);
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
        this.HandleChangePasswordResponse(osdEvent);
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

  getFreeProfessionalsByCfhId(cfhId: string): Observable<FreeProfessional[]> {
    return new Observable((observer) => {
      const CreateGetFreeProfessionalsByCfhIdEvent: WebBaseEvent = this.eventFactoryService.CreateGetFreeProfessionalsByCfhId(cfhId);
      this.restApiService.SendOSDEvent(CreateGetFreeProfessionalsByCfhIdEvent).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.HandleGetFreeProfessionalsByCfhIdResponse(osdEvent);
          observer.next(osdEvent.Body['FreeProfessionals']);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
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

  public CloseClaimFile(closeClaimfileForm: CloseClaimFileEvent, claimId: string, userId: any) {
    const CreateCloseClaimFileEvent: WebBaseEvent = this.eventFactoryService.CreateCloseClaimFile(closeClaimfileForm, claimId, userId);
    this.restApiService.SendOSDEvent(CreateCloseClaimFileEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleCloseClaimFileResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public HandleGetCourseByUserIdResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['course']) {
        var course = webBaseEvent.Body['course'];
        this.osdDataService.emitCourseSuccess(course)
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay curso registrado' }));
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleGetStudentsByCourseResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['ListStudents']) {
        var students = webBaseEvent.Body['ListStudents'];
        this.osdDataService.emitStudentsListSuccess(students)
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay estudiantes registrados' }));
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleUpdateUserProfileResponse(webBaseEvent: WebBaseEvent) {
    try {
      const message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (message) {
        if (this.translate.currentLang === "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "El perfil del usuario se actualizó correctamente" }));
        }
        this.store.dispatch(ModalActions.openAlert());
      }
    } catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleUpdateStudentRecordsResponse(webBaseEvent: WebBaseEvent) {
    try {
      var actionUpdateStudentRecordsResultMessage = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (actionUpdateStudentRecordsResultMessage == "Student records updated successfully") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Student records updated successfully" }));
        this.store.dispatch(ModalActions.openAlert());
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: "Error updating student records" }));
        this.store.dispatch(ModalActions.openAlert());
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleGetUserByIdResponse(webBaseEvent: WebBaseEvent) {
    try {
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['OsdUser']) {
        var osdUser = webBaseEvent.Body['OsdUser'];
        this.osdDataService.emitUserSuccess(osdUser)
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No hay usuario registrado' }));
      }
    }
    catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
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

  public GetPerformancesClaimByIdResponse(webBaseEvent: WebBaseEvent) {
    try {
      var ClaimantAndClaimsCustomerPerformanceList = webBaseEvent.Body?.["performanceClaims"]

      if (ClaimantAndClaimsCustomerPerformanceList.length > 0) {
        this.osdDataService.emitClaimantAndClaimsCustomerPerformanceList(ClaimantAndClaimsCustomerPerformanceList);
      }
      else {
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

  public updateServiceRequest(request: any): Observable<any> {
    const updateServiceRequestEvent: WebBaseEvent = this.eventFactoryService.UpdateServiceRequestEvent(request);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(updateServiceRequestEvent).subscribe({
        next: (response) => {
          return new Observable((observer) => {
            observer.next({ message: 'Service request updated successfully' });
            observer.complete();
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
  
  public createServiceRequest(request: any): Observable<any> {
    const createServiceRequestEvent: WebBaseEvent = this.eventFactoryService.CreateServiceRequestEvent(request);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(createServiceRequestEvent).subscribe({
        next: (response) => {
          return new Observable((observer) => {
            observer.next({ message: 'Service request created successfully' });
            observer.complete();
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
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
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['claims']) {
        var claims = webBaseEvent.Body['claims'];

        if (claims.length > 0) {
          this.osdDataService.emitClaimsListSuccess(claims)
        }
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
      if (webBaseEvent && webBaseEvent.Body && webBaseEvent.Body['freeProfessionals']) {
        var usersFreeProfessionalsTR = webBaseEvent.Body['users'];
        var freeProfessionalsTR = webBaseEvent.Body['freeProfessionals'];
        if (usersFreeProfessionalsTR.length > 0) {
          this.freeProfessionalsTRResponse = true;
          this.osdDataService.emitFreeProfessionalTR(freeProfessionalsTR)
          this.osdDataService.emitUsersFreeProfessionalTR(usersFreeProfessionalsTR)
        }
        else {
          if (this.translate.currentLang == "en") {
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'There are currently no registered processors for this client' }));
          }
          else {
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Actualmente no hay tramitadores registrados para este cliente' }));
          }
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

  public updatePerformanceUpdate(payload: any) {
    const updatePerformanceUpdateEvent: WebBaseEvent = this.eventFactoryService.CreateUpdatePerformanceUpdateEvent(payload);
    this.restApiService.SendOSDEvent(updatePerformanceUpdateEvent).subscribe(
      map((response) => {
        const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleUpdatePerformanceUpdateResponse(osdEvent);
        return response;
      })
    );
  }

  public addPerformanceUpdate(payload: any): Observable<any> {
    const addPerformanceUpdateEvent: WebBaseEvent = this.eventFactoryService.CreateAddPerformanceUpdateEvent(payload);
    return new Observable((observer) => {
      this.restApiService.SendOSDEvent(addPerformanceUpdateEvent).subscribe({
        next: (response) => {
          const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.HandleAddPerformanceUpdateResponse(osdEvent);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Error in addPerformanceUpdate:', error);
          observer.error(error);
        }
      });
    });
  }

  public updateProjectDetails(updatedProjectData: any): Observable<any> {
    const updateProjectDetailsEvent: WebBaseEvent = this.eventFactoryService.CreateUpdateProjectDetailsEvent(updatedProjectData);
    return this.restApiService.SendOSDEvent(updateProjectDetailsEvent).pipe(
      map((response) => {
        const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleUpdateProjectDetailsResponse(osdEvent);
        return response;
      })
    );
  }

  public getCourseByUserId(Id: string): Observable<any> {
    const getCourseByUserIdEvent: WebBaseEvent = this.eventFactoryService.CreateGetCourseByUserIdEvent(Id);
    return this.restApiService.SendOSDEvent(getCourseByUserIdEvent).pipe(
      map((response) => {
        const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGetCourseByUserIdResponse(osdEvent);
        return response;
      })
    );
  }

  public getStudentsByCourse(Id: string): Observable<any> {
    const getStudentsByCourseEvent: WebBaseEvent = this.eventFactoryService.CreateGetStudentsByCourseEvent(Id);
    return this.restApiService.SendOSDEvent(getStudentsByCourseEvent).pipe(
      map((response) => {
        const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGetStudentsByCourseResponse(osdEvent);
        return response;
      })
    );
  }

  public updateUserProfile(userId: string, userFormValue: any): Observable<any> {
    const updateUserProfileEvent: WebBaseEvent = this.eventFactoryService.CreateUpdateUserProfileEvent(userId, userFormValue);
    return this.restApiService.SendOSDEvent(updateUserProfileEvent).pipe(
      map((response) => {
        const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleUpdateUserProfileResponse(osdEvent);
        return response;
      })
    );
  }

  public deleteStudentRecord(student_name: string): Observable<any> {
    const deleteStudentRecordEvent: WebBaseEvent = this.eventFactoryService.CreateDeleteStudentRecordEvent(student_name);
    return this.restApiService.SendOSDEvent(deleteStudentRecordEvent).pipe(
      map((response) => {
        const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleDeleteStudentRecordResponse(osdEvent);
        return response;
      })
    );
  }

  public updateStudentRecords(records: any): Observable<any> {
    return new Observable((observer) => {
      if (Array.isArray(records.students) && records.students.length > 0) {
        records.students.forEach((student: any) => {
          const updateStudentRecordsEvent: WebBaseEvent = this.eventFactoryService.CreateUpdateStudentRecordsEvent(
            student.name,
            student.attendance,
            student.grade,
            student.status
          );

          this.restApiService.SendOSDEvent(updateStudentRecordsEvent).subscribe({
            next: (response) => {
              const osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
              this.HandleUpdateStudentRecordsResponse(osdEvent);
              observer.next(response);
            },
            error: (error) => {
              observer.error(error);
            }
          });
        });
        observer.complete();
      } else {
        observer.error('No student records found.');
      }
    });
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

  public createClaimantAndClaimsCustomerPerformance(performance: ClaimantAndClaimsCustomerPerformance, claimId: string, userTypePerformance: string, documentBase64: string): Observable<any> {
    return new Observable((observer) => {
      const createClaimantAndClaimsCustomerPerformanceEvent: WebBaseEvent = this.eventFactoryService.CreateClaimantAndClaimsCustomerPerformance(performance, claimId, userTypePerformance, documentBase64);
      this.restApiService.SendOSDEvent(createClaimantAndClaimsCustomerPerformanceEvent).subscribe({
        next: (response) => {
          var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
          this.HandleCreatePerformanceResponse(osdEvent);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  public modifyClaimantAndClaimsCustomerPerformance(performance: ClaimantAndClaimsCustomerPerformance, performanceId: string, documentBase64: string) {
    const modifyPerformanceClaimEvent: WebBaseEvent = this.eventFactoryService.modifyClaimantAndClaimsCustomerPerformance(performance, performanceId, documentBase64);
    this.restApiService.SendOSDEvent(modifyPerformanceClaimEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleModifiedPerformanceClaimResponse(osdEvent);
      },
      error: (error) => {
        //TODO: Pending implementation
      }
    });
  }

  public createClaimsProcessorPerformance(performance: ClaimsProcessorPerformance, claimId: string, documentBytes: string) {
    const createClaimsProcessorPerformanceEvent: WebBaseEvent = this.eventFactoryService.createClaimsProcessorPerformance(performance, claimId, documentBytes);
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

  public modifiedClaimsProcessorPerformance(performance: ClaimsProcessorPerformance, performanceId: string, documentBase64: string) {
    const modifiedClaimsProcessorPerformanceEvent: WebBaseEvent = this.eventFactoryService.modifiedClaimsProcessorPerformance(performance, performanceId, documentBase64);
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
      this.store.dispatch(UiActions.toggleConfirmationButton())
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
      var actionGetOsdUsersSusbscriberResultMessage = webBaseEvent.Body?.["subscribers"];
      if (actionGetOsdUsersSusbscriberResultMessage != null) {
        var actionGetSusbscribersResultMessage = webBaseEvent.getBodyProperty(EventConstants.LIST_SUBSCRIBERS);
        const osdUsersSubscribersModels = actionGetOsdUsersSusbscriberResultMessage;
        const subscribersModels = actionGetSusbscribersResultMessage;
        console.log(osdUsersSubscribersModels, subscribersModels);
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
      var TransparencyReportsSubscriberClientList = webBaseEvent.getBodyProperty("claims");

      if (TransparencyReportsSubscriberClientList.length > 0) {
        this.osdDataService.emitTransparencyReportsSubscriberClientList(TransparencyReportsSubscriberClientList);
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
      var totalOsdIncomeExpenses = webBaseEvent.getBodyProperty("economicResultReportDTO");

      if (totalOsdIncomeExpenses != null) {
        this.osdDataService.emitTotalOsdIncomeExpenses(totalOsdIncomeExpenses);
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
      if (message != "") {
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
      }
      this.store.dispatch(UiActions.toggleConfirmationButton())
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

  public HandleAddPerformanceTrainerResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);

      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      } else {
        if (message == "The performance was added correctly") {
          message = "La actuación se agregó correctamente."
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
          this.securityDataService.emitUserAuthenticationSuccess("/functions/file-manager");
        }
      }
      this.store.dispatch(ModalActions.openAlert())
    } catch {

    }
  }

  public HandleModifyPerformanceTrainerResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);

      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      } else {
        if (message == "The performance was modified correctly") {
          message = "La actuación se modificó correctamente."
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
          this.securityDataService.emitUserAuthenticationSuccess("/functions/file-manager");
        }
      }
      this.store.dispatch(ModalActions.openAlert())
    } catch {

    }
  }

  public HandleUpdateClaimResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);

      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      } else {
        if (message == "The claim was updated correctly") {
          message = "El reclamo se actualizó correctamente"
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        }
      }
      this.store.dispatch(ModalActions.openAlert())
    } catch {

    }
  }

  public HandleUpdateProjectDetailsResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);

      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      } else {
        if (message == "The project was updated correctly") {
          message = "El proyecto se actualizó correctamente"
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        }
      }
      this.store.dispatch(ModalActions.openAlert())
    } catch {

    }
  }

  public HandleAddClaimResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (message != "") {

        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "El reclamo fue creado correctamente" }));
        }

        this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));
        this.store.dispatch(ModalActions.openAlert())

        if (this.authenticationService.userInfo != null) {
          this.securityDataService.emitUserAuthenticationSuccess("/home");
        }
        else {
          this.securityDataService.emitUserAuthenticationSuccess("/auth");
        }

        this.store.dispatch(UiActions.toggleConfirmationButton())
      }
    } catch {

    }
  }

  public AddSummaryTypeResponse(webBaseEvent: WebBaseEvent) {
    let message: string;

    try {
      message = webBaseEvent.getBodyProperty(EventConstants.MESSAGE);
      if (message) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "El resumen fue agregado exitosamente" }));
        }
        this.store.dispatch(ModalActions.openAlert())

        if (this.authenticationService.userInfo != null) {
          this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
        }
        else {
          this.securityDataService.emitUserAuthenticationSuccess("/auth");
        }
      }
      this.store.dispatch(UiActions.toggleConfirmationButton())
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
      this.store.dispatch(UiActions.toggleConfirmationButton())
    }
    catch (err) {
      //TODO: create exception event and send to local file or core
    }
  }

  public HandleCreateProjectResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);

      if (message) {
        this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        this.store.dispatch(ModalActions.openAlert())

        this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
      }
      this.store.dispatch(UiActions.toggleConfirmationButton())
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

  public HandleDeleteStudentRecordResponse(webBaseEvent: WebBaseEvent) {
    try {
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Success" }));
    } catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleCreateGetProjectsResponse(webBaseEvent: WebBaseEvent) {
    var projectsList: Project[];
    try {
      projectsList = webBaseEvent.Body?.[EventConstants.PROJECTS_LIST];
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

  public GetCFHReports() {
    const createCFHReportsEvent: WebBaseEvent = this.eventFactoryService.CreateGetCFHReports();
    this.restApiService.SendOSDEvent(createCFHReportsEvent).subscribe({
      next: (response) => {
        var osdEvent = this.eventFactoryService.ConvertJsonObjectToWebBaseEvent(response);
        this.HandleGetCFHReportsResponse(osdEvent);
      },
      error: (error) => {
        // TODO: Pending implementation
      }
    });
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

  public HandleGetCFHReportsResponse(webBaseEvent: WebBaseEvent) {
    try {
      const reports = webBaseEvent.getBodyProperty(EventConstants.CFH_REPORTS);
      if (reports && reports.length > 0) {
        this.osdDataService.emitCFHReportsSuccess(reports);
      } else {
        this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'No CFH reports found' }));
      }
    } catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Unexpected error occurred while fetching CFH reports' }));
    }
  }

  public HandleCreateGetProfessionalFreeTrainersResponse(webBaseEvent: WebBaseEvent) {
    var professionalFreeTrainers: FreeProfessional[];
    try {
      professionalFreeTrainers = webBaseEvent.getBodyProperty(EventConstants.PROFESSIONAL_FREE_TRAINERS_LIST);
      if (professionalFreeTrainers.length > 0) {
        this.osdDataService.emitProfessionalFreeTrainersListSuccess(professionalFreeTrainers)
      }
      else {
        //TODO: NOT EXISTS PROFESSIONALS FREE BUT IS NECESSARY CATCH ERRORS
      }
    } catch {

    }
  }

  public HandleCreateGetPerformanceAssignedByIdResponse(webBaseEvent: WebBaseEvent) {
    var performanceAssigned: PerformanceFreeProfessional[];
    try {
      performanceAssigned = webBaseEvent.Body?.["performance"];
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
      if (message) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Respuesta exitosa a la actuación asignada" }));
        }

        this.store.dispatch(ModalActions.openAlert())
        this.securityDataService.emitUserAuthenticationSuccess("/project-manager/assigned-performance");
      }
      this.store.dispatch(UiActions.toggleConfirmationButton())
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
      if (message) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Subactuacion revisada correctamente" }));
        }

        this.store.dispatch(ModalActions.openAlert())
        this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
      }
      this.store.dispatch(UiActions.toggleConfirmationButton())
    } catch {

    }
  }

  public HandleGetFreeProfessionalsByCfhIdResponse(webBaseEvent: WebBaseEvent) {
    var freeProfessionals: FreeProfessional[];
    try {
      freeProfessionals = webBaseEvent.Body?.["freeProfessionals"];
      if (freeProfessionals) {
        this.osdDataService.emitFreeProfessionalsByCfhIdListSuccess(freeProfessionals)
      }
      else {
        // TODO: NOT EXISTS PROFESSIONALS FREE BUT IS NECESSARY CATCH ERRORS
      }
    }
    catch {
    }
  }

  public HandleUpdatePerformanceUpdateResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (message) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Actualización de rendimiento actualizada correctamente" }));
        }
        this.store.dispatch(ModalActions.openAlert());
        this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
      }
      this.store.dispatch(UiActions.toggleConfirmationButton());
    } catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleAddPerformanceUpdateResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (message) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Actualización de rendimiento agregada correctamente" }));
        }
        this.store.dispatch(ModalActions.openAlert());
        this.securityDataService.emitUserAuthenticationSuccess("/project-manager");
      }
      this.store.dispatch(UiActions.toggleConfirmationButton());
    } catch (err) {
      this.store.dispatch(ModalActions.addErrorMessage({ errorMessage: 'Error inesperado' }));
    }
  }

  public HandleGetSubPerformanceByIdResponse(webBaseEvent: WebBaseEvent) {
    var subPerformance: ResponseToPerformanceFreeProfessional[];
    try {
      subPerformance = webBaseEvent.getBodyProperty(EventConstants.SUB_PERFORMANCE_LIST);
      if (subPerformance) {
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

      if (message) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Se asigno correctamente" }));
        }

        this.store.dispatch(ModalActions.openAlert())
        this.securityDataService.emitUserAuthenticationSuccess("/functions/assign-client-to-Trainer");
      }
      this.store.dispatch(UiActions.toggleConfirmationButton())
    } catch {

    }
  }


  public HandleCloseClaimFileResponse(webBaseEvent: WebBaseEvent) {
    let message: string;
    try {
      message = webBaseEvent.getBodyProperty(EventConstants.ACTION_OSD_RESULT_MESSAGE);
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: message }));
      }
      else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "El reclamo fue completamente cerrado" }));
      }

      this.store.dispatch(ModalActions.openAlert())
      this.securityDataService.emitUserAuthenticationSuccess("/functions/claims-file");

    } catch {

    }
  }
}