import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SecurityDataService } from 'src/app/services/security-data.service';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { UiActions } from 'src/app/store/actions';
import { ModalSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  showSuccessModal: boolean;
  messageSuccessModal: string;

  errorModalOpen$: Observable<boolean> = this.store.select(ModalSelectors.errorModalOpen);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private validationsService: ValidationsService,
    public websocketService: WebsocketService,
    private securityEventService: SecurityEventService,
    private securityDataService: SecurityDataService
  )
  {
    this.registerForm = this.createRegisterForm();
    this.showSuccessModal = false;
    this.messageSuccessModal = "";
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);

    this.securityDataService.userRegisterSuccess$.subscribe((data: boolean) => {
      if(data){
        this.router.navigate(['/auth/verify-email']);
      }
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }


  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      firstName: ['Cristopher', [Validators.required]],
      lastName: ['González', [Validators.required]],
      email: ['Cristophergs2001@gmail.com', [Validators.required, this.validationsService.isValidEmail]],
      password: ['1234Cg', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6),]],
      confirmPassword: ['1234Cg', [Validators.required, this.validationsService.confirmPasswordValidator, this.validationsService.isValidPassword, Validators.minLength(6),]],
    });

    form.get('password')?.valueChanges.subscribe(() => {
      form.get('confirmPassword')?.updateValueAndValidity();
    });

    return form;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.securityEventService.userRegister(this.registerForm.value);
  }
}
