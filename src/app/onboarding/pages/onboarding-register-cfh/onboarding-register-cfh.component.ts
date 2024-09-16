import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
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
      { value: this.translate.instant('Public Entity'), key: "Public Entity" }, //TODO: Implement language switching
    { value: this.translate.instant('Private Entity'), key: "Private Entity" },
  ];
  selectedPLcode: string | undefined;
  plCode: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];
  isAcceptConditions!: boolean;
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private OSDEventService: OSDService,
    private translate : TranslateService,
    private countryService: CountryService
  ) {
    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
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

  private createPersonalForm(): FormGroup {
    const form = this.formBuilder.group({
      identity: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],    
      zipCode: ['',Validators.required],
      address: ['', [Validators.required]],
      city: ['',],
      country: [''],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      password: ['',[Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      web: [''],
      accountType:['8e539a42-4108-4be6-8f77-2d16671d1069'],
      acceptConditions: [false]
    });

    return form;
  }

  private createAccountForm(): FormGroup {
    const form = this.formBuilder.group({
      clientType: ['', [Validators.required]],   
    });

    return form;
  }

  mostrarMenu = true;

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  openVideoCFH() {
    window.open('https://youtu.be/YdyriLrWjpc', '_blank');
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

  onSubmit(): void {
    console.log(this.accountForm.value)
    console.log(this.personalForm.value)
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
    this.OSDEventService.userRegister(this.accountForm.value,this.personalForm.value,EventConstants.APPROVED_TRAINING_CENTER);
  }
}
