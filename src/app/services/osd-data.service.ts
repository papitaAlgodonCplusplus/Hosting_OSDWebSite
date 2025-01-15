import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Claim } from '../models/claim';
import { UserInfo } from '../models/userInfo';
import { PerformanceFreeProfessional } from '../project-manager/Models/performanceFreeProfessional';
import { PerformanceBuy } from '../project-manager/Models/performanceBuy';
import { Subscriber } from '../functions/models/Subscriber';
import { Project } from '../project-manager/Models/project';
import { SummaryTypes } from '../project-manager/Models/summaryTypes';
import { FreeProfessional } from '../functions/models/FreeProfessional';
import { ResponseToPerformanceFreeProfessional } from '../project-manager/Models/responseToperformanceFreeProfessional';
import { ClaimantAndClaimsCustomerPerformance } from '../functions/models/ClaimantAndClaimsCustomerPerformance';
import { ClaimsProcessorPerformance } from '../functions/models/ClaimsProcessorPerformance';
import { ClaimsTrainerPerformance } from '../functions/models/ClaimsTrainerPerformance';
import { TransparencyIncomeExpenses } from '../reports/models/TransparencyIncomeExpenses.interface';
import { TransparencyReportsSubscriberClientList } from '../reports/models/TransparencyReportsSubscriberClient.model';

@Injectable({
  providedIn: 'root'
})
export class OSDDataService {
  performanceFP: any = "";

  private actionRegisterSuccessSubject = new Subject<boolean>();
  private userAuthenticationSuccessSubject = new Subject<string>();
  private userRegisterSuccessSubject = new Subject<boolean>();
  private verifyEmailSuccessSubject = new Subject<boolean>();
  private getOsdUsersSubscribersSuccessSubject = new Subject<UserInfo[]>();
  private getSubscribersSuccessSubject = new Subject<Subscriber[]>();
  private freeProfessionalId = new Subject<string>();
  private freeProfessionalTypeId = new Subject<string>();
  private freeProfessionalTR = new Subject<any[]>();
  private usersFreeProfessionalTR = new Subject<any[]>();
  private TransparencyReportsSubscriberClientList = new Subject<TransparencyReportsSubscriberClientList[]>();

  private TransparencyIncomeExpenses = new Subject<TransparencyIncomeExpenses>();


  private FpFullNames = new Subject<string[]>();
  private HoursPerformances = new Subject<number[]>();
  private SummationFiles = new Subject<any[]>();
  private SummationPerformances = new Subject<any[]>();
  private FormationCost = new Subject<any[]>();

  private performanceFreeProfessionalList = new Subject<PerformanceFreeProfessional[]>();
  private performanceBuyList = new Subject<PerformanceBuy[]>();

  private claimantAndClaimsCustomerPerformanceList = new Subject<ClaimantAndClaimsCustomerPerformance[]>();
  private claimsProcessorPerformanceList = new Subject<ClaimsProcessorPerformance[]>();
  private claimsTrainerPerformanceList = new Subject<ClaimsTrainerPerformance[]>();
  
  private projectsList = new Subject<Project[]>();

  private summaryTypesPerformanceFreeProfessionalList = new Subject<SummaryTypes[]>();
  private summaryTypesPerformanceBuyList = new Subject<SummaryTypes[]>();

  private unassignedSubscribersList = new Subject<Subscriber[]>();

  private professioanlFreeTrainersList = new Subject<FreeProfessional[]>();

  private performanceAssignedList = new Subject<PerformanceFreeProfessional[]>();

  private SubPerformanceByIdList = new Subject<ResponseToPerformanceFreeProfessional[]>();

  private ClaimsList = new Subject<Claim[]>();

  private studentsList = new Subject<any>();

  private courseList = new Subject<any>();
  
  actionRegisterSuccess$ = this.actionRegisterSuccessSubject.asObservable();
  userRegisterSuccess$ = this.userRegisterSuccessSubject.asObservable();
  verifyEmailSuccess$ = this.verifyEmailSuccessSubject.asObservable();
  userAuthenticationSuccess$ = this.userAuthenticationSuccessSubject.asObservable();
  getOsdUsersSubscribersSuccess$ = this.getOsdUsersSubscribersSuccessSubject.asObservable();
  getSubscribersSuccess$ = this.getSubscribersSuccessSubject.asObservable();

  freeProfessionalId$ = this.freeProfessionalId.asObservable();
  freeProfessionalTypeId$ = this.freeProfessionalTypeId.asObservable();

  performanceFreeProfessionalList$ = this.performanceFreeProfessionalList.asObservable();
  performanceBuyList$ = this.performanceBuyList.asObservable();

  claimantAndClaimsCustomerPerformanceList$ = this.claimantAndClaimsCustomerPerformanceList.asObservable();
  claimsProcessorPerformanceList$ = this.claimsProcessorPerformanceList.asObservable();
  claimsTrainerPerformanceList$ = this.claimsTrainerPerformanceList.asObservable();

  freeProfessionalTR$ = this.freeProfessionalTR.asObservable();
  usersFreeProfessionalTR$ = this.usersFreeProfessionalTR.asObservable();

  TransparencyReportsSubscriberClientList$ = this.TransparencyReportsSubscriberClientList.asObservable();

