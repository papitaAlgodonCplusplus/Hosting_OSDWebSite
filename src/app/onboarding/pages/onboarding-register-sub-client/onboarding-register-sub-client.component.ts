import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-sub-client',
  templateUrl: './onboarding-register-sub-client.component.html',
  styleUrls: ['./onboarding-register-sub-client.component.css']
})
export class OnboardingRegisterSubClientComponent implements OnDestroy {

  registerForm: FormGroup;
  selectedClientType: string | undefined;
  clientType: DropDownItem[] = [
     { value: this.translate.instant('entidad_publica'), key: 'key1' }, //TODO: Implement language switching
     { value: this.translate.instant('entidad_privada'), key: 'Key2' },
  ];
  selectedPLcode: string | undefined;
  plCode: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private securityEventService: SecurityEventService,
    private translate : TranslateService
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
      clientType: ['', [Validators.required]],
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      country: ['',Validators.required],
      zipCode: ['',Validators.required],
      address: ['', [Validators.required]],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      web: [''],
      plCode: [''],
      acceptConditions: [false]
    });

    return form;
  }


  onSubmit(): void {
    console.log(this.registerForm.value)
    
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
      
    }

    if(this.registerForm.value.acceptConditions){
      const userEmail = this.registerForm.value.email;
      localStorage.setItem('userEmail', userEmail);
      //  this.securityEventService.userRegister(this.registerForm.value);
    }

  }
}
