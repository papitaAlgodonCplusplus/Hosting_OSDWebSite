import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-project-management-dossier',
  templateUrl: './project-management-dossier.component.html',
  styleUrls: ['./project-management-dossier.component.css']
})
export class ProjectManagementDossierComponent implements OnDestroy {

  readOnly: boolean = true;
  formProjectManager: FormGroup
  showOptions: boolean = false;
  performancesFreeProfesional: any[] = [];
  performancesBuys: any[] = [];

  constructor(private router: Router, private store: Store, private formBuilder: FormBuilder, private osdDataService: OSDDataService) {
    this.formProjectManager = this.createForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);

    this.osdDataService.performanceFreeProfessionalList$.subscribe(performancesFP => {
      this.performancesFreeProfesional = performancesFP;
    });

    this.osdDataService.performanceBuyList$.subscribe(performancesBuy => {
      this.performancesBuys = performancesBuy;
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      projectAmount: [''],
      expensesEmployeesVolunteers: [''],
      supplierExpensesPurchases: ['']
    });
    return form;
  }

  showOptionsPerformance() {
    this.showOptions = !this.showOptions;
  }
}
