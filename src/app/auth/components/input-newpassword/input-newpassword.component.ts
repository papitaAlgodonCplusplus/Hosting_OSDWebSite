import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-newpassword',
  templateUrl: './input-newpassword.component.html',
  styleUrls: ['./input-newpassword.component.css']
})
export class InputNewpasswordComponent {
  @Input() formGroup!: FormGroup;
  @Input() name: string = 'Repetir contraseña';

  public showPassword: boolean = false;
  public inputPasswordType: string = 'password';

  constructor() {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.inputPasswordType = this.showPassword ? 'text' : 'password';
  }
}
