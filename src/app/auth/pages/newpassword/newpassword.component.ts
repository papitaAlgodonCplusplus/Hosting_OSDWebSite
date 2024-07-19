import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ValidationsService } from 'src/app/services/validations.service';
import { confirmPasswordValidator } from 'src/app/auth/pages/newpassword/validators';
import { Router } from '@angular/router';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { WebBaseEvent } from 'src/app/models/webBaseEvent';
import { Observable, Subscription } from 'rxjs';
import { AuthSelectors, ModalSelectors } from 'src/app/store/selectors';
import { SecurityDataService } from 'src/app/services/security-data.service';
import { RestAPIService } from 'src/app/services/rest-api.service';
import { OSDService } from 'src/app/services/osd-event.services';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css']
})
export class NewpasswordComponent implements OnDestroy {

  passwordForm: FormGroup;
  showError = false;
  name: string = 'Type a new Password here';
  securityEventSubscriber: Subscription;
  errorModalOpen$: Observable<boolean> = this.store.select(ModalSelectors.errorModalOpen);
  errorMessage$: Observable<string> = this.store.select(ModalSelectors.errorMessage);
  initialized: boolean;

  constructor(
    private store: Store,
    private router: Router,
    private fb: FormBuilder,
    public eventFactoryService: EventFactoryService,
    private osdEventeService: OSDService) {
    this.passwordForm = this.createLoginForm();
    this.securityEventSubscriber = new Subscription();
    this.initialized = false;
  }

  changeFieldName(name: string) {
    this.name = name;
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
    this.securityEventSubscriber.unsubscribe();
  }

  redirectToAuth() {
    this.router.navigate(['/auth']);
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      repassword: [''],
    }, { validators: [confirmPasswordValidator] });
  }

  onSubmit(): void{
    const passwordValue = this.passwordForm.value.password;
    this.osdEventeService.ChangePassword(passwordValue);
  }

}
