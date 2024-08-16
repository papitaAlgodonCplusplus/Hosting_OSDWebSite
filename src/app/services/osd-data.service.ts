import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Claim } from '../models/claim';
import { UserInfo } from '../models/userInfo';
import { PerformanceFreeProfessional } from '../project-manager/Models/performanceFreeProfessional';
import { PerformanceBuy } from '../project-manager/Models/performanceBuy';
import { PerformanceClaim } from '../functions/models/PerformanceClaims';
import { Subscriber } from '../functions/models/Subscriber';
import { Project } from '../project-manager/Models/project';
import { SummaryTypes } from '../project-manager/Models/summaryTypes';

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
  private InstitutionsNames = new Subject<any[]>();
  private ClaimsAmount = new Subject<any[]>();
  private CompensationObtainedByClaimant = new Subject<any[]>();
  private SavingsImprovement = new Subject<any[]>();
  private ClaimantsRating = new Subject<any[]>();
  private ClaimedRating = new Subject<any[]>();
  private OsdRating = new Subject<any[]>();
  private TotalOsdExpenses = new Subject<any>();
  private CompensationOfClaimant = new Subject<any>();
  private TotalOsdIncomes = new Subject<any>();

  private DT_Expenses = new Subject<any>();
  private TC_Expenses = new Subject<any>();
  private TM_Expenses = new Subject<any>();
  private TS_Expenses = new Subject<any>();
  private IN_Expenses = new Subject<any>();

  private FpFullNames = new Subject<string[]>();
  private HoursPerformances = new Subject<number[]>();
  private SummationFiles = new Subject<any[]>();
  private SummationPerformances = new Subject<any[]>();
  private FormationCost = new Subject<any[]>();

  private performanceFreeProfessionalList = new Subject<PerformanceFreeProfessional[]>();
  private performanceBuyList = new Subject<PerformanceBuy[]>();
  private performanceClaimList = new Subject<PerformanceClaim[]>();

  private projectsList = new Subject<Project[]>();

  private summaryTypesList = new Subject<SummaryTypes[]>();

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
  performanceClaimList$ = this.performanceClaimList.asObservable();
  freeProfessionalTR$ = this.freeProfessionalTR.asObservable();
  usersFreeProfessionalTR$ = this.usersFreeProfessionalTR.asObservable();

  InstitutionsNames$ = this.InstitutionsNames.asObservable();
  ClaimsAmount$ = this.ClaimsAmount.asObservable();
  CompensationObtainedByClaimant$ = this.CompensationObtainedByClaimant.asObservable();
  SavingsImprovement$ = this.SavingsImprovement.asObservable();
  ClaimantsRating$ = this.ClaimantsRating.asObservable();
  ClaimedRating$ = this.ClaimedRating.asObservable();
  OsdRating$ = this.OsdRating.asObservable();

  TotalOsdExpenses$ = this.TotalOsdExpenses.asObservable();
  CompensationOfClaimant$ = this.CompensationOfClaimant.asObservable();
  TotalOsdIncomes$ = this.TotalOsdIncomes.asObservable();

  DT_Expenses$ = this.DT_Expenses.asObservable();
  TC_Expenses$ = this.TC_Expenses.asObservable();
  TM_Expenses$ = this.TM_Expenses.asObservable();
  TS_Expenses$ = this.TS_Expenses.asObservable();
  IN_Expenses$ = this.IN_Expenses.asObservable();

  FpFullNames$ = this.FpFullNames.asObservable();
  HoursPerformances$ = this.HoursPerformances.asObservable();
  SummationFiles$ = this.SummationFiles.asObservable();
  SummationPerformances$ = this.SummationPerformances.asObservable();
  FormationCost$ = this.FormationCost.asObservable();

  ProjectsList$ = this.projectsList.asObservable();

  SummaryTypesList$ = this.summaryTypesList.asObservable();

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
  emitPerformanceClaimList(data: PerformanceClaim[]) {
    this.performanceClaimList.next(data);
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

  emitInstitutionsNames(data: any[]) {
    this.InstitutionsNames.next(data);
  }
  emitClaimsAmount(data: any[]) {
    this.ClaimsAmount.next(data);
  }
  emitCompensationObtainedByClaimant(data: any[]) {
    this.CompensationObtainedByClaimant.next(data);
  }
  emitSavingsImprovement(data: any[]) {
    this.SavingsImprovement.next(data);
  }
  emitClaimantsRating(data: any[]) {
    this.ClaimantsRating.next(data);
  }
  emitClaimedRating(data: any[]) {
    this.ClaimedRating.next(data);
  }
  emitOsdRating(data: any[]) {
    this.OsdRating.next(data);
  }
  emitTotalOsdExpenses(data: any) {
    this.TotalOsdExpenses.next(data);
  }
  emitCompensationOfClaimant(data: any) {
    this.CompensationOfClaimant.next(data);
  }
  emitTotalOsdIncomes(data: any) {
    this.TotalOsdIncomes.next(data);
  }
  emitDT_Expenses(data: any) {
    this.DT_Expenses.next(data);
  }
  emitTC_Expenses(data: any) {
    this.TC_Expenses.next(data);
  }
  emitTM_Expenses(data: any) {
    this.TM_Expenses.next(data);
  }
  emitTS_Expenses(data: any) {
    this.TS_Expenses.next(data);
  }
  emitIN_Expenses(data: any) {
    this.IN_Expenses.next(data);
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

  emitGetSummaryTypesListSuccess(data: SummaryTypes[]) {
   this.summaryTypesList.next(data);
  }
}
