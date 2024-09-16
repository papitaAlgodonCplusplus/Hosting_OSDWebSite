import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { Observable } from 'rxjs';
import { Subscriber } from 'src/app/functions/models/Subscriber';
import { UserInfo } from 'src/app/models/userInfo';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-register-free-professional',
  templateUrl: './onboarding-register-free-professional.component.html',
  styleUrls: ['./onboarding-register-free-professional.component.css']
})
export class OnboardingRegisterFreeProfessionalComponent implements OnDestroy {
  accountForm: FormGroup;
  personalForm: FormGroup;
  selectedSubscriberCustomer: string | undefined;
  isDropdownOpen = true;
  documentName: string = '';
  showDocument!: boolean;
  subscriberCustomers: DropDownItem[] = [];
  osdUsersSubscribersObservable$: Observable<UserInfo[]> = this.osdDataService.getOsdUsersSubscribersSuccess$
  subscribersObservable$: Observable<Subscriber[]> = this.osdDataService.getSubscribersSuccess$
  subscribers: Subscriber[] = [];

  workspace: DropDownItem[] = [
    { value: this.translate.instant('DT'), key: '87db7d48-ee2a-4494-8627-9cb9e377de21' },
    { value: this.translate.instant('FC'), key: 'eea2312e-6a85-4ab6-85ff-0864547e3870' },
    { value: this.translate.instant('TR'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
    { value: this.translate.instant('TC'), key: '1bfc42c6-0d32-4270-99ed-99567bc7a562' },
    { value: this.translate.instant('TM'), key: '4fbeb4e3-a284-44ef-ac65-a70a0620b1c9' },
    { value: this.translate.instant('TS'), key: 'afdc95b1-271e-4788-a00a-d40081d7314f' },
    { value: this.translate.instant('OSDSystemsEngineer'), key: '4e1477bf-e13c-084b-3bff-1149f3ab3f3b' },
  ];
  selectedWorkspace: string | undefined;
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
  isProcessor: boolean = false;
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private osdDataService: OSDDataService,
    private countryService: CountryService
  ) {
    this.accountForm = this.createAccountForm();
    this.personalForm = this.createPersonalForm();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.countryService.getCountries().subscribe((data: any[]) => {
        let countriesList;
        if (this.translate.currentLang === "en") {
          countriesList = data
            .map(country => {
              if (country.name?.common && country.cca2) {
                return {
                  value: country.name.common, 
                  key: country.name.common          
                } as DropDownItem;
              }
              return undefined;
            })
            .filter(country => country !== undefined) 
            .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
        }
        else if (this.translate.currentLang === "es") {
          countriesList = data
            .filter(country => country.translations?.spa)
            .map(country => {
              if (country.translations?.spa?.common && country.cca2) {
                return {
                  value: country.translations.spa.common, 
                  key: country.name.common                    
                } as DropDownItem;
              }
              return undefined;
            })
            .filter(country => country !== undefined)
            .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
        }
        this.countries = countriesList as DropDownItem[];
      });

      this.osdEventService.GetSubscribers();
      this.showDocument = this.translate.currentLang === "en"
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);

    this.osdUsersSubscribersObservable$.subscribe(osdUsersSubscribers => {
      this.subscribersObservable$.subscribe(subscribers => {
        osdUsersSubscribers.forEach(userSub => {
          var subscriberFound = subscribers.find(sub => sub.userId == userSub.Id)
          if (subscriberFound) {
            var dropDownItem: DropDownItem = { value: subscriberFound.companyName, key: subscriberFound.id }
            this.subscriberCustomers.push(dropDownItem)
          }
        })
      });
    });
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
      identificationDocument: ['', [Validators.required]],
      collegiateCardArchive: ['', [Validators.required]],
      lastReceiptCLI: [''],
      servicerates: [''],
      SubscriberId: ['']
    });
    return accountForm;
  }

  private createPersonalForm(): FormGroup {
    const personalForm = this.formBuilder.group({
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      companyName: [''],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
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


  displayFileContract(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();

      if (fileExtension === 'pdf') {
        this.documentName = fileName;
      } else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Debe Insertar Solo archivos PDF" }));
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
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
      if (index === 0) {
        this.documentNames[0] = file.name;
      } else if (index === 1) {
        this.documentNames[1] = file.name;
      }
      else {
        this.documentNames[2] = file.name;
      }
    }
  }


  onSubmit(): void {
    console.log(this.accountForm.value)
    if (this.accountForm.invalid || this.personalForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "There are missing fields to fill out" }));
        this.store.dispatch(ModalActions.openAlert());
      } else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Faltan campos por llenar" }));
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
    this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, EventConstants.FREE_PROFESSIONAL);
  }

  CheckIfIsTr() {
    this.selectedWorkspace = this.accountForm.value.workspace;
    if (this.selectedWorkspace === "2fc2a66a-69ca-4832-a90e-1ff590b80d24") {
      this.accountForm.get('SubscriberId')?.setValidators(Validators.required);
      this.accountForm.get('SubscriberId')?.updateValueAndValidity();
      this.isProcessor = false

    } else {
      this.accountForm.get('SubscriberId')?.clearValidators();
      this.accountForm.get('SubscriberId')?.updateValueAndValidity();
      this.isProcessor = true
    }
  }

}
