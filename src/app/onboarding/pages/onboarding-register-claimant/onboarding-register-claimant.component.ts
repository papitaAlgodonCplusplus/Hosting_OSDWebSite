import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { is, tr } from 'date-fns/locale';
import { Observable } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDService } from 'src/app/services/osd-event.services';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { AuthenticationActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-register-claimant',
  templateUrl: './onboarding-register-claimant.component.html',
  styleUrls: ['./onboarding-register-claimant.component.css']
})
export class OnboardingRegisterClaimantComponent {
  isValidToken$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);
  accountForm: FormGroup;
  personalForm: FormGroup;
  showPersonalInfo!: boolean;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('reclamacion_simple'), key: 'key1' },
    { value: this.translate.instant('reclamacion_compleja'), key: 'Key2' },
    { value: this.translate.instant('reclamacion_sostenibilidad'), key: 'key3' },
    { value: this.translate.instant('mediacion_arbitraje'), key: 'Key4' }
  ];
  documentNames: string[] = new Array(2);
  isAcceptConditions!: boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private translate: TranslateService,
    private osdEventService : OSDService
  ) {
  
    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.isValidToken$.subscribe((validation) => {
        if (validation) {
          this.showPersonalInfo = false
        } 
        else{
          this.showPersonalInfo = true
        }      
      })
    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createPersonalForm(): FormGroup {
    const form = this.formBuilder.group({
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      password:['',[Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      web: [''], 
      registrationOption : [, [Validators.required]],
      accountType: ['7b04ef6e-b6b6-4b4c-98e5-3008512f610e'],
      acceptConditions: [false]
    });
    return form;
  }

  private createAccountForm(): FormGroup {
    const form = this.formBuilder.group({
      claimtype: ['', [Validators.required]],
      subscriberClaimed: ['', [Validators.required]],
      serviceProvided: ['', [Validators.required]],
      amountClaimed: ['', [Validators.required]],
      facts: ['', [Validators.required]],
      supportingDocument1: ['', [Validators.required]],
      supportingDocument2: ['', [Validators.required]]
    });
    return form;
  }

  toggleForm(formType: string): void {
    if (formType === 'personalInfo') {
      this.showPersonalInfo = true;
    } else if (formType === 'claimInfo') {
      this.showPersonalInfo = false;
    }
  }
  
  displayFileName(): void {
    const fileNameDocument1 = document.getElementById('supportingDocument1') as HTMLInputElement;
    const fileNameDocument2 = document.getElementById('supportingDocument2') as HTMLInputElement;

    if (fileNameDocument1.value !== null || fileNameDocument2.value !== null) {
      this.documentNames[0] = fileNameDocument1.value;
      this.documentNames[1] = fileNameDocument2.value;
    }
  }

  onSubmit(): void {
    console.log(this.accountForm.value)
    console.log(this.personalForm.value)
    if (this.accountForm.invalid || this.personalForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      return;
    }
  
    if (!this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
      return;
    }

    const userEmail = this.personalForm.value.email;
    localStorage.setItem('userEmail', userEmail);
    this.osdEventService.userRegister(this.accountForm.value,this.personalForm.value,EventConstants.CLAIMANT);
  }
}
