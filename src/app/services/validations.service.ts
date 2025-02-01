import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})


export class ValidationsService {
  private readonly emailPattern: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;

  constructor(private translate: TranslateService) { }

  isValidEmail = function (this: ValidationsService, control: FormControl): ValidationErrors | null {
    const value: string = control.value.trim();

    if (!this.emailPattern.test(value)) {
      return {
        invalidEmail: true,
      };
    }

    return null;
  }.bind(this);

  isValidPassword = function (this: ValidationsService, control: FormControl): ValidationErrors | null {
    const value: string = control.value;

    // Definir los criterios de complejidad de la contraseña
    const hasUpperCase = /[A-Z]/.test(value); // Al menos una letra mayúscula
    const hasLowerCase = /[a-z]/.test(value); // Al menos una letra minúscula
    const hasNumber = /\d/.test(value); // Al menos un número

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return {
        invalidPassword: true,
      };
    }

    return null;
  }.bind(this);


  isValidField(form: FormGroup, field: string): boolean | null {
    const control = form.controls[field];
    return control ? control.errors && control.touched : null;
  }

  confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { passwordsDoNotMatch: true };
    }

    return null;
  };


  getFieldError(form: FormGroup, field: string): string | null {
    if (field === 'confirmPassword') {
      const confirmPasswordControl = form.get('confirmPassword');
      if (confirmPasswordControl && confirmPasswordControl.hasError('passwordsDoNotMatch')) {
        return 'Las contraseñas no coinciden';
      }
    }

    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          if (this.translate.currentLang == "en") {
            return 'This field is required';
          }
          return 'Este campo es obligatorio';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;

        case 'invalidEmail':
          if (this.translate.currentLang == "en") {
            return 'The email is invalid.';
          }
          return 'El correo electrónico no es válido.';

        case 'invalidPassword':
          if (this.translate.currentLang == "en") {
            return 'Your password is weak';
          }
          return 'Su contraseña es débil';
      }
    }

    return null;
  }
}
