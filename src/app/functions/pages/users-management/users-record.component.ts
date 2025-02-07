import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OSDService } from 'src/app/services/osd-event.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-record',
  templateUrl: './users-record.component.html'
})
export class UsersManagementComponent implements OnInit {
  userForm: FormGroup;
  isErrorInForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private OSDEventService: OSDService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      users: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  get users(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  /**
   * Fetch all users via the OSDEventService.
   * Assumes the response has a Body with a "users" property.
   */
  fetchUsers(): void {
    this.OSDEventService.getUsers().subscribe({
      next: (response: any) => {
        let usersData = response.Body?.users || [];
        if (!Array.isArray(usersData)) {
          console.warn('⚠️ Warning: users is not an array, converting to an array');
          usersData = [usersData];
        }
        usersData.forEach((user: any) => {
          // Combine first name and surnames into a full name
          const fullName = `${user.name || ''} ${user.firstsurname || ''} ${user.middlesurname || ''}`.trim();
          const userGroup = this.fb.group({
            id: [user.id], // hidden field needed for deletion
            code: [user.code || '', Validators.required],
            fullName: [{ value: fullName, disabled: true }, Validators.required],
            email: [{ value: user.email || '', disabled: true }, [Validators.required, Validators.email]],
            city: [{ value: user.city || '', disabled: true }],
            country: [{ value: user.country || '', disabled: true }],
            accounttype: [{ value: user.accounttype || '', disabled: true }]
          });
          this.users.push(userGroup);
        });
      },
      error: (error) => {
        console.error('❌ Error fetching users:', error);
        this.snackBar.open('❌ Error fetching user records.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Deletes the user record from the form array and calls the backend deletion.
   * @param index The index of the user to delete.
   */
  removeUser(index: number): void {
    const userControl = this.users.at(index);
    const userId = userControl.get('id')?.value;
    // Remove from the form array immediately.
    this.users.removeAt(index);
    // Call the deletion API (assuming deleteUserRecord accepts a user id).
    this.OSDEventService.deleteUser(userId).subscribe({
      next: () => {
        this.snackBar.open('User record deleted successfully.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error: any) => {
        console.error('❌ Error deleting user record:', error);
        this.snackBar.open('❌ Error deleting user record.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
