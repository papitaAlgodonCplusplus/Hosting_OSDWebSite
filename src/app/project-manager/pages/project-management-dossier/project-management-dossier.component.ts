import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { Project } from '../../Models/project';

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
  displayedItems: any[] = [];
  amountProject: number = 0;
  openSideBar: boolean = true;
  Projects$: Observable<Project[]> = this.osdDataService.ProjectsList$;
  selectedProject!: Project | undefined;
  allProjects!: Project[];
  loadProjectManager : boolean = true

  constructor(private router: Router, private store: Store, private formBuilder: FormBuilder,
    private osdDataService: OSDDataService, private osdEventService: OSDService,
    private translate: TranslateService,
    private datePipe: DatePipe) {
    this.formProjectManager = this.createForm();
  }

  async ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
      this.osdEventService.getPerformanceList();
      this.osdEventService.GetProjects();
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
          TechnicalDirectorWorkHours: freeProfessional.TechnicalDirectorWorkHours,
          EstimatedWorkHours: freeProfessional.EstimatedWorkHours,
          EstimatedTransportHours: freeProfessional.EstimatedTransportHours
        };
        const totalHours = this.sumHours(hours);

        var amountProject = 0;
        amountProject = freeProfessional.EstimatedTransportExpenses + freeProfessional.FreeProfessionalRemuneration + freeProfessional.FreeProfessionalTravelExpenses + freeProfessional.TechnicalDirectorRemuneration + freeProfessional.TechnicalDirectorTravelExpenses
        this.amountProject = amountProject + this.amountProject

        return {
          Id: freeProfessional.Id,
          Code: 'GET/A/1/2024',
          Date: freeProfessional.Date,
          Type: freeProfessional.Type,
          JustifyingDocument: freeProfessional.JustifyingDocument,
          Summary: freeProfessional.Summary,
          Hours: totalHours,
          Amount: "€ " + amountProject
        };

      });
      this.allPerformances = [...normalizedFreeProfesional, ...normalizedBuys];
      this.updateDisplayedItems();
      this.loadProjectManager = false;
      this.sortDateLowestHighest(true);
      this.formProjectManager = this.createForm();
    }, 3000);

    await this.loadProjects();
  }

  sortDateLowestHighest(ascending: boolean = true) {
    this.allPerformances.sort((a, b) => {
      let dateA = new Date(a.Date);
      let dateB = new Date(b.Date);
      return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
    this.updateDisplayedItems();
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      startDate: (this.selectedProject?.StartDate ?? 0),
      endDate: '',
      projectAmount: '€ ' + this.amountProject,
      expensesEmployeesVolunteers: '€ 0',
      supplierExpensesPurchases: '€ 0',
      economicBudget: '€' + (this.selectedProject?.EconomicBudget ?? 0),
      expectedTimes: (this.selectedProject?.ExpectedHours ?? 0) + ' ' + this.translate.instant('Hours')
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
    return `${totalHours} ${this.translate.instant('Hours')}`;
  }


  showOptionsPerformance() {
    this.showOptions = !this.showOptions;
  }

  cleanPerformance() {
    this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: this.emptyPerformance }))
  }

  chargePerformanceFP(performanceId: any) {
    var performance = this.performancesFreeProfesional.find(item => item.Id === performanceId);
    this.osdDataService.setPerformance(performance)
  }

  selectPerformance(id: string) {
    var performance = this.performancesBuys.find(item => item.Id === id);
    this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: performance }))
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 10) {
    this.displayedItems = this.allPerformances.slice(startIndex, endIndex);
  }

  toggleSideBar() {
    this.openSideBar = !this.openSideBar;
  }

  selectProject(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.allProjects.forEach(element => {
        if (element.Id === id) {
            this.selectedProject = element;
            this.formProjectManager = this.createForm();
            this.openSideBar = true
        }
    });
}

async loadProjects(): Promise<void> {
  try {
      this.allProjects = await firstValueFrom(this.Projects$);
      this.selectedProject = this.allProjects[0];
      this.formProjectManager = this.createForm();
  } catch (error) {
      console.error('Error loading projects:', error);
  }
}

}
