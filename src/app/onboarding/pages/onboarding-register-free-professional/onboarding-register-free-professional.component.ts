import { Component, OnDestroy } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { EventConstants } from 'src/app/models/eventConstants';

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
  documentName: string = '';
  showDocument!: boolean;

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
  subcribersList: DropDownItem[] = [];
  documentNames: string[] = new Array(2);
  isAcceptConditions!: boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private osdEventService: OSDService,
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
      if(this.translate.currentLang == "en"){
        this.showDocument = true
      }
      else{
        this.showDocument = false
      }
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
      collegiateCardArchive: [null],
      lastReceiptCLI: [null],
      servicerates: [''],
    });
    return accountForm;
  }

  private createPersonalForm(): FormGroup {
    const personalForm = this.formBuilder.group({
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      companyName: ['',],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipCode: [''],
      city: [''],
      country: [''],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      web: [''],
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
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

  displayFileContract(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();

      if (fileExtension === 'pdf') {
        this.documentName = fileName;
      } else {
        this.store.dispatch(ModalActions.addAlertMessage({alertMessage:"Debe Insertar Solo archivos PDF"}));
        this.store.dispatch(ModalActions.changeAlertType({alertType:"warning"}));
        this.store.dispatch(ModalActions.openAlert());
        this.documentName = '';
      }
    } else {
      this.documentName = '';
    }
  }

  displayFileName(event: any, index: number): void {
    let file = event.target.files[0];
    if (file) {
      let allowedExtensions = /(\.pdf)$/i;
      if (!allowedExtensions.exec(file.name)) {
        this.store.dispatch(ModalActions.addAlertMessage({alertMessage:"Debe Insertar Solo archivos PDF"}))
        this.store.dispatch(ModalActions.changeAlertType({alertType:"warning"}))
        this.store.dispatch(ModalActions.openAlert())
        return
      }
      if (index === 0) {
        this.documentNames[0] = file.name;
      } else if (index === 1) {
        this.documentNames[1] = file.name;
      }
    }
  }

  onSubmit(): void {
    if (this.accountForm.invalid || this.personalForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      if(this.translate.currentLang == "en"){
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "There are missing fields to fill out" }));
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
        this.store.dispatch(ModalActions.openAlert());
      }else{
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Faltan campos por llenar" }));
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
        this.store.dispatch(ModalActions.openAlert());
      }
      return;
    }

    if (!this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
      return;
    }

    const userEmail = this.personalForm.value.email;
    localStorage.setItem('userEmail', userEmail);
    this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, EventConstants.FREE_PROFESSIONAL, "");
  }
}
