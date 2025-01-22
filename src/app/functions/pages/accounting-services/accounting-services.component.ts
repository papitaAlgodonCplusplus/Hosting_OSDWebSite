import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OSDService } from 'src/app/services/osd-event.services';

@Component({
  selector: 'app-accounting-services',
  templateUrl: './accounting-services.component.html',
  styleUrls: ['./accounting-services.component.css']
})

export class AccountingServicesComponent implements OnInit {
  incomes: any[] = [];
  purchases: any[] = [];
  totalIncomeByStudents: number = 0;
  totalProfessorExpenses: number = 0;
  totalSavedMoney: number = 0;
  totalReferralCommission: number = 0;

  serviceDetails = [
    {
      serviceName: 'Curso de Desarrollo Web',
      total: 5000,
      description: 'Curso avanzado para aprender desarrollo web moderno.',
      income: 5000,
      expense: 1000,
      expanded: false,
    },
    {
      serviceName: 'Consultoría Profesional',
      total: 2500,
      description: 'Servicios de consultoría personalizada para empresas.',
      income: 2500,
      expense: 500,
      expanded: false,
    },
  ];

  constructor(
    private osdEventService: OSDService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchIncomes();
    this.fetchPurchases();
    this.fetchServiceDetails();
    this.calculateAdditionalMetrics();
  }

  fetchIncomes(): void {
    this.osdEventService.getIncomes().subscribe(
      (response: any) => {
        this.incomes = response || [];
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching incomes:', error);
      }
    );
  }
  
  fetchPurchases(): void {
    this.osdEventService.getPurchases().subscribe(
      (response: any) => {
        this.purchases = response || [];
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching purchases:', error);
      }
    );
  }

  fetchServiceDetails(): void {
    this.osdEventService.getServiceDetails().subscribe(
      (response: any) => {
        this.serviceDetails = response || [];
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching service details:', error);
      }
    );
  }

  calculateAdditionalMetrics(): void {
    // Mock data for students and courses
    const studentsPerCourse = 20; // Example number of students per course
    const coursePrice = 200; // Example price per course

    this.totalIncomeByStudents = studentsPerCourse * this.serviceDetails.length * coursePrice;
    this.totalProfessorExpenses = this.totalIncomeByStudents * 0.8; // 80% of income goes to professors

    // Calculate saved money and referral commission
    this.totalSavedMoney = Math.max(this.totalIncomeByStudents * 0.1, 10); // 10% or minimum of 10 EUR
    this.totalReferralCommission = this.totalSavedMoney * 0.1; // 10% referral commission

    this.cdr.detectChanges();
  }

  toggleExpandCollapse(item: any): void {
    item.expanded = !item.expanded;
  }
}
