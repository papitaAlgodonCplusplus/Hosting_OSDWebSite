import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OSDService } from 'src/app/services/osd-event.services';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-record',
  templateUrl: './student-record.component.html',
  styleUrls: ['./student-record.component.css']
})
export class StudentRecordComponent implements OnInit {
  studentForm: FormGroup;
  filterForm: FormGroup;
  isErrorInForm: boolean = false;
  user: any;

  // Dropdown arrays for filtering – these should be built from your student data
  studentNameDropdown: any[] = [];
  courseNameDropdown: any[] = [];
  modalityDropdown: any[] = [];
  cfhDropdown: any[] = [];

  // Hold all fetched students (raw data) so we can filter from it
  allStudents: any[] = [];
  // Also store the filtered students for later use (optional)
  filteredStudents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private OSDEventService: OSDService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    // Initialize the student form (with additional readOnly fields)
    this.studentForm = this.fb.group({
      students: this.fb.array([])
    });

    // Initialize the filter form with controls for each dropdown filter
    this.filterForm = this.fb.group({
      studentName: [''],
      courseName: [''],
      modality: [''],
      cfh: ['']
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userInfo;
    this.fetchStudentsForCourse();
  }

  // Convenience getter for the FormArray of student records
  get students(): FormArray {
    return this.studentForm.get('students') as FormArray;
  }

  // Fetch and populate student data; we expect each student object to include properties:
  // - name
  // - course_name: a string like "CourseName (CFH)"
  // - modality
  // - attendance, grade, status, etc.
  fetchStudentsForCourse(): void {
    this.OSDEventService.getStudentsByCourse(this.user.Id).subscribe({
      next: (response: any) => {
        let students = response.Body?.students || [];
        if (!Array.isArray(students)) {
          console.warn('⚠️ Warning: students is not an array, converting to an array');
          students = [students];
        }
        // Save the raw data for filtering
        this.allStudents = students;
        // Initially, all students are displayed
        this.filteredStudents = [...students];
        // Build the FormArray from all students
        this.buildStudentFormArray(this.filteredStudents);
        // Build dropdown options for filtering
        this.populateFilterDropdowns(students);
      },
      error: (error) => {
        console.error('❌ Error fetching students:', error);
      }
    });
  }

  // Rebuild the FormArray using a given array of student objects.
  buildStudentFormArray(studentsArray: any[]): void {
    this.students.clear();
    studentsArray.forEach((student: any) => {
      // Extract course name and CFH from course_name
      let courseNamePart = '';
      let cfhPart = '';
      if (student.course_name && student.course_name.indexOf('(') >= 0) {
        const parts = student.course_name.split('(');
        courseNamePart = parts[0].trim();
        cfhPart = parts[1].replace(')', '').trim();
      }
      const studentGroup = this.fb.group({
        cfh: [{ value: student.cfh || cfhPart, disabled: true }], // use student.cfh if available; else the extracted CFH
        name: [{ value: student.name || '', disabled: true }, Validators.required],
        courseName: [{ value: student.courseName || courseNamePart, disabled: true }],
        modality: [{ value: student.modality || '', disabled: true }],
        attendance: [student.assistance ?? '', [Validators.required, Validators.min(0), Validators.max(100)]],
        grade: [student.calification || '', Validators.required],
        status: [student.status || 'Pendiente', Validators.required]
      });
      this.students.push(studentGroup);
    });
  }

  // Build dropdown options from the fetched student data.
  populateFilterDropdowns(students: any[]): void {
    // Student Name options
    const uniqueStudentNames = [...new Set(students.map(s => s.name))].filter(name => name).sort();
    this.studentNameDropdown = uniqueStudentNames.map(name => ({
      key: name,
      value: name
    }));

    // Course Name options: extract the part before '('
    const uniqueCourseNames = [...new Set(students.map(s => {
      if (s.course_name) {
        return s.course_name.split('(')[0].trim();
      }
      return '';
    }))].filter(name => name).sort();
    this.courseNameDropdown = uniqueCourseNames.map(name => ({
      key: name,
      value: name
    }));

    // Modality options
    const uniqueModalities = [...new Set(students.map(s => s.modality))].filter(mod => mod).sort();
    this.modalityDropdown = uniqueModalities.map(mod => ({
      key: mod,
      value: mod
    }));

    // CFH options: extract the part inside parentheses
    const uniqueCFH = [...new Set(students.map(s => {
      if (s.course_name && s.course_name.indexOf('(') >= 0) {
        return s.course_name.split('(')[1].replace(')', '').trim();
      }
      return '';
    }))].filter(cfh => cfh).sort();
    this.cfhDropdown = uniqueCFH.map(cfh => ({
      key: cfh,
      value: cfh
    }));
  }

  // Clear the filter form and re-fetch student records
  clearStudentFilters(): void {
    this.filterForm.reset({
      studentName: '',
      courseName: '',
      modality: '',
      cfh: ''
    });
    // Reset filteredStudents to allStudents and rebuild the FormArray
    this.filteredStudents = [...this.allStudents];
    this.buildStudentFormArray(this.filteredStudents);
  }

  // Implement the filterStudents function.
  // We use the filterForm values and compare them to the corresponding fields.
  filterStudents(): void {
    const { studentName, courseName, modality, cfh } = this.filterForm.value;

    const filtered = this.allStudents.filter(student => {
      // Check student name (case-insensitive, substring matching)
      const matchesStudentName = !studentName ||
        (student.name && student.name.toLowerCase().includes(studentName.toLowerCase()));

      // For course name and CFH, extract parts from student.course_name
      let courseNamePart = '';
      let cfhPart = '';
      if (student.course_name && student.course_name.indexOf('(') >= 0) {
        const parts = student.course_name.split('(');
        courseNamePart = parts[0].trim();
        cfhPart = parts[1].replace(')', '').trim();
      }

      const matchesCourseName = !courseName ||
        (courseNamePart && courseNamePart.toLowerCase() === courseName.toLowerCase());
      const matchesCFH = !cfh ||
        (cfhPart && cfhPart.toLowerCase() === cfh.toLowerCase());

      // Check modality (case-insensitive)
      const matchesModality = !modality ||
        (student.modality && student.modality.toLowerCase() === modality.toLowerCase());

      return matchesStudentName && matchesCourseName && matchesCFH && matchesModality;
    });

    // Update the filteredStudents array and rebuild the form array.
    this.filteredStudents = filtered;
    this.buildStudentFormArray(this.filteredStudents);
    console.log("Filtered Students:", filtered);
  }

  removeStudent(index: number): void {
    const studentControl = this.students.at(index).get('name');
    const student_name = studentControl ? studentControl.value : '';
    this.students.removeAt(index);
    this.OSDEventService.deleteStudentRecord(student_name).subscribe({
      complete: () => {},
      error: (error: any) => {
        console.error('❌ Error deleting student record:', error);
        this.snackBar.open('❌ Error al eliminar el registro del alumno.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.snackBar.open('⚠️ Por favor, completa todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'left',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.OSDEventService.updateStudentRecords(this.studentForm.value).subscribe({
      complete: () => {
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('❌ Error updating student records:', error);
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
