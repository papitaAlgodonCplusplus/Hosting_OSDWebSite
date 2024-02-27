import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';


@Component({
  selector: 'app-proceeding-course',
  templateUrl: './proceeding-course.component.html',
  styleUrls: ['./proceeding-course.component.css']
})
export class ProceedingCourseComponent {
  registerForm: FormGroup;
  selectedFormation: string | undefined;
  selectedFIP: string | undefined;// Free intervening proffesional
  showPersonalInfo: boolean = true;

  income: number = 50;
  expenses: number = 100;
  settlement: number = 1000;
  state: string = 'pendiente';

  formations: DropDownItem[] = [
    { value: this.translate.instant('Tramitador de Reclamaciones ORD'), key: 'key1' }, //'Reclamación Simple - 75€ /10€ /7,5€ '
    { value: this.translate.instant('Formador/Consultor'), key: 'Key2' },
    { value: this.translate.instant('Ingeniero Kuarctech. Plataforma Digital OSD'), key: 'key3' }
  ];

  freeInterveningProfessionals: DropDownItem[] = [
    { value: this.translate.instant('CFH (Centro de Formación Homologado)'), key: 'key1' }, //'Reclamación Simple - 75€ /10€ /7,5€ '
    { value: this.translate.instant('FC  Formador/Consultor'), key: 'Key2' },
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
      formation: ['', [Validators.required]],
      freeInterveningProfessionals: ['', [Validators.required]],
      finalCalification: ['', [Validators.required]],
    });
    return form;
  }

  onSubmit(): void {
    console.log(this.registerForm.value)
    // this.showPersonalInfo = false;
    // if (this.registerForm.invalid) {
    //   this.registerForm.markAllAsTouched();
    //   return;

    // }

    const userEmail = this.registerForm.value.email;
    localStorage.setItem('userEmail', userEmail);
    //  this.securityEventService.userRegister(this.registerForm.value);
  }

  changeColor(link: string): void {
    this.activeLink = link;
  }
}
