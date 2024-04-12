import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import {Validators} from '@angular/forms';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ValidationsService } from 'src/app/services/validations.service';
import { WebBaseEvent } from 'src/app/models/webBaseEvent';
import { RestAPIService } from 'src/app//services/rest-api.service';
import { SecurityDataService } from 'src/app/services/security-data.service';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthSelectors, ModalSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnDestroy {

  @ViewChild('emailInput') emailInput: any;
  securityEventSubscriber: Subscription;
  forgotForm: FormGroup;
  initialized: boolean;

  errorModalOpen$: Observable<boolean> = this.store.select(ModalSelectors.errorModalOpen);
  errorMessage$: Observable<string> = this.store.select(ModalSelectors.errorMessage);

  constructor(
    private store: Store, private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    public eventFactoryService: EventFactoryService,
    private restApiService: RestAPIService,
    private securityDataService: SecurityDataService,
    private router: Router)
    {
    this.forgotForm = this.createLoginForm();
    this.securityEventSubscriber = new Subscription();
    this.initialized = false;
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
    this.securityDataService.userRegisterSuccess$.subscribe((data: boolean) => {
      if(data){
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
    this.securityEventSubscriber.unsubscribe();
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, this.validationsService.isValidEmail], []]
    });
  }

  onSubmit(): void{
    const emailValue = this.forgotForm.value.email;
    const passwordResetToken: WebBaseEvent = this.eventFactoryService.CreatePasswordResetToken(emailValue);
    this.restApiService.SendSecurityEvent(passwordResetToken);
  }

}
