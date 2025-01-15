import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OSDService } from 'src/app/services/osd-event.services';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-student-record',
  templateUrl: './student-record.component.html',
  styleUrls: ['./student-record.component.css']
})
export class StudentRecordComponent implements OnInit {
  studentForm: FormGroup;
  isErrorInForm: boolean = false;
  user: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private OSDEventService: OSDService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      students: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userInfo;
    this.fetchStudentsForCourse();
  }

  get students(): FormArray {
    return this.studentForm.get('students') as FormArray;
  }

  // Populate the form fields with the fetched student data
  fetchStudentsForCourse(): void {
    this.OSDEventService.getStudentsByCourse(this.user.Id).subscribe({
      next: (response: any) => {
        let students = response.Body?.students || [];
        if (!Array.isArray(students)) {
          console.warn('⚠️ Warning: students is not an array, converting to an array');
          students = [students];
        }
        students.forEach((student: any) => {
          console.log('Student:', student);
          const studentGroup = this.fb.group({
            name: [student.name || '', Validators.required],
            attendance: [student.assistance ?? '', [Validators.required, Validators.min(0), Validators.max(100)]],
            grade: [student.calification || '', Validators.required],
            status: [student.status || 'Pendiente', Validators.required]
          });
          this.students.push(studentGroup);
        });
      },
      error: (error) => {
        console.error('❌ Error fetching students:', error);
      }
    });
  }

  removeStudent(index: number): void {
    this.students.removeAt(index);
  }


  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.isErrorInForm = true;

      // Show error notification
      this.snackBar.open('⚠️ Por favor, completa todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'left',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isErrorInForm = false;

    this.OSDEventService.updateStudentRecords(this.studentForm.value).subscribe({
      next: () => {
        // Show success notification
        this.snackBar.open('✅ Registro de alumnos actualizado con éxito.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('❌ Error updating student records:', error);

        // Show error notification
        this.snackBar.open('❌ Error al actualizar el registro de alumnos.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
