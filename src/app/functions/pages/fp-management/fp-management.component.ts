import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OSDService } from 'src/app/services/osd-event.services';

@Component({
  selector: 'app-fp-management',
  templateUrl: './fp-management.component.html',
  styleUrls: ['./fp-management.component.css']
})
export class FpManagementComponent implements OnInit {
  professionalForm: FormGroup;

  constructor(private fb: FormBuilder, private osdService: OSDService, private snackBar: MatSnackBar) {
    this.professionalForm = this.fb.group({
      professionals: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchProfessionals();
  }

  get professionals(): FormArray {
    return this.professionalForm.get('professionals') as FormArray;
  }
  
  fetchProfessionals(): void {
    this.osdService.GetFreeProfessionalsDataEvent();
    this.osdService.getFreeProfessionalsList().then((response: any) => {
      response.forEach((professional: any) => {
        const professionalGroup = this.fb.group({
          name: [professional.username, Validators.required],
          serviceRates: [parseFloat(professional.servicerates) || 0, Validators.required],
          type: [professional.FreeprofessionaltypeAcronym || '', Validators.required],
          cfhAssociated: [professional.usercompanyname || '', Validators.required],
          clientsReferred: [parseFloat(professional.n_refeers) || 0, Validators.required],
          totalIncome: [
            this.calculateIncome(parseFloat(professional.servicerates), parseFloat(professional.n_refeers)),
            Validators.required
          ],
          FreeprofessionaltypeAcronym: [professional.FreeprofessionaltypeAcronym || '', Validators.required]
        });
        this.professionals.push(professionalGroup);
      });
    });
  }


  calculateIncome(serviceRates: number, clientsReferred: number): number {
    const osdIncomePerExpedient = 100; // Example fixed value
    const referredIncome = clientsReferred * (osdIncomePerExpedient * 0.1);
    return (referredIncome);
  }
}
