import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationsService } from '../../../services/validations.service';

@Component({
  selector: 'auth-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.css']
})
export class InputPasswordComponent {
  @Input() fieldName: string = 'password';
  @Input() formGroup!: FormGroup;
  @Input() name: string = 'Password';
  @Input() label: string = 'Contraseña';

  public showPassword: boolean = false;
  public inputPasswordType: string = 'password';

  constructor(
    private validationsService: ValidationsService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.inputPasswordType = this.showPassword ? 'text' : 'password';
  }

  isValidField(field: string): boolean | null {
    return this.validationsService.isValidField(this.formGroup, field);
  }

  getFieldError(field: string): string | null {
    return this.validationsService.getFieldError(this.formGroup, field);
  }
}
