import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Claim } from '../models/claim';

@Injectable({
  providedIn: 'root'
})
export class SecurityDataService {
  private actionRegisterSuccessSubject = new Subject<boolean>();
  private userAuthenticationSuccessSubject = new Subject<string>();
  private userRegisterSuccessSubject = new Subject<boolean>();
  private verifyEmailSuccessSubject = new Subject<boolean>();
  private CFHResultList = new Subject<Claim[]>();
  actionRegisterSuccess$ = this.actionRegisterSuccessSubject.asObservable();
  userRegisterSuccess$ = this.userRegisterSuccessSubject.asObservable();
  verifyEmailSuccess$ = this.verifyEmailSuccessSubject.asObservable();
  userAuthenticationSuccess$ = this.userAuthenticationSuccessSubject.asObservable();

  constructor() { }

  emitUserAuthenticationSuccess(data: string) {
    this.userAuthenticationSuccessSubject.next(data);
  }
  
  emitActionRegisterSuccess(data: boolean) {
    this.userRegisterSuccessSubject.next(data);
  }

  emitActionVerifyEmailSuccess(data: boolean) {
    this.verifyEmailSuccessSubject.next(data);
  }

  emitCFHReportsSuccess(data: Claim[]) {
    this.CFHResultList.next(data);
  }
}
