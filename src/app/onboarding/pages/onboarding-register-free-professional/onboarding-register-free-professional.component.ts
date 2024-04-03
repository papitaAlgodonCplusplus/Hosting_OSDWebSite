import { Component, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { Claim } from 'src/app/models/claim';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDService } from 'src/app/services/osd-event.services';
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
  isDropdownOpen = true;
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
  subcribersList : DropDownItem[] = [];
  documentNames: string[] = new Array(2);
  isAcceptConditions!: boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private osdEventService: OSDService,
    private translate: TranslateService,
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

  openVideoTrainerConsultant() {
    window.open('https://youtu.be/fZ0duSXXrs8', '_blank');
  }

  makeAPurchaseTrainerConsultant() {
    window.open('https://buy.stripe.com/00g9BD55y54t0mYcMR', '_blank');
  }
  
  downloadContranctTrainerConsultant() {
    window.open('https://oficinasolucionesdigital.com/wp-content/uploads/2024/03/25-3-24-Contrato-Profesional-Libre-1-1.pdf', '_blank');
  }

  openVideoTecnicOSD() {
    window.open('https://youtu.be/M_WhgGimbL8', '_blank');
  }

  makeAPurchaseTecnicOSDLink() {
    window.open('https://buy.stripe.com/28o9BDgOgcwV2v67sz', '_blank');
  }

  private createAccountForm(): FormGroup {
    const accountForm = this.formBuilder.group({
        workspace: ['', [Validators.required]],
        otherWorspace: [''],
        collegiateCardArchive: [null, [Validators.required]],
        lastReceiptCLI: [null, [Validators.required]],
        servicerates: ['', [Validators.required]],
        payTPV: ['', Validators.required],
       // subscriber:['' , Validators.required]
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
      password:['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      accountType: ['0c61160c-d087-42b6-9fa0-1fc8673a00b2'],
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
    this.osdEventService.userRegister(this.accountForm.value,this.personalForm.value,EventConstants.FREE_PROFESSIONAL);
  }
}
