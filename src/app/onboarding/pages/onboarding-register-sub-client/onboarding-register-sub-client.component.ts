import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';
import { EventConstants } from 'src/app/models/eventConstants';
import { CountryService } from 'src/app/services/country.service';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { Router } from '@angular/router';

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
  showModal: boolean = false;
  professionalFreeTrainers$ = this.osdDataService.ProfessionalFreeTrainerList$;
  professionalsFree!: FreeProfessional[];
  freeProfessionalExists!: boolean;
  clientType: DropDownItem[] = [
    { value: this.translate.instant('Public Entity'), key: "Public Entity" },
    { value: this.translate.instant('Private Entity'), key: "Private Entity" },
  ];
  clientCanBeClaimed: DropDownItem[] = [
    { value: this.translate.instant('Yes'), key: "Yes" },
    { value: this.translate.instant('No'), key: "No" },
  ];
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private osdDataService: OSDDataService,
    private countryService: CountryService,
    private router: Router
  ) {
    this.accountForm = this.createAccountForm();
    this.personalForm = this.createPersonalForm();
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
        } else if (this.translate.currentLang === "es") {
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

      this.showDocument = this.translate.currentLang === "en";
      this.osdEventService.GetProfessionalFreeTrainers();
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);

    this.professionalFreeTrainers$.subscribe(pft => {
      this.professionalsFree = pft;
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  onClientTypeChange(clientCanBeClaimed: string): void {
    console.log("Client type changed:", clientCanBeClaimed, "can be claimed:", clientCanBeClaimed === 'Client Subscriber' ? 'Yes' : 'No');
    this.accountForm.patchValue({
      clientCanBeClaimed: clientCanBeClaimed === 'Client Subscriber' ? 'Yes' : 'No'
    });
  }

  private createPersonalForm(): FormGroup {
    return this.formBuilder.group({
      companyName: ['', [Validators.required]],
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      zipCode: ['', Validators.required],
      address: ['', [Validators.required]],
      city: [''],
      country: ['', [Validators.required]],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      web: [''],
      accountType: ['063e12fa-33db-47f3-ac96-a5bdb08ede61'],
      acceptConditions: [false]
    });
  }

  private createAccountForm(): FormGroup {
    return this.formBuilder.group({
      clientType: ['', [Validators.required]],
      showCodepl: [''],
      emailOfRefer: [''],
      clientCanBeClaimed: [''],
    });
  }

  sendRegistrationEmail(to_email: string, userCode?: string) {
    const payload = {
      to_email: to_email,
      UserCode: userCode || '',
      template_id: "d-6c67275abe9a49b39c70726c4cbffd97",
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

  onSubmit(): void {
    const selectedClientCanBeClaimed = this.accountForm.get('clientCanBeClaimed')?.value;
    console.log("Client type changed:", selectedClientCanBeClaimed, "can be claimed:", selectedClientCanBeClaimed === 'Client Subscriber' ? 'Yes' : 'No');
    this.accountForm.patchValue({
      clientCanBeClaimed: selectedClientCanBeClaimed === 'Client Subscriber' ? 'Yes' : 'No'
    });
    if (this.personalForm.invalid || this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      const alertMessage = this.translate.currentLang === "en"
        ? "There are missing fields to fill out"
        : "Faltan campos por llenar";
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage }));
      this.store.dispatch(ModalActions.openAlert());
      return;
    }

    if (this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
    }

    this.store.dispatch(UiActions.toggleConfirmationButton());
    const userEmail = this.personalForm.value.email;
    localStorage.setItem('userEmail', userEmail);

    // Include both accountForm and personalForm values in the registration call
    this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, EventConstants.SUBSCRIBER_CUSTOMER)
      .subscribe({
        next: (response) => {
          console.log("Registration successful:", response);
          // After registration is successful, send the registration email.
          console.log("Registration successful. Sending registration email...", userEmail);
          const userCode = response.UserCode;
          this.sendRegistrationEmail(userEmail, userCode).subscribe({
            next: () => {
              this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Registration successful!" }));
              this.store.dispatch(ModalActions.openAlert());
              this.router.navigate(['/auth']);
            },
            error: (error: any) => {
              console.error("Error sending registration email:", error);
              // Even if email sending fails, proceed with navigation.
              this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Registration successful, but email sending failed." }));
              this.store.dispatch(ModalActions.openAlert());
              this.router.navigate(['/auth']);
            }
          });
        },
        error: (error: any) => {
          console.error("Registration failed:", error);
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Registration failed. Please try again." }));
          this.store.dispatch(ModalActions.openAlert());
        }
      });
  }

  openModal() {
    this.showModal = !this.showModal;
    this.freeProfessionalExists = false;
  }

  closeModal() {
    this.showModal = false;
  }

  verifiedProfessionalFree(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.trim();

    this.professionalsFree.forEach(pft => {
      const code = pft.Code.trim();
      if (code === inputValue) {
        this.freeProfessionalExists = true;
        this.accountForm.patchValue({
          showCodepl: inputValue,
        });
      } else {
        this.freeProfessionalExists = false;
      }
    });
  }

  eliminatedProfessionalFree() {
    this.showModal = false;
    this.freeProfessionalExists = false;
  }

  openVideo() {
    window.open('https://www.youtube.com/embed/I80vR3wOUqc', '_blank');
  }

  makeAPurchase() {
    window.open('https://buy.stripe.com/5kA0139lO0Od2v67ss', '_blank');
  }

  openVideoSolutionsOsd() {
    window.open('https://youtu.be/pBWiJQA_66E?si=eBQGYz_AS5xFGq2h', '_blank');
  }

  makeAPurchaseSolutionsOsd() {
    window.open('https://buy.stripe.com/00g5ln69CeF35Hi28b', '_blank');
  }
}
