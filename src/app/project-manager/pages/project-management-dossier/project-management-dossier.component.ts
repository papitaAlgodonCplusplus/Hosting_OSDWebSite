import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';

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
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  showButton: boolean = true;
  emptyPerformance!: PerformanceBuy
  allPerformances: any[] = [];
  minDate!: Date;
  constructor(private router: Router, private store: Store, private formBuilder: FormBuilder,
    private osdDataService: OSDDataService, private osdEventService: OSDService) {
    this.formProjectManager = this.createForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
      this.osdEventService.getPerformanceList();
      this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated === false) {
          this.showButton = false
        }
      });

      this.osdDataService.performanceFreeProfessionalList$.subscribe(performancesFP => {
        this.performancesFreeProfesional = performancesFP;
      });

      this.osdDataService.performanceBuyList$.subscribe(performancesBuy => {
        this.performancesBuys = performancesBuy;
      });
    }, 0);

    setTimeout(() => {
      let normalizedBuys = this.performancesBuys.map(buy => ({
        Id: buy.Id,
        Date: buy.Date,
        JustifyingDocument: buy.JustifyingDocument,
        Summary: buy.Summary,
        Hours: "-",
        Amount: "-",
        Type: "Compra"
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

  cleanPerformance() {
    this.store.dispatch(PerformanceActions.setPerformance({ performance: this.emptyPerformance }))
  }

  chargePerformanceFP(performance: any) {
    this.osdDataService.setPerformance(performance)
    console.log('El performance que se quiere mostrar', performance)
  }

  selectPerformance(id: string) {
    var performance = this.performancesBuys.find(item => item.Id === id);
    this.store.dispatch(PerformanceActions.setPerformance({ performance: performance }))
  }
}
