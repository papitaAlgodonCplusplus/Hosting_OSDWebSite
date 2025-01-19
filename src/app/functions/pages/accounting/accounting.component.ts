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
  courses: any[] = [];
  user: any;

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
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userInfo;
    this.fetchCourseCost();
    this.fetchAccountingData();
  }

  get accountingEntries(): FormArray {
    return this.accountingForm.get('accountingEntries') as FormArray;
  }

  fetchCourseCost(): void {
    this.OSDEventService.getCourseByUserId(this.user.Id).subscribe({
      next: (response: any) => {
        const courses = response.Body?.courses || [];
        this.courses = courses;
        const totalCost = courses.reduce((sum: number, course: any) => sum + (course.cost || 0), 0);
        this.budgetForm.patchValue({ pricePerStudent: totalCost });
        this.calculateBudget();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Error fetching course costs:', error);
      }
    });
  }

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
            status: [student.status || 'Pendiente', Validators.required]
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

  get distribution() {
    // default to 'presencial' if there's no mode or no courses
    const mode = this.courses[0]?.mode || 'presencial';
  
    if (mode === 'presencial') {
      // OSD=10%, Professor=80%, CFH=10%
      return { osdPerc: 10, profPerc: 80, cfhPerc: 10 };
    } else {
      // OSD=30%, Professor=40%, CFH=30%
      return { osdPerc: 30, profPerc: 40, cfhPerc: 30 };
    }
  }

  calculateBudget(): void {
    const pricePerStudent = +this.budgetForm.value.pricePerStudent || 0;
    const otherExpenses = +this.budgetForm.value.otherExpenses || 0;
    let courseMode = this.courses[0]?.mode || 'presencial'; 
    const numberOfStudents = this.accountingEntries.length;
    const totalIncome = pricePerStudent * numberOfStudents;
    
    let osdFee = 0;
    let professorExpenses = 0;
    let cfhPortion = 0;
    if (courseMode === 'presencial') {
      osdFee = totalIncome * 0.10;
      professorExpenses = totalIncome * 0.80;
      cfhPortion = totalIncome * 0.10;
    } else {
      osdFee = totalIncome * 0.30;
      professorExpenses = totalIncome * 0.40;
      cfhPortion = totalIncome * 0.30;
    }
  
    let netProfit = cfhPortion - otherExpenses;
    netProfit = Math.max(0, netProfit);
    this.budgetForm.patchValue({
      totalIncome: totalIncome.toFixed(2),
      professorExpenses: professorExpenses.toFixed(2),
      osdFee: osdFee.toFixed(2),
      netProfit: netProfit.toFixed(2)
    });
  }
}
