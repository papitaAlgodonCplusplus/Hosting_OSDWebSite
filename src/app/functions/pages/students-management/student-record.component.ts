import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiActions } from 'src/app/store/actions';
import { Claim } from 'src/app/models/claim';  // Updated import

@Component({
  selector: 'app-student-record',
  templateUrl: './student-record.component.html',
  styleUrls: ['./student-record.component.css']
})
export class StudentRecordComponent implements OnInit, OnDestroy {
  studentForm: FormGroup;
  usersForm: FormGroup;
  claimsForm: FormGroup;

  user: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private osdEventService: OSDService,
    private authenticationService: AuthenticationService,
    private osdDataService: OSDDataService,
    private snackBar: MatSnackBar,
    private store: Store
  ) {
    // Create three reactive forms, one for each section
    this.studentForm = this.fb.group({
      students: this.fb.array([])
    });

    this.usersForm = this.fb.group({
      users: this.fb.array([])
    });

    this.claimsForm = this.fb.group({
      claims: this.fb.array<FormGroup<any>>([])  // Explicitly type as FormGroup<any>
    });
  }

  ngOnInit(): void {
    // Hide sidebar/footer for a clean interface.
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);

    this.user = this.authenticationService.userInfo;

    // Fetch data for each section.
    this.fetchStudents();
    this.fetchUsers();
    this.fetchClaims();
  }

  ngOnDestroy(): void {
    // Restore UI elements when leaving this page.
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  // Convenience getters for our FormArrays.
  get students(): FormArray {
    return this.studentForm.get('students') as FormArray;
  }
  get users(): FormArray {
    return this.usersForm.get('users') as FormArray;
  }
  get claims(): FormArray<FormGroup<any>> {
    return this.claimsForm.get('claims') as FormArray<FormGroup<any>>;
  }

  // -------------------------------
  // FETCH METHODS
  // -------------------------------

  fetchStudents(): void {
    this.osdEventService.getStudentsByCourse(this.user.Id).subscribe({
      next: (response: any) => {
        let students = response.Body?.students || [];
        if (!Array.isArray(students)) {
          console.warn('Warning: students is not an array, converting to an array');
          students = [students];
        }
        students.forEach((student: any) => {
          const studentGroup = this.fb.group({
            name: [student.name || '', Validators.required],
            attendance: [student.assistance ?? '', [Validators.required, Validators.min(0), Validators.max(100)]],
            grade: [student.calification || '', Validators.required],
            status: [student.status || 'Pending', Validators.required]
          });
          this.students.push(studentGroup);
        });
      },
      error: (error: any) => {
        console.error('Error fetching students:', error);
        this.snackBar.open('Error fetching student records.', 'Close', { duration: 3000 });
      }
    });
  }

  fetchUsers(): void {
    this.osdEventService.getUsers().subscribe({
      next: (response: any) => {
        let users = response.Body?.users || [];
        if (!Array.isArray(users)) {
          console.warn('Warning: users is not an array, converting to an array');
          users = [users];
        }
        users.forEach((user: any) => {
          const userGroup = this.fb.group({
            username: [user.username || '', Validators.required],
            email: [user.email || '', [Validators.required, Validators.email]],
            role: [user.role || 'User', Validators.required]
          });
          this.users.push(userGroup);
        });
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
        this.snackBar.open('Error fetching user records.', 'Close', { duration: 3000 });
      }
    });
  }

  fetchClaims(): void {
    // Use your existing method to fetch claims.
    this.osdEventService.gettingClaimsData(this.user.Id, "");

    // Subscribe to the ClaimsList observable from your data service.
    this.osdDataService.ClaimsList$.subscribe({
      next: (claims: Claim[]) => {
        // Clear any existing claims from the form array.
        const claimsArray = this.fb.array([]);
        claims.forEach((claim: Claim) => {
          const claimGroup = this.fb.group({
            // Map the Claim's identifier from either uppercase or lowercase.
            claimId: [claim.Id || claim.id || '', Validators.required],
            // Use 'facts' as the description.
            description: [claim.Facts || claim.facts || '', Validators.required],
            status: [claim.Status || claim.status || 'Pending', Validators.required],
            // Parse the valuationfc field as a number, defaulting to 0.
            valuationfc: [claim.valuationfc ? Number(claim.valuationfc) : 0, Validators.required]
          });
          (claimsArray as FormArray).push(claimGroup);
        });
        this.claimsForm.setControl('claims', claimsArray);
      },
      error: (error: any) => {
        console.error('Error fetching claims:', error);
        this.snackBar.open('Error fetching claim records.', 'Close', { duration: 3000 });
      }
    });
  }

  // -------------------------------
  // REMOVE METHODS (optional)
  // -------------------------------

  removeStudent(index: number): void {
    const studentControl = this.students.at(index).get('name');
    const studentName = studentControl ? studentControl.value : '';
    this.students.removeAt(index);
    this.osdEventService.deleteStudentRecord(studentName).subscribe({
      error: (error: any) => {
        console.error('Error deleting student record:', error);
        this.snackBar.open('Error deleting student record.', 'Close', { duration: 3000 });
      }
    });
  }

  removeUser(index: number): void {
    const userControl = this.users.at(index).get('username');
    const username = userControl ? userControl.value : '';
    this.users.removeAt(index);
    // this.osdEventService.deleteUser(username).subscribe({
    //   error: (error: any) => {
    //     console.error('Error deleting user:', error);
    //     this.snackBar.open('Error deleting user.', 'Close', { duration: 3000 });
    //   }
    // });
  }

  removeClaim(index: number): void {
    const claimControl = this.claims.at(index).get('claimId');
    // const claimId = claithis.osdEventService.deleteClaim(claimId).subscribe({
    //   error: (error: any) => {
    //     console.error('Error deleting claim:', error);
    //     this.snackBar.open('Error deleting claim.', 'Close', { duration: 3000 });
    //   }
    // });mControl ? claimControl.value : '';
    // this.claims.removeAt(index);
    // 
  }

  // -------------------------------
  // SUBMIT METHODS
  // -------------------------------

  onSubmitStudents(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields for Students.', 'Close', { duration: 3000 });
      return;
    }
    this.osdEventService.updateStudentRecords(this.studentForm.value).subscribe({
      next: () => {
        this.snackBar.open('Student records updated successfully.', 'Close', { duration: 3000 });
      },
      error: (error: any) => {
        console.error('Error updating student records:', error);
        this.snackBar.open('Error updating student records.', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmitUser(): void {
    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields for Users.', 'Close', { duration: 3000 });
      return;
    }
    // this.osdEventService.updateUsers(this.usersForm.value).subscribe({
    //   next: () => {
    //     this.snackBar.open('User records updated successfully.', 'Close', { duration: 3000 });
    //   },
    //   error: (error: any) => {
    //     console.error('Error updating user records:', error);
    //     this.snackBar.open('Error updating user records.', 'Close', { duration: 3000 });
    //   }
    // });
  }

  onSubmitClaims(): void {
    if (this.claimsForm.invalid) {
      this.claimsForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields for Claims.', 'Close', { duration: 3000 });
      return;
    }
    // this.osdEventService.updateClaims(this.claimsForm.value).subscribe({
    //   next: () => {
    //     this.snackBar.open('Claim records updated successfully.', 'Close', { duration: 3000 });
    //   },
    //   error: (error: any) => {
    //     console.error('Error updating claim records:', error);
    //     this.snackBar.open('Error updating claim records.', 'Close', { duration: 3000 });
    //   }
    // });
  }
}
