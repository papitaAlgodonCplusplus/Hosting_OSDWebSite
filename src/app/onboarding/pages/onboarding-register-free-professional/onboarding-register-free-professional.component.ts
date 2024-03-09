import { Component, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { EventAction } from 'src/app/models/eventAction';
import { EventConstants } from 'src/app/models/eventConstants';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-free-professional',
  templateUrl: './onboarding-register-free-professional.component.html',
  styleUrls: ['./onboarding-register-free-professional.component.css']
})
export class OnboardingRegisterFreeProfessionalComponent implements OnDestroy {
  accountForm: FormGroup;
  personalForm: FormGroup;
  selectedWorkspace: string | undefined;
  isDropdownOpen = false;
  workspace: DropDownItem[] = [
    { value: this.translate.instant('DT'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
    { value: this.translate.instant('FC'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
    { value: this.translate.instant('TR'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
    { value: this.translate.instant('TC'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
    { value: this.translate.instant('TM'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
    { value: this.translate.instant('TS'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' }
  ];
  selectedpayTPV: string | undefined;
  payTPV: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];
  selectedservicerates!: string;
  servicerates: DropDownItem[] = [
    { value: this.translate.instant('tramitador_reclamaciones_ORD'), key: 'Key1' },
    { value: this.translate.instant('formador_consultor'), key: 'Key2' }
  ];
  documentNames: string[] = new Array(2);
  isAcceptConditions!: boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private securityEventService: SecurityEventService,
    private translate: TranslateService
  ) {
    this.accountForm = this.createAccountForm();
    this.personalForm = this.createPersonalForm();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createAccountForm(): FormGroup {
    const accountForm = this.formBuilder.group({
        workspace: ['', [Validators.required]],
        otherWorspace: [''],
        collegiateCardArchive: [null, [Validators.required]],
        lastReceiptCLI: [null, [Validators.required]],
        servicerates: ['', [Validators.required]],
        payTPV: ['', Validators.required],
    });
    return accountForm;
  }

  private createPersonalForm(): FormGroup {
    const personalForm = this.formBuilder.group({
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
      web: [''],
      acceptConditions: [false]
    });
    return personalForm;
  }

  selectServiceRates(index: number) {
    const serviceratesControl = this.accountForm.get('servicerates');
    if (serviceratesControl) {
      this.selectedservicerates = this.servicerates[index].value;
      serviceratesControl.setValue(this.selectedservicerates);
    }
  }

  displayFileName(): void {
    const fileNameDisplay = document.getElementById('collegiateCardArchive') as HTMLInputElement;
    const fileNameDispla2y = document.getElementById('lastReceiptCLI') as HTMLInputElement;

    if (fileNameDisplay.value != null || fileNameDispla2y.value != null) {
      console.log(fileNameDisplay.value);
      this.documentNames[0] = fileNameDisplay.value
      this.documentNames[1] = fileNameDispla2y.value
    }
  }

  onSubmit(): void {
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
    this.securityEventService.userRegister(this.accountForm.value,this.personalForm.value,EventConstants.FREE_PROFESSIONAL);
  }
}
