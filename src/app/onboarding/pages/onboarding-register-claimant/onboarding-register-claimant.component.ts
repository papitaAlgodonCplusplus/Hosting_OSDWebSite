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
import { UiActions } from 'src/app/store/actions';
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
  accountForm!: FormGroup;
  personalForm!: FormGroup;
  showPersonalInfo = false;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('SimpleClaim'), key: 'SimpleClaim' },
    { value: this.translate.instant('ComplexClaim'), key: 'ComplexClaim' },
    { value: this.translate.instant('ExtrajudicialClaimSustainability'), key: 'ExtrajudicialClaimSustainability' },
    { value: this.translate.instant('MediationArbitration'), key: 'MediationArbitration' }
  ];
  subscribers: any[] = [];
  isAcceptConditions = false;
  registration = false;
  openModal = false;
  filteredSubscribers: any[] = [];
  filterCountry = '';
  filterCompanyName = '';
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;
  uploadFile = false;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private translate: TranslateService,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private countryService: CountryService,
  ) {
    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());

      this.osdEventService.GetSubscribers();
      this.selectorRegistry = this.route.snapshot.params['selectorRegistry'] === 'true';
      this.showPersonalInfo = this.selectorRegistry;
    }, 0);


    this.countryService.getCountries().subscribe((data: any[]) => {
      let countriesList;
      if (this.translate.currentLang === "en") {
        countriesList = data
          .map(country => country.name?.common && country.cca2 ? { value: country.name.common, key: country.name.common } as DropDownItem : undefined)
          .filter(country => country !== undefined)
          .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
      } else if (this.translate.currentLang === "es") {
        countriesList = data
          .filter(country => country.translations?.spa)
          .map(country => country.translations?.spa?.common && country.cca2 ? { value: country.translations.spa.common, key: country.name.common } as DropDownItem : undefined)
          .filter(country => country !== undefined)
          .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
      }
      this.countries = countriesList as DropDownItem[];
    });

    this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
      this.subscribers = osdUsersSubscribers;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(UiActions.showAll());
  }

  private createPersonalForm(): FormGroup {
    return this.formBuilder.group({
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
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)]],
      web: [''],
      registrationOption: [, [Validators.required]],
      accountType: ['7b04ef6e-b6b6-4b4c-98e5-3008512f610e'],
      acceptConditions: [false],
      city: [''],
      companyName: ['']
    });
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
    return this.formBuilder.group({
      Date: [currentDate],
      claimtype: ['', [Validators.required]],
      subscriberClaimedName: ['', [Validators.required]],
      serviceProvided: ['', [Validators.required]],
      amountClaimed: ['', [Validators.required]],
      facts: ['', [Validators.required]],
      firstSupportingDocumentFileName: ['', [Validators.required]],
      firstSupportingDocumentFileId: [''],
      secondSupportingDocumentFileName: [''],
      secondSupportingDocumentFileId: ['']
    });
  }


  toggleForm(): void {
    this.showPersonalInfo = !this.showPersonalInfo;
  }

  onSubmit(): void {
    if (this.accountForm.invalid && this.personalForm.invalid && this.selectorRegistry === true) {
      this.personalForm.markAllAsTouched();
      this.accountForm.markAllAsTouched();
      return;
    } else if (this.accountForm.invalid && this.selectorRegistry === false) {
      this.accountForm.markAllAsTouched();
      return;
    }

    if (!this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
      return;
    }

    this.uploadFile = true;
    this.store.dispatch(UiActions.toggleConfirmationButton());

    setTimeout(() => {
      if (this.selectorRegistry) {
        this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, "Claimant").subscribe(() => {
        });
      }
      if (this.personalForm.value.identity) {
        this.accountForm.addControl(EventConstants.CLAIMANT_ID, new FormControl(this.personalForm.value.identity));
      }
      this.osdEventService.addClaim(this.accountForm.value).subscribe(() => {
      });
    }, 5000);
  }

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  applyFilters() {
    this.filteredSubscribers = this.subscribers.filter(subscriber =>
      (this.filterCountry ? subscriber.country.toLowerCase().includes(this.filterCountry.toLowerCase()) : true) &&
      (this.filterCompanyName ? subscriber.name.toLowerCase().includes(this.filterCompanyName.toLowerCase()) : true)
    );
  }

  selectSubscriber(id: string, name: string) {
    this.accountForm.patchValue({
      subscriberClaimedName: name
    });
    this.openModal = false;
  }

  handleFileUploaded(event: { typeFile: string, fileId: string }): void {
    if (event.typeFile == "firstSupportingDocument") {
      this.accountForm.patchValue({
        firstSupportingDocumentFileId: event.fileId
      });
    }
    else {
      this.accountForm.patchValue({
        secondSupportingDocumentFileId: event.fileId
      });
    }
  }

}
