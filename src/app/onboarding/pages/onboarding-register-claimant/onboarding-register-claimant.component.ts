import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
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
import { Router } from '@angular/router';
import { ModalActions } from 'src/app/store/actions';

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
  user: any;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private router: Router,
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

  async loadUserInfo() {
    var userInfo = this.authenticationService.userInfo;
    if (userInfo) {
      this.user = userInfo;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadUserInfo();
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
      console.log("All subscribers", osdUsersSubscribers);
      this.subscribers = osdUsersSubscribers.filter(subscriber => {
        const match = subscriber.code.match(/.+\/([^\/]+)\/.+\/.+$/);
        return match && (match[1] === 'CL' || match[1] === 'CFH') && subscriber.can_be_claimed;
      });
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
      subscriberClaimedCompanyName: [''],
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

  sendRegistrationEmail(to_email: string, userCode?: string) {
    const payload = {
      to_email: to_email,
      UserCode: userCode || '',
      template_id: "d-34320884046f4acab1fa20cf8ca1c5b0",
      from: {
        email: "info@digitalsolutionoffice.com",
        name: "Digital Solution Office"
      },
      personalizations: [
        {
          to: [
            { email: to_email }
          ],
          dynamic_template_data: {
            subject: "Registro de CFH",
          }
        }
      ]
    };

    const url = 'https://api.sendgrid.com/v3/mail/send';
    // Return the observable so the caller can subscribe.
    return this.osdEventService.userRegisterEmail(payload, url);
  }

  async onSubmit(): Promise<void> {
    if (this.personalForm.invalid && this.selectorRegistry === true) {
      this.personalForm.markAllAsTouched();
      return;
    }

    if (!this.personalForm.value.country && this.selectorRegistry === true) {
      this.personalForm.get('country')?.markAsTouched();
      return;
    }
    
    if (!this.personalForm.value.acceptConditions) {
      this.personalForm.get('acceptConditions')?.markAsTouched();
      return;
    }

    this.uploadFile = true;
    this.store.dispatch(UiActions.toggleConfirmationButton());

    if (this.selectorRegistry === true) {
      this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, "Claimant").subscribe((response) => {
        // Wait 5 seconds to ensure the user is created.
        setTimeout(async () => {
          this.store.dispatch(
            ModalActions.addAlertMessage({ alertMessage: "Registration successful!" })
          );
          this.store.dispatch(ModalActions.openAlert());

          // Wait an additional 2 seconds (optional)
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Send the registration email using the SendGrid API directly.
          const email = this.personalForm.value.email;
          const userCode = response.UserCode;
          this.sendRegistrationEmail(email, userCode).subscribe({
            next: () => {
              // After email is sent, perform login.
              const loginForm = this.formBuilder.group({
                email: this.personalForm.value.email,
                password: this.personalForm.value.password
              });
              this.osdEventService.userLogin(loginForm.getRawValue() as { email: string, password: string }).subscribe({
                next: (response: any) => {
                  const userInfo = response?.Body?.USER_INFO;
                  this.authenticationService.userInfo = userInfo;
                  this.router.navigate(['/home']);
                },
                error: (error: any) => {
                  console.error('Login error:', error);
                },
              });
            },
            error: (error) => {
              console.error('Error sending registration email:', error);
              // Optionally proceed with login even if the email fails.
              const loginForm = this.formBuilder.group({
                email: this.personalForm.value.email,
                password: this.personalForm.value.password
              });
              this.osdEventService.userLogin(loginForm.getRawValue() as { email: string, password: string }).subscribe({
                next: (response: any) => {
                  const userInfo = response?.Body?.USER_INFO;
                  this.authenticationService.userInfo = userInfo;
                  this.router.navigate(['/home']);
                },
                error: (error: any) => {
                  console.error('Login error:', error);
                },
              });
            }
          });
        }, 5000);
      });
      return;
    }

    setTimeout(() => {
      if (this.personalForm.value.identity) {
        this.accountForm.addControl(EventConstants.CLAIMANT_ID, new FormControl(this.personalForm.value.identity));
      } else if (this.user) {
        this.accountForm.addControl(EventConstants.EMAIL, new FormControl(this.user.email));
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

  selectSubscriber(id: string, companyName: string) {
    const selectedSubscriber = this.subscribers.find(subscriber => subscriber.companyname === companyName);
    console.log("Selected subscriber", selectedSubscriber);
    if (selectedSubscriber) {
      this.accountForm.patchValue({
        subscriberClaimedName: selectedSubscriber.name,
        subscriberClaimedCompanyName: selectedSubscriber.companyname,
      });
    }
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
