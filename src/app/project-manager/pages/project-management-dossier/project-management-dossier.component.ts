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
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

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
  isUser: boolean = true;
  emptyPerformance!: PerformanceBuy
  allPerformances: any[] = [];
  startDate!: string | undefined;
  amountProject: number = 0;

  constructor(private router: Router, private store: Store, private formBuilder: FormBuilder,
    private osdDataService: OSDDataService, private osdEventService: OSDService,
    private translate: TranslateService,
    private datePipe: DatePipe) {
    this.formProjectManager = this.createForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
      this.osdEventService.getPerformanceList();
      this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated === false) {
          this.isUser = false
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
        Code: 'GET/A/1/2024',
        Date: buy.Date,
        JustifyingDocument: buy.JustifyingDocument,
        Summary: buy.Summary,
        Hours: "-",
        Amount: "-",
        Type: "-"
      }));

      let normalizedFreeProfesional = this.performancesFreeProfesional.map(freeProfessional => {
        const hours = {
          FreeProfessionalTravelHours: freeProfessional.FreeProfessionalTravelHours,
          FreeProfessionalWorkHours: freeProfessional.FreeProfessionalWorkHours,
          TechnicalDirectorTravelHours: freeProfessional.TechnicalDirectorTravelHours,
          TechnicalDirectorWorkHours: freeProfessional.TechnicalDirectorWorkHours
        };
        const totalHours = this.sumHours(hours);

        var amountProject = 0;
        amountProject = freeProfessional.FreeProfessionalRemuneration + freeProfessional.FreeProfessionalTravelExpenses + freeProfessional.TechnicalDirectorRemuneration + freeProfessional.TechnicalDirectorTravelExpenses
        console.log(amountProject)
        this.amountProject = amountProject + this.amountProject
       

        return {
          Id: freeProfessional.Id,
          Code: 'GET/A/1/2024',
          Date: freeProfessional.Date,
          Type: freeProfessional.Type,
          JustifyingDocument: freeProfessional.JustifyingDocument,
          Summary: freeProfessional.Summary,
          Hours: totalHours,
          Amount: "€ "+ amountProject
        };

      });
      this.allPerformances = [...normalizedFreeProfesional, ...normalizedBuys];
      console.log(this.allPerformances)
      this.sortDateLowestHighest(true);
    }, 1525);
  }

  sortDateLowestHighest(ascending: boolean = true) {
    const sortedPerformances = this.allPerformances.sort((a, b) => {
      let dateA = new Date(a.Date);
      let dateB = new Date(b.Date);
      return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    if (sortedPerformances.length > 0 && ascending == true) {
      const earliestDateFormatted = this.datePipe.transform(sortedPerformances[0].Date, 'yyyy-MM-dd');
      this.startDate = earliestDateFormatted?.toString();;
    }
    this.formProjectManager = this.createForm();
    return sortedPerformances;
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      startDate: this.startDate,
      endDate:'' ,
      projectAmount: '€ ' + this.amountProject,
      expensesEmployeesVolunteers: '€ 0',
      supplierExpensesPurchases: '€ 0' 
    });
    return form;
  }

  sumHours(hoursObject: any): string {
    let totalHours = 0;
    let totalMinutes = 0;
    for (const prop in hoursObject) {
      if (hoursObject.hasOwnProperty(prop)) {

        const [hoursStr, minutesStr] = hoursObject[prop].split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        totalHours += hours;
        totalMinutes += minutes;
      }
    }
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
    return `${totalHours} ${this.translate.instant('hours')}`;
  }


  showOptionsPerformance() {
    this.showOptions = !this.showOptions;
  }

  cleanPerformance() {
    this.store.dispatch(PerformanceActions.setPerformance({ performance: this.emptyPerformance }))
  }

  chargePerformanceFP(performanceId: any) {
    var performance = this.performancesFreeProfesional.find(item => item.Id === performanceId);
    this.osdDataService.setPerformance(performance)
  }

  selectPerformance(id: string) {
    var performance = this.performancesBuys.find(item => item.Id === id);
    this.store.dispatch(PerformanceActions.setPerformance({ performance: performance }))
  }
}
