import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OSDService } from 'src/app/services/osd-event.services';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-edit-my-info',
  templateUrl: './edit-my-info.component.html',
  styleUrls: ['./edit-my-info.css']
})
export class UserProfileEditComponent implements OnInit {
  userForm: FormGroup;
  user: any;
  showPassword = false; // For toggling password visibility

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private osdService: OSDService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      firstSurname: ['', Validators.required],
      middleSurname: [''],
      city: ['', Validators.required],
      companyName: [''],
      address: [''],
      zipcode: [''],
      landline: [''],
      mobilePhone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]], // Optional password field
      web: ['']
    });
  }

  ngOnInit(): void {
    this.user = this.authService.userInfo;
    this.loadUserData();
  }

  loadUserData(): void {
    from(this.osdService.getUserByID(this.user.Id)).subscribe({
      next: (response: any) => {
        const userData = response.Body.user;
        this.userForm.patchValue({
          name: userData.name,
          firstSurname: userData.firstsurname,
          middleSurname: userData.middlesurname,
          city: userData.city,
          companyName: userData.companyname,
          address: userData.address,
          zipcode: userData.zipcode,
          landline: userData.landline,
          mobilePhone: userData.mobilephone,
          email: userData.email,
          web: userData.web
        });
      },
      error: (error: any) => {
        console.error('❌ Error fetching user data:', error);
        this.snackBar.open('❌ Error al cargar los datos del usuario.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.snackBar.open('⚠️ Por favor, completa todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'left',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    const updateData = { ...this.userForm.value };
    if (!updateData.password) {
      delete updateData.password; // If password field is empty, don't send it in the request
    }

    this.osdService.updateUserProfile(this.user.id, updateData).subscribe({
      next: () => {
        this.snackBar.open('✅ Datos personales actualizados correctamente.', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('❌ Error updating user profile:', error);
        this.snackBar.open('❌ Error al actualizar los datos personales.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
