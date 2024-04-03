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

  cleanPerformance() {
    this.store.dispatch(PerformanceActions.setPerformance({ performance: this.emptyPerformance }))
  }

  selectPerformance(id: string) {
    var performance = this.performancesBuys.find(item => item.Id === id);
    this.store.dispatch(PerformanceActions.setPerformance({ performance: performance }))
  }
}