  TotalOsdIncomeExpenses$ = this.TransparencyIncomeExpenses.asObservable();

  FpFullNames$ = this.FpFullNames.asObservable();
  HoursPerformances$ = this.HoursPerformances.asObservable();
  SummationFiles$ = this.SummationFiles.asObservable();
  SummationPerformances$ = this.SummationPerformances.asObservable();
  FormationCost$ = this.FormationCost.asObservable();

  ProjectsList$ = this.projectsList.asObservable();

  SummaryTypesPerformanceFreeProfessionalList$ = this.summaryTypesPerformanceFreeProfessionalList.asObservable();
  SummaryTypesPerformanceBuyList$ = this.summaryTypesPerformanceBuyList.asObservable();

  UnassignedSubscribersList$ = this.unassignedSubscribersList.asObservable();

  ProfessionalFreeTrainerList$ = this.professioanlFreeTrainersList.asObservable();

  PerformanceAssignedList$ = this.performanceAssignedList.asObservable();

  SubPerformanceByIdList$ = this.SubPerformanceByIdList.asObservable();
  
  ClaimsList$ = this.ClaimsList.asObservable();

  constructor() {
  }

  setPerformance(performance: any) {
    this.performanceFP = performance
  }

  getPerformance() {
    return this.performanceFP
  }

  emitUserAuthenticationSuccess(data: string) {
    this.userAuthenticationSuccessSubject.next(data);
  }

  emitActionRegisterSuccess(data: boolean) {
    this.userRegisterSuccessSubject.next(data);
  }

  emitActionVerifyEmailSuccess(data: boolean) {
    this.verifyEmailSuccessSubject.next(data);
  }

  emitGetOsdUsersSubscribersSuccess(data: UserInfo[]) {
    this.getOsdUsersSubscribersSuccessSubject.next(data);
  }
  emitGetSubscribersSuccess(data: Subscriber[]) {
    this.getSubscribersSuccessSubject.next(data);
  }
  emitPerformanceFreeProfessionalList(data: PerformanceFreeProfessional[]) {
    this.performanceFreeProfessionalList.next(data);
  }
  emitPerformanceBuyList(data: PerformanceBuy[]) {
    this.performanceBuyList.next(data);
  }
  emitFreeProfessionalId(data: string) {
    this.freeProfessionalId.next(data);
  }
  emitFreeProfessionalTypeId(data: string) {
    this.freeProfessionalTypeId.next(data);
  }

  emitFreeProfessionalTR(data: any[]) {
    this.freeProfessionalTR.next(data);
  }

  emitUsersFreeProfessionalTR(data: any[]) {
    this.usersFreeProfessionalTR.next(data);
  }

  emitTransparencyReportsSubscriberClientList(data: any[]) {
    this.TransparencyReportsSubscriberClientList.next(data);
  }

  emitTotalOsdIncomeExpenses(data: TransparencyIncomeExpenses) {
    this.TransparencyIncomeExpenses.next(data);
  }

  emitFpFullNames(data: string[]) {
    this.FpFullNames.next(data);
  }
  emitHoursPerformances(data: number[]) {
    this.HoursPerformances.next(data);
  }
  emitSummationFiles(data: any) {
    this.SummationFiles.next(data);
  }
  emitSummationPerformances(data: any) {
    this.SummationPerformances.next(data);
  }
  emitFormationCost(data: any) {
    this.FormationCost.next(data);
  }

  emitGetProjectsSuccess(data: Project[]) {
    this.projectsList.next(data);
  }

  emitGetSummaryTypesPerformanceFreeProfessionalListSuccess(data: SummaryTypes[]) {
    this.summaryTypesPerformanceFreeProfessionalList.next(data);
  }

  emitGetSummaryTypesPerformanceBuyListSuccess(data: SummaryTypes[]) {
    this.summaryTypesPerformanceBuyList.next(data);
  }

  emitUnassignedSubscribersListSuccess(data: Subscriber[]) {
    this.unassignedSubscribersList.next(data);
  }

  emitProfessionalFreeTrainersListSuccess(data: FreeProfessional[]) {
    this.professioanlFreeTrainersList.next(data);
  }

  emitClaimantAndClaimsCustomerPerformanceList(data: ClaimantAndClaimsCustomerPerformance[]) {
    this.claimantAndClaimsCustomerPerformanceList.next(data);
  }

  emitClaimsProcessorPerformanceList(data: ClaimsProcessorPerformance[]) {
    this.claimsProcessorPerformanceList.next(data);
  }

  emitClaimsTrainerPerformanceList(data: ClaimsTrainerPerformance[]) {
    this.claimsTrainerPerformanceList.next(data);
  }

  emitPerformanceAssignedListSuccess(data: PerformanceFreeProfessional[]) {
    this.performanceAssignedList.next(data);
  }

  emitSubPerformanceByIdListSuccess(data: ResponseToPerformanceFreeProfessional[]) {
    this.SubPerformanceByIdList.next(data);
  }

  emitClaimsListSuccess(data: Claim[]) {
    this.ClaimsList.next(data);
  }

  emitStudentsListSuccess(data: any) {
    this.studentsList.next(data);
  }

  emitCourseSuccess(data: any) {
    this.courseList.next(data);
  }
}
