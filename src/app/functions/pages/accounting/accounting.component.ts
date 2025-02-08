import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OSDService } from 'src/app/services/osd-event.services';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit {
  accountingForm: FormGroup;
  budgetForm: FormGroup;
  // New filter form for course filtering (Course Name and Modality)
  filterForm: FormGroup;

  courses: any[] = [];             // All courses fetched from backend
  filteredCourses: any[] = [];       // Courses after applying filters
  user: any;

  // Dropdown options for filtering
  courseOptions: any[] = [];         // e.g. [{ value: '', key: 'Todos' }, { value: 'Curso A', key: 'Curso A' }, ...]
  modalityOptions: any[] = [];       // e.g. [{ value: '', key: 'Todos' }, { value: 'presencial', key: 'presencial' }, { value: 'online', key: 'online' }]

  constructor(
    private fb: FormBuilder,
    private OSDEventService: OSDService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {
    this.accountingForm = this.fb.group({
      accountingEntries: this.fb.array([])
    });

    this.budgetForm = this.fb.group({
      pricePerStudent: [{ value: 0, disabled: true }],
      otherExpenses: [{ value: 0, disabled: true }],
      professorExpensesPercentage: [{ value: 35, disabled: true }],
      totalIncome: [{ value: 0, disabled: true }],
      professorExpenses: [{ value: 0, disabled: true }],
      osdFee: [{ value: 0, disabled: true }],
      netProfit: [{ value: 0, disabled: true }]
    });

    // Create a filter form with two controls: one for course name and one for modality.
    this.filterForm = this.fb.group({
      selectedCourse: [''],
      selectedModality: ['']
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userInfo;
    this.fetchCourseCost();
    this.fetchAccountingData();
  }

  // Convenience getter for the FormArray of accounting entries
  get accountingEntries(): FormArray {
    return this.accountingForm.get('accountingEntries') as FormArray;
  }

  // Fetch courses (and their costs) for the current user.
  fetchCourseCost(): void {
    this.OSDEventService.getCourseByUserId(this.user.Id).subscribe({
      next: (response: any) => {
        const courses = response.Body?.courses || [];
        this.courses = courses;
        // Initially, no filters are applied so the filtered list equals the full list.
        this.filteredCourses = [...courses];

        // Build dropdown options for course names.
        const titles = Array.from(new Set(courses.map((course: any) => course.title)));
        this.courseOptions = [{ value: '', key: 'Todos' }, ...titles.map(title => ({ value: title, key: title }))];

        // Build dropdown options for modalities.
        const modalities = Array.from(new Set(courses.map((course: any) => course.mode)));
        this.modalityOptions = [{ value: '', key: 'Todos' }, ...modalities.map(mod => ({ value: mod, key: mod }))];

        // For the "Precio Promedio por Alumno", we calculate the average cost from all courses that have students.
        // Here we wait briefly so that the accounting entries might be loaded.
        setTimeout(() => {
          let totalCost = 0;
          let courseCount = 0;
          // Loop through accounting entries and sum the cost of each course.
          this.accountingEntries.value.forEach((entry: any) => {
            console.log('entry:', entry);
            if (entry.course_id) {
              totalCost += this.getCourseCost(entry.course_id);
              courseCount++;
            }
          });
          const averageCost = courseCount > 0 ? totalCost / courseCount : 0;
          this.budgetForm.patchValue({ pricePerStudent: averageCost });
        }, 500);

        this.calculateBudget();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Error fetching course costs:', error);
      }
    });
  }

  onCancel(): void {
    // Reset filters
    this.filteredCourses = [...this.courses];
    this.filterForm.reset();
    this.calculateBudget();
    this.cdr.detectChanges();
  }

  // Fetch accounting (students) data.
  fetchAccountingData(): void {
    this.OSDEventService.getStudentsByCourse(this.user.Id).subscribe({
      next: (response: any) => {
        let students = response.Body?.students || [];
        if (!Array.isArray(students)) {
          students = [students];
        }
        this.accountingEntries.clear();
        students.forEach((student: any) => {
          const studentGroup = this.fb.group({
            name: [student.name || '', Validators.required],
            attendance: [student.assistance ?? '', [Validators.required, Validators.min(0), Validators.max(100)]],
            grade: [student.calification || '', Validators.required],
            status: [student.status || 'Pendiente', Validators.required],
            course_id: [student.course_id || '', Validators.required],
            course_name: [student.course_name || '', Validators.required]
          });
          this.accountingEntries.push(studentGroup);
        });
        this.calculateBudget();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error fetching accounting data:', error);
      }
    });
  }

  // Getter to return the current distribution percentages.
  // These depend on the mode of the first course in the filtered list.
  get distribution() {
    const mode = this.filteredCourses[0]?.mode || 'presencial';
    if (mode === 'presencial') {
      return { osdPerc: 10, profPerc: 80, cfhPerc: 10 };
    } else {
      return { osdPerc: 30, profPerc: 40, cfhPerc: 30 };
    }
  }

  // Calculate the budget based on filtered courses and student data.
  calculateBudget(): void {
    const otherExpenses = +this.budgetForm.value.otherExpenses || 0;
    const courseMode = this.filteredCourses[0]?.mode || 'presencial';
    let totalIncome = 0;
    // Only iterate over filtered courses.
    this.filteredCourses.forEach(course => {
      const studentsInCourse = this.accountingEntries.controls.filter(entry => entry.value.course_id === course.id).length;
      totalIncome += studentsInCourse * (+course.cost || 0);
    });

    let osdFee = 0;
    let professorExpenses = 0;
    let cfhPortion = 0;

    if (courseMode === 'presencial') {
      osdFee = totalIncome * 0.10;         // 10%
      professorExpenses = totalIncome * 0.80;  // 80%
      cfhPortion = totalIncome * 0.10;         // 10%
    } else {
      osdFee = totalIncome * 0.30;         // 30%
      professorExpenses = totalIncome * 0.40;  // 40%
      cfhPortion = totalIncome * 0.30;         // 30%
    }

    let netProfit = 0;
    if (this.user.AccountType === "FreeProfessional") {
      netProfit = professorExpenses - otherExpenses;
    } else {
      netProfit = cfhPortion - otherExpenses;
    }
    netProfit = Math.max(0, netProfit);
    this.budgetForm.patchValue({
      totalIncome: totalIncome.toFixed(2),
      professorExpenses: professorExpenses.toFixed(2),
      osdFee: osdFee.toFixed(2),
      netProfit: netProfit.toFixed(2)
    });
  }

  // Called whenever either filter (course or modality) changes.
  onFilterChange(): void {
    const selectedCourse = this.filterForm.value.selectedCourse;
    const selectedModality = this.filterForm.value.selectedModality;
    this.applyCourseFilters(selectedCourse, selectedModality);
    this.calculateBudget();
    this.cdr.detectChanges();
  }

  // Filters the courses array based on the selected course title and modality.
  applyCourseFilters(selectedCourse: string, selectedModality: string): void {
    this.filteredCourses = this.courses.filter(course => {
      let courseMatch = true;
      let modalityMatch = true;
      if (selectedCourse && selectedCourse.trim() !== '') {
        courseMatch = course.title === selectedCourse;
      }
      if (selectedModality && selectedModality.trim() !== '') {
        modalityMatch = course.mode === selectedModality;
      }
      return courseMatch && modalityMatch;
    });
  }

  // Returns the number of accounting entries whose course is in the filtered courses list.
  get filteredEntriesCount(): number {
    return this.accountingEntries.controls.filter(ctrl =>
      this.isEntryInFilteredCourses(ctrl.value.course_id)
    ).length;
  }


  // Helper method to get the price per student (course cost) for a given course_id.
  getCourseCost(courseId: string): number {
    const course = this.courses.find(c => c.id === courseId);
    return course ? +course.cost : 0;
  }

  // Determines if a given accounting entry should be shown based on the filtered courses.
  isEntryInFilteredCourses(courseId: string): boolean {
    return this.filteredCourses.some(course => course.id === courseId);
  }
}
