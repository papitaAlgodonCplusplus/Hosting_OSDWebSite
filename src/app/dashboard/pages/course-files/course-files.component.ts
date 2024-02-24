import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-course-files',
  templateUrl: './course-files.component.html',
  styleUrls: ['./course-files.component.css']
})
export class CourseFilesComponent implements OnDestroy {
  registerForm: FormGroup;
  validationsService: any;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: 'Reclamación Simple - 75€ /10€ /7,5€ ', key: 'key1' },
    { value: 'Reclamación Compleja -300€ /10€ / 7,5€', key: 'Key2' },
    { value: 'Reclamación Extrajudicial/ Informe Sostenibilidad - 450€ /10€ / 7,5€', key: 'key3' },
    { value: 'Mediación/Arbitraje 750€ /10€ / 7,5€', key: 'Key4' }
  ];
  selectedSubscriber: string | undefined;
  subscriber: DropDownItem[] = [
    { value: 'PL', key: 'key1' }
  ];
  selectedfreeProfessionals: string | undefined;
  freeProfessionals: DropDownItem[] = [
    { value: 'DT Director/a Tecnico/a', key: 'key1' },
    { value: 'FC Formador/Consulto', key: 'key2' },
    { value: 'TR Tramitador/a', key: 'key3' },
    { value: 'TC- Tecnico Contabilidad', key: 'key4' },
    { value: 'TM- Marketing', key: 'key5' },
    { value: 'TS- Sac (Servicio atención al ciudadano', key: 'key6' }
  ];
  isDropdownOpen = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,) {
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      claimant: ['', [Validators.required]],
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      country: ['', Validators.required],
      zipCode: ['', Validators.required],
      address: ['', [Validators.required]],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      web: [''],
    });
    return form;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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
