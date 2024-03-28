import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDService } from 'src/app/services/osd-event.services';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-cfh',
  templateUrl: './onboarding-register-cfh.component.html',
  styleUrls: ['./onboarding-register-cfh.component.css']
})
export class OnboardingRegisterCfhComponent {

  accountForm: FormGroup;
  personalForm: FormGroup;
  selectedEntity: string | undefined;
  entity: DropDownItem[] = [
    { value: this.translate.instant("entidad_publica"), key: this.translate.instant("entidad_publica") },
    { value: this.translate.instant("entidad_privada"), key: this.translate.instant("entidad_privada") },
  ];
  selectedPLcode: string | undefined;
  plCode: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];
  isAcceptConditions!: boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private OSDEventService: OSDService,
    private translate : TranslateService
  ) {
    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
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

  private createPersonalForm(): FormGroup {
    const form = this.formBuilder.group({
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],    
      zipCode: ['',Validators.required],
      address: ['', [Validators.required]],
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
  
  onSubmit(): void {
    console.log(this.accountForm.value)
    console.log(this.personalForm.value)
    if (this.accountForm.invalid || this.personalForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
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
