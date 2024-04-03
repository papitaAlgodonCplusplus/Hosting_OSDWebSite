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
  allPerformances: any[] = [];

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
    setTimeout(() => {
      let normalizedBuys = this.performancesBuys.map(buy => ({
        Id: buy.Id,
        Date: buy.Date,
        Type: 'Compra',
        JustifyingDocument: buy.JustifyingDocument,
        Summary: buy.Summary
      }));

      this.allPerformances = [...this.performancesFreeProfesional, ...normalizedBuys];
      this.sortDateLowestHighest(false);
    }, 1525);
  }


  sortDateLowestHighest(ascending: boolean = true) {
    return this.allPerformances.sort((a, b) => {
      let dateA = new Date(a.Date);
      let dateB = new Date(b.Date);
      return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  }

  sortBySummary(ascending: boolean = true) {
    return this.allPerformances.sort((a, b) => {
        let summaryA = a.Summary.toLowerCase();
        let summaryB = b.Summary.toLowerCase();

        if (summaryA < summaryB) return ascending ? -1 : 1;
        if (summaryA > summaryB) return ascending ? 1 : -1;
        return 0;
    });
  }
  sortByType(ascending: boolean = true) {
    return this.allPerformances.sort((a, b) => {
        let typeA = a.Type.toLowerCase();
        let typeB = b.Type.toLowerCase();

        if (typeA < typeB) return ascending ? -1 : 1;
        if (typeA > typeB) return ascending ? 1 : -1;
        return 0;
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
