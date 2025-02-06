import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { EventConstants } from 'src/app/models/eventConstants';
import { CountryService } from 'src/app/services/country.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-cfh',
  templateUrl: './onboarding-register-cfh.component.html',
  styleUrls: ['./onboarding-register-cfh.component.css']
})
export class OnboardingRegisterCfhComponent {

  accountForm: FormGroup;
  personalForm: FormGroup;
  selectedEntity: string | undefined;
  documentName: string = '';
  showDocument!: boolean;

  entity: DropDownItem[] = [
    { value: this.translate.instant('Public Entity'), key: "Public Entity" },
    { value: this.translate.instant('Private Entity'), key: "Private Entity" }
  ]; selectedPLcode: string | undefined;
  plCode: DropDownItem[] = [];
  isAcceptConditions!: boolean;
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;

  mostrarMenu = true;

  cfhOfferOptions: DropDownItem[] = [
    { value: 'Formador/Consultor', key: 'F/C' },
  ];

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private OSDEventService: OSDService,
    private countryService: CountryService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.translate.get([
        'publicEntity',
        'privateEntity',
        'trainerConsultant',
      ]).subscribe((translations) => {
        this.entity = [
          { value: translations['publicEntity'], key: 'publicEntity' },
          { value: translations['privateEntity'], key: 'privateEntity' }
        ];

        this.cfhOfferOptions = [
          { value: translations['trainerConsultant'], key: 'F/C' },
        ];
      });
      // Load countries
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

      // Show doc link based on language
      this.showDocument = (this.translate.currentLang === 'en');
      this.store.dispatch(UiActions.hideAll());
    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  // -------------------- FORMS SETUP --------------------
  private createPersonalForm(): FormGroup {
    return this.formBuilder.group({
      identity: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: [''],
      country: [''],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      password: [
        '',
        [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)]
      ],
      web: [''],
      accountType: ['8e539a42-4108-4be6-8f77-2d16671d1069'],
      acceptConditions: [false],
    });
  }
  /** Create the "accountForm" */
  private createAccountForm(): FormGroup {
    return this.formBuilder.group({
      clientType: ['', [Validators.required]],
      cfhOffer: ['', [Validators.required]]  // <--- NEW FIELD
    });
  }

  // -------------------- UI HANDLERS --------------------
  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  openVideoCFH() {
    window.open('https://youtu.be/1KFENOHC8T0?si=4isNbW0IEOsRvqIM', '_blank');
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
        this.store.dispatch(
          ModalActions.addAlertMessage({ alertMessage: "Debe Insertar Solo archivos PDF" })
        );
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
        this.store.dispatch(ModalActions.openAlert());
        this.documentName = '';
      }
    } else {
      this.documentName = '';
    }
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
    return this.OSDEventService.userRegisterEmail(payload, url);
  }

  // -------------------- SUBMIT --------------------

  onSubmit(): void {
    if (this.accountForm.invalid || this.personalForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();

      const invalidFields: string[] = [];
      Object.keys(this.personalForm.controls).forEach(key => {
        if (this.personalForm.controls[key].invalid) {
          invalidFields.push(key);
        }
      });
      Object.keys(this.accountForm.controls).forEach(key => {
        if (this.accountForm.controls[key].invalid) {
          invalidFields.push(key);
        }
      });

      // Show error modal
      const msgEn = "There are missing fields to fill out";
      const msgEs = "Faltan campos por llenar";
      this.store.dispatch(ModalActions.addAlertMessage({
        alertMessage: (this.translate.currentLang === "en") ? msgEn : msgEs
      }));
      this.store.dispatch(ModalActions.openAlert());
      return;
    }

    // Check accept conditions
    if (!this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
      return;
    }

    this.store.dispatch(UiActions.toggleConfirmationButton());

    // For debugging: 

    const userEmail = this.personalForm.value.email;
    localStorage.setItem('userEmail', userEmail);

    this.OSDEventService.userRegister(
      this.accountForm.value,
      this.personalForm.value,
      EventConstants.APPROVED_TRAINING_CENTER
    ).subscribe({
      next: (response: any) => {
        const userCode = response.UserCode;
        console.log("Registration successful:", response, userCode);
        this.sendRegistrationEmail(userEmail, userCode).subscribe({
          next: () => {
            this.store.dispatch(
              ModalActions.addAlertMessage({ alertMessage: "Registration successful!" })
            );
            this.store.dispatch(ModalActions.openAlert());
            this.router.navigate(['/auth']);
          },
          error: (error: any) => {
            console.error("Registration failed:", error);
            this.store.dispatch(
              ModalActions.addAlertMessage({ alertMessage: "Registration failed. Please try again." })
            );
            this.store.dispatch(ModalActions.openAlert());
          }
        });
      }
    });
  }
}
