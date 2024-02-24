import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-claimant',
  templateUrl: './onboarding-register-claimant.component.html',
  styleUrls: ['./onboarding-register-claimant.component.css']
})
export class OnboardingRegisterClaimantComponent {
  registerForm: FormGroup;
  selectedClaimant: string | undefined;
  showPersonalInfo: boolean = true;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('reclamacion_simple'), key: 'key1' }, //'Reclamación Simple - 75€ /10€ /7,5€ '
    { value: this.translate.instant('reclamacion_compleja'), key: 'Key2' },
    { value: this.translate.instant('reclamacion_sostenibilidad'), key: 'key3' },
    { value: this.translate.instant('mediacion_arbitraje'), key: 'Key4' }
  ];
  activeLink: string = '';
  documentNames: string[] = new Array(2);

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private securityEventService: SecurityEventService,
    private translate: TranslateService
  ) {
    this.registerForm = this.createRegisterForm();
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
      claimant: ['', [Validators.required]],
      subscriberClaimed: ['', []],
      serviceProvided: ['', []],
      amountClaimed: ['', []],
      facts: ['', []],
      supportingDocument1: ['', [Validators.required]],
      supportingDocument2: ['', [Validators.required]],
      acceptConditions: [false]
    });
    return form;
  }

  onSubmit(): void {
    console.log(this.registerForm.value)
    this.showPersonalInfo = false;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;

    }

    const userEmail = this.registerForm.value.email;
    localStorage.setItem('userEmail', userEmail);
    //  this.securityEventService.userRegister(this.registerForm.value);
  }

  toggleForm(formType: string): void {
    if (formType === 'personalInfo') {
      this.showPersonalInfo = true;
    } else if (formType === 'claimInfo') {
      this.showPersonalInfo = false;
    }
  }

  displayFileName(): void {
    const fileNameDocument1 = document.getElementById('supportingDocument1') as HTMLInputElement;
    const fileNameDocument2 = document.getElementById('supportingDocument2') as HTMLInputElement;

    if (fileNameDocument1.value !== null || fileNameDocument2.value !== null) {
      this.documentNames[0] = fileNameDocument1.value;
      this.documentNames[1] = fileNameDocument2.value;
    }
  }

  changeColor(link: string): void {
    this.activeLink = link;
  }
}
