import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';
import { ModalSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'onboarding-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  verifyEmailForm: FormGroup;

  errorModalOpen$: Observable<boolean> = this.store.select(ModalSelectors.errorModalOpen);

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.verifyEmailForm = this.createVerifyEmailForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);

    // this.securityDataService.verifyEmailSuccess$.subscribe((data: boolean) => {
    //   if(data){
    //     this.router.navigate(['/home']);
    //   }
    // });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createVerifyEmailForm(): FormGroup {

    return this.formBuilder.group({
      code: ['', [Validators.required], []],
    });
  }

  // onVerify(): void {
  //   if (this.verifyEmailForm.invalid) {
  //     this.verifyEmailForm.markAllAsTouched();
  //     return;
  //   }

  //   this.securityEventService.verifyEmail({sessionKey: this.authenticationService.sessionKey, code: this.verifyEmailForm.value.code});
  // }

  // onResendCode(): void {
  //   this.securityEventService.resendEmailVerificationCode({sessionKey: this.authenticationService.sessionKey});
  // }


}

