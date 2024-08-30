import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthenticationActions, ModalActions, UiActions } from 'src/app/store/actions';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { ValidationsService } from '../../../services/validations.service';
import { MenuOptionsSelectors, ModalSelectors } from 'src/app/store/selectors';
import { authenticationReducers } from 'src/app/store/reducers/authentication.reducer';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { MenuOption } from 'src/app/models/menuOptions';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.authenticationService.endSession()
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
    this.osdEventService.userLogin(this.loginForm.value);
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }
}
