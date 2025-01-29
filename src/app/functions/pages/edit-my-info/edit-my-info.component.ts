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

    this.osdService.updateUserProfile(this.user.id, this.userForm.value).subscribe({
      next: () => {
        this.snackBar.open('✅ Datos personales actualizados correctamente.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.store.dispatch(
          ModalActions.addAlertMessage({ alertMessage: "Registration successful!" })
        );
        this.store.dispatch(ModalActions.openAlert());
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('❌ Error updating user profile:', error);
        this.snackBar.open('❌ Error al actualizar los datos personales.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
} 
