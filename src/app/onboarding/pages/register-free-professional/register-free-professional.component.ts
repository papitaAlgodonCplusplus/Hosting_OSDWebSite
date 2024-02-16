import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-free-professional',
  templateUrl: './register-free-professional.component.html',
  styleUrls: ['./register-free-professional.component.css']
})
export class RegisterFreeProfessionalComponent implements OnDestroy {
  registerForm: FormGroup;
  selectedWorkspace: string | undefined;
  isDropdownOpen = false;
  workspace: DropDownItem[] = [
    { value: 'DT Director/a Tecnico/a', key: 'key1' },
    { value: 'FC  Formador/Consultor', key: 'Key2' },
    { value: 'TR Tramitador/a', key: 'key3' },
    { value: 'TC- Tecnico Contabilidad', key: 'Key4' },
    { value: 'TM- Marketing', key: 'key5' },
    { value: 'TS- Sac (Servicio atención al ciudadano)', key: 'Key6' }
  ];
  selectedpayTPV: string | undefined;
  payTPV: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];
  conditionsArray: DropDownItem[] = [ // TODO: Rename the array
    { value: 'ORD Claims Processor- 125€', key: 'Key1' },
    { value: 'Trainer/Consultant - 250€', key: 'Key2' }
  ];
  documentNames: string[] = new Array(2);
  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private securityEventService: SecurityEventService,
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
