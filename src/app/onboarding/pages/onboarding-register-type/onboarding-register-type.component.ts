import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticationActions, UiActions } from 'src/app/store/actions';
import { ModalSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-register-type',
  templateUrl: './onboarding-register-type.component.html',
  styleUrls: ['./onboarding-register-type.component.css']
})
export class OnboardingRegisterTypeComponent implements OnDestroy{
  
  errorModalOpen$: Observable<boolean> = this.store.select(ModalSelectors.errorModalOpen);
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
  
}
