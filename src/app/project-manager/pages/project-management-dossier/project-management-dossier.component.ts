import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';
import { TranslateService } from '@ngx-translate/core';
import { Project } from '../../Models/project';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ResponseToPerformanceFreeProfessional } from '../../Models/responseToperformanceFreeProfessional';
import { showPerformance } from '../../Models/showPerformance';
import { PerformanceFreeProfessional } from '../../Models/performanceFreeProfessional';

@Component({
  selector: 'app-project-management-dossier',
  templateUrl: './project-management-dossier.component.html',
  styleUrls: ['./project-management-dossier.component.css']
})

export class ProjectManagementDossierComponent implements OnDestroy {
  isModalOpen = false;
  readOnly: boolean = true;
  formProjectManager: FormGroup
  showOptions: boolean = false;
  performancesFreeProfessional: PerformanceFreeProfessional[] = [];
  performancesBuy: PerformanceBuy[] = [];
  performances: showPerformance[] = [];
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  isUser: boolean = false;
  isAdmin: boolean = false;
  emptyPerformance!: PerformanceBuy
  allPerformances: any[] = [];
  displayedItems: any[] = [];
  amountProject: number = 0;
  openSideBar: boolean = true;
  Projects$: Observable<Project[]> = this.osdDataService.ProjectsList$;
  selectedProject!: Project | undefined;
  allProjects!: Project[];
  loadProjectManager: boolean = true
  showModalSubPerformance: boolean = false;
  subPerformance!: ResponseToPerformanceFreeProfessional[];

  constructor(private router: Router, private store: Store, private formBuilder: FormBuilder,
    private osdDataService: OSDDataService, private osdEventService: OSDService,
    private translate: TranslateService, private authService: AuthenticationService,
    private datePipe: DatePipe) {
    this.formProjectManager = this.createForm({} as Project);
  }

  async ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())

      this.osdEventService.GetProjects();
      var user = this.authService.userInfo;
      if (user) {
        this.isUser = true
        if (user.Isadmin) {
          this.isAdmin = true;
        }
      }
    }, 0);

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

  private createForm(project: Project): FormGroup {
    const form = this.formBuilder.group({
      startDate: (project.StartDate ?? 0),
      endDate: '',
      projectAmount: '€ ' + this.amountProject,
      expensesEmployeesVolunteers: '€ 0',
      supplierExpensesPurchases: '€ 0',
      economicBudget: '€' + (project.EconomicBudget ?? 0),
      expectedTimes: (project.ExpectedHours ?? 0) + ' ' + this.translate.instant('Hours')
    });
    return form;
  }

  sumHours(hoursObject: any): string {
    let totalHours = 0;
    for (const prop in hoursObject) {
      if (hoursObject.hasOwnProperty(prop)) {

        const [hoursStr, minutesStr] = hoursObject[prop].split(':');
        const hours = parseInt(hoursStr, 10);

        totalHours += hours;
      }
    }

    return `${totalHours} ${this.translate.instant('Hours')}`;
  }

  showOptionsPerformance() {
    this.showOptions = !this.showOptions;
  }

  cleanPerformance() {
    this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: this.emptyPerformance }))
  }

  // chargePerformanceFP(performanceId: any) {
  //   var performance = this.performancesFreeProfesional.find(item => item.Id === performanceId);
  //   this.osdDataService.setPerformance(performance)
  // }

  // selectPerformance(id: string) {
  //   var performance = this.performancesBuys.find(item => item.Id === id);
  //   this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: performance }))
  // }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 10) {
    this.performances.slice(startIndex, endIndex);
  }

  toggleSideBar() {
    this.openSideBar = !this.openSideBar;
  }

  selectProject(event: Event): void {
    this.loadProjectManager = true;
    const id = (event.target as HTMLSelectElement).value;
    setTimeout(() => {
      this.allProjects.forEach(element => {
        if (element.Id === id) {
          this.formProjectManager = this.createForm(element);
          this.store.dispatch(PerformanceActions.setProjecTManagerId({ projectManagerId: element.Id }))
          this.osdEventService.getPerformancesProjectManagerById(id)
          this.loadPerformance();
        }
      });
    }, 0);
  }

  async loadProjects(): Promise<void> {
    this.loadProjectManager = false;
    try {
      this.allProjects = await firstValueFrom(this.Projects$);
      this.loadProjectManager = false;
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  loadPerformance() {
    this.loadProjectManager = true;
    setTimeout(() => {
      this.osdDataService.performanceFreeProfessionalList$.subscribe(performance => {
        this.performances = performance;
        this.performances.forEach(pf =>{
          pf.Type = "Performance Free Professional"
        })
        this.performancesFreeProfessional = performance;
      })
      this.osdDataService.performanceBuyList$.subscribe(performance => {
        this.performancesBuy = performance;
      });

      this.loadProjectManager = false;
      this.updateDisplayedItems()
    }, 0);
  }

  openModal() {
    this.isModalOpen = true;
  }

  viewSubPerformances(performanceId: string) {
    setTimeout(() => {
      this.showModalSubPerformance = true
      this.osdEventService.GetSubPerformanceById(performanceId)
    }, 0);

    this.osdDataService.SubPerformanceByIdList$.subscribe(subPerformances => {
      this.subPerformance = subPerformances;
    });
  }

  closeModal() {
    this.showModalSubPerformance = false
  }

  filterPerformance(type: string) {
    console.log(type);
    if (type === 'buy') { 
      this.performances = this.performancesBuy;
      this.performances.forEach(pf =>{
        pf.Type = "Performance Buy"
      })
    } else {
      console.log(this.performancesFreeProfessional);
      this.performances = this.performancesFreeProfessional;
      this.performances.forEach(pf =>{
        pf.Type = "Performance Free Professional"
      })
    }
  }
  
}
