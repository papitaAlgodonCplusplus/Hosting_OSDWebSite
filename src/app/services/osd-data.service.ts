import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Claim } from '../models/claim';
import { UserInfo } from '../models/userInfo';
import { Subscriber } from '../models/subscriber';
import { PerformanceFreeProfessional } from '../project-manager/Models/performanceFreeProfessional';
import { PerformanceBuy } from '../project-manager/Models/performanceBuy';

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

  private performanceFreeProfessionalList = new Subject<PerformanceFreeProfessional[]>();
  private performanceBuyList = new Subject<PerformanceBuy[]>();

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
  freeProfessionalTR$ = this.freeProfessionalTR.asObservable();
  usersFreeProfessionalTR$ = this.usersFreeProfessionalTR.asObservable();

  InstitutionsNames$ = this.InstitutionsNames.asObservable();
  ClaimsAmount$ = this.ClaimsAmount.asObservable();
  CompensationObtainedByClaimant$ = this.CompensationObtainedByClaimant.asObservable();
  SavingsImprovement$ = this.SavingsImprovement.asObservable();
  ClaimantsRating$ = this.ClaimantsRating.asObservable();
  ClaimedRating$ = this.ClaimedRating.asObservable();
  OsdRating$ = this.OsdRating.asObservable();

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
}
