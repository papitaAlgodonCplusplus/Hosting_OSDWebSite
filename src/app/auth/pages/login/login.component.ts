import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthenticationActions, UiActions } from 'src/app/store/actions';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { ValidationsService } from '../../../services/validations.service';
import { ModalSelectors } from 'src/app/store/selectors';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { authenticationReducers } from 'src/app/store/reducers/authentication.reducer';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  loginForm: FormGroup;

  errorModalOpen$: Observable<boolean> = this.store.select(ModalSelectors.errorModalOpen);
  errorMessage$: Observable<string> = this.store.select(ModalSelectors.errorMessage);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private validationsService: ValidationsService,
    public eventFactoryService: EventFactoryService,
    private osdEventService: OSDService,
    private securityEventService: SecurityEventService,
    private router: Router
  )
  {
    this.loginForm = this.createLoginForm();
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

  onSubmit(): void {
    if (this.loginForm.invalid) {
     this.loginForm.markAllAsTouched();
    return;
    }
    //this.osdEventService.userLogin(this.loginForm.value);
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['jaencarlo14@gmail.com', [Validators.required, this.validationsService.isValidEmail], []],
      password: ['Liga142003', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
    });
  }
}
