import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-sub-client',
  templateUrl: './onboarding-register-sub-client.component.html',
  styleUrls: ['./onboarding-register-sub-client.component.css']
})
export class OnboardingRegisterSubClientComponent implements OnDestroy {
  isAcceptConditions!: boolean;
  accountForm: FormGroup;
  personalForm: FormGroup;
  selectedClientType: string | undefined;
  documentName: string = '';
  showDocument!: boolean;

  clientType: DropDownItem[] = [
    { value: this.translate.instant('Public Entity'), key: "Public Entity" }, //TODO: Implement language switching
    { value: this.translate.instant('Private Entity'), key: "Private Entity" },
  ];
  selectedPLcode: string | undefined;
  plCode: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];
  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private osdEventService: OSDService,
    private translate: TranslateService
  ) {
    this.accountForm = this.createAccountForm();
    this.personalForm = this.createPersonalForm();
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.translate.currentLang == "en") {
        this.showDocument = true
      }
      else {
        this.showDocument = false
      }

      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  displayFileName(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();

      if (fileExtension === 'pdf') {
        this.documentName = fileName;
      } else {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "You must insert only PDF files" }));
          this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
          this.store.dispatch(ModalActions.openAlert());
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Debe Insertar Solo archivos PDF" }));
          this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
          this.store.dispatch(ModalActions.openAlert());
        }
        this.documentName = '';
      }
    } else {
      this.documentName = '';
    }
  }


  openVideo() {
    window.open('https://www.youtube.com/embed/I80vR3wOUqc', '_blank');
  }

  makeAPurchase() {
    window.open('https://buy.stripe.com/5kA0139lO0Od2v67ss', '_blank');
  }

  openVideoSolutionsOsd() {
    window.open('https://www.youtube.com/watch?v=2HTLx9uvvqw', '_blank');
  }

  makeAPurchaseSolutionsOsd() {
    window.open('https://buy.stripe.com/00g5ln69CeF35Hi28b', '_blank');
  }

  private createPersonalForm(): FormGroup {
    const personalForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      zipCode: ['', Validators.required],
      address: ['', [Validators.required]],
      city: [''],
      country: [''],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      web: [''],
      accountType: ['063e12fa-33db-47f3-ac96-a5bdb08ede61'],
      acceptConditions: [false]
    });
    return personalForm;
  }
  private createAccountForm(): FormGroup {
    const accountForm = this.formBuilder.group({
      clientType: ['', [Validators.required]],
      plCode: ['']
    });
    return accountForm;
  }

  mostrarMenu = true;

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  onSubmit(): void {
    if (this.personalForm.invalid || this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "There are missing fields to fill out" }));
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
        this.store.dispatch(ModalActions.openAlert());
      } else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Faltan campos por llenar" }));
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
        this.store.dispatch(ModalActions.openAlert());
      }
      return
    }

    if (this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
    }

    const userEmail = this.personalForm.value.email;
    localStorage.setItem('userEmail', userEmail);
    this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, EventConstants.SUBSCRIBER_CUSTOMER);
  }
}