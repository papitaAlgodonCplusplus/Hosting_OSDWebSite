import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticationActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-type',
  templateUrl: './onboarding-register-type.component.html',
  styleUrls: ['./onboarding-register-type.component.css']
})
export class OnboardingRegisterTypeComponent implements OnDestroy{
  
  constructor(private store: Store){

  }
  
  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
  
  signOut(): void{
    this.store.dispatch(AuthenticationActions.signOut()) //TODO: Delete until login is implemented
  }
}
