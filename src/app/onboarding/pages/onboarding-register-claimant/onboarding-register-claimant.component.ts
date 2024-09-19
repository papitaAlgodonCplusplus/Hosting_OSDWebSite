import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { EventConstants } from 'src/app/models/eventConstants';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CountryService } from 'src/app/services/country.service';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-register-claimant',
  templateUrl: './onboarding-register-claimant.component.html',
  styleUrls: ['./onboarding-register-claimant.component.css']
})
export class OnboardingRegisterClaimantComponent {
  selectorRegistry!: boolean;
  displayedItems: any[] = [];
  isValidToken$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);
  accountForm: FormGroup;
  personalForm: FormGroup;
  showPersonalInfo!: boolean;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('SimpleClaim'), key: 'SimpleClaim' },
    { value: this.translate.instant('ComplexClaim'), key: 'ComplexClaim' },
    { value: this.translate.instant('ExtrajudicialClaimSustainability'), key: 'ExtrajudicialClaimSustainability' },
    { value: this.translate.instant('MediationArbitration'), key: 'MediationArbitration' }
  ];
  selectedSubscribers: string | undefined;
  selectedSubscriberId: string = '';
  subscribers: any[] = [];
  documentNames: string[] = new Array(2);
  isAcceptConditions!: boolean;
  registration: boolean = false;
  openModal: boolean = false;

  filteredSubscribers: any[] = [];
  filterCountry = '';
  filterCompanyName = '';
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private translate: TranslateService,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private countryService: CountryService
  ) {
    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
  }

  ngOnInit(): void {
    this.osdEventService.GetSubscribers();
    this.selectorRegistry = this.route.snapshot.params['selectorRegistry'] === 'true';

    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());

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
        this.countries.sort((a, b) => a.value.localeCompare(b.value));
      });

      if (this.selectorRegistry === true) {
        this.showPersonalInfo = true;
      }
      else {
        this.showPersonalInfo = false;
      }

      this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
        this.subscribers = osdUsersSubscribers;
        this.applyFilters()
      });
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
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      web: [''],
      registrationOption: [, [Validators.required]],
      accountType: ['7b04ef6e-b6b6-4b4c-98e5-3008512f610e'],
      acceptConditions: [false],
      city: [''],
      companyName: ['']
    });
    return form;
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 5) {
    this.displayedItems = this.filteredSubscribers.slice(startIndex, endIndex);
  }

  private createAccountForm(): FormGroup {
    const currentDate = new Date().toISOString().split('T')[0];
    const form = this.formBuilder.group({
      Date:[currentDate],
      claimtype: ['', [Validators.required]],
      subscriberClaimed: ['', [Validators.required]],
      serviceProvided: ['', [Validators.required]],
      amountClaimed: ['', [Validators.required]],
      facts: ['', [Validators.required]],
      supportingDocument1: ['', [Validators.required]],
      supportingDocument2: ['']
    });
    return form;
  }

  toggleForm(): void {
    this.showPersonalInfo = !this.showPersonalInfo;
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
    if (this.translate.currentLang == "en") {
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "There are missing fields to fill out" }));
    } else {
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Faltan campos por llenar" }));
    }

    if (this.accountForm.invalid && this.personalForm.invalid && this.selectorRegistry === true) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      this.store.dispatch(ModalActions.openAlert());
      return;
    } else if (this.accountForm.invalid && this.selectorRegistry === false) {
      this.accountForm.markAllAsTouched();
      this.store.dispatch(ModalActions.openAlert());
      return;
    }

    const subscriberName = this.accountForm.get('subscriberClaimed')?.value;
    this.accountForm.patchValue({
      subscriberClaimed: this.selectedSubscribers
    });

    if (this.selectorRegistry === true) {
      if (!this.personalForm.value.acceptConditions) {
        this.isAcceptConditions = true;
        return;
      }
      this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, "Claimant");
    } else {
      if (this.authenticationService.userInfo?.Id) {
        const claimantIdControl = new FormControl(this.authenticationService.userInfo.Id);
        this.accountForm.addControl(EventConstants.CLAIMANT_ID, claimantIdControl);
      }
      this.osdEventService.addClaim(this.accountForm.value);
    }

    this.accountForm.patchValue({
      subscriberClaimed: subscriberName
    });
  }

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  applyFilters() {
    this.filteredSubscribers = this.subscribers.filter(subscriber =>
      (this.filterCountry ? subscriber.Country.toLowerCase().includes(this.filterCountry.toLowerCase()) : true) &&
      (this.filterCompanyName ? subscriber.CompanyName.toLowerCase().includes(this.filterCompanyName.toLowerCase()) : true)
    );
  }

  selectSubscriber(id: string, name: string) {
    this.accountForm.patchValue({
      subscriberClaimed: name
    });

    this.selectedSubscribers = id;
    this.openModal = false;
  }
}
