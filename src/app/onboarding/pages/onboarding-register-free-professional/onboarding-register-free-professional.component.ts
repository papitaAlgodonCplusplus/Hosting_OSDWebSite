import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-free-professional',
  templateUrl: './onboarding-register-free-professional.component.html',
  styleUrls: ['./onboarding-register-free-professional.component.css']
})
export class OnboardingRegisterFreeProfessionalComponent implements OnDestroy {
  registerForm: FormGroup;
  selectedWorkspace: string | undefined;
  isDropdownOpen = false;
  workspace: DropDownItem[] = [
    { value: this.translate.instant('DT'), key: 'key1' },
    { value: this.translate.instant('FC'), key: 'Key2' },
    { value: this.translate.instant('TR'), key: 'key3' },
    { value: this.translate.instant('TC'), key: 'Key4' },
    { value: this.translate.instant('TM'), key: 'key5' },
    { value: this.translate.instant('TS'), key: 'Key6' }
  ];
  selectedpayTPV: string | undefined;
  payTPV: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];
  conditionsArray: DropDownItem[] = [ // TODO: Rename the array
    { value:  this.translate.instant('tramitador_reclamaciones_ORD'), key: 'Key1' },
    { value:  this.translate.instant('formador_consultor'), key: 'Key2' }
  ];
  documentNames: string[] = new Array(2);
  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private securityEventService: SecurityEventService,
    private translate: TranslateService
  ) {
    this.registerForm = this.createRegisterForm();
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

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      workspace: ['', [Validators.required]],
      otherWorspace: [''],
      collegiateCardArchive: [null, [Validators.required]],
      lastReceiptCLI: [null, [Validators.required]],
      conditions: [[], [Validators.required]], //TODO: Rename the form attribute
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
      payTPV: ['', Validators.required],
      acceptConditions: [false]
    });
    return form;
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
    console.log(this.registerForm.value)

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.registerForm.value.acceptConditions) {
      const userEmail = this.registerForm.value.email;
      localStorage.setItem('userEmail', userEmail);
      //  this.securityEventService.userRegister(this.registerForm.value);
    }
  }

}
