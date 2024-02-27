import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-course-files',
  templateUrl: './course-files.component.html',
  styleUrls: ['./course-files.component.css']
})
export class CourseFilesComponent implements OnDestroy {
  registerForm: FormGroup;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('reclamacion_simple'), key: 'key1' }, //'Reclamación Simple - 75€ /10€ /7,5€ '
    { value: this.translate.instant('reclamacion_compleja'), key: 'Key2' },
    { value: this.translate.instant('reclamacion_sostenibilidad'), key: 'key3' },
    { value: this.translate.instant('mediacion_arbitraje'), key: 'Key4' }
  ];
  selectedSubscriber: string | undefined;
  subscriber: DropDownItem[] = [
    { value: 'PL', key: 'key1' }
  ];
  selectedfreeProfessionals: string | undefined;
  freeProfessionals: DropDownItem[] = [
    { value: this.translate.instant('CFH'), key: 'key1' },
    { value: this.translate.instant('FC'), key: 'Key2' }
  ];
  isDropdownOpen = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private translate: TranslateService) {
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
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      subscriber: ['', [Validators.required]],
      country: ['', Validators.required],
      zipCode: ['', Validators.required],
      address: ['', [Validators.required]],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      web: [''],
      finalGrade: ['', [Validators.required]],
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