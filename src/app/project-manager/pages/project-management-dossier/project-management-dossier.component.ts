import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';
import { TranslateService } from '@ngx-translate/core';
import { Project } from '../../Models/project';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ResponseToPerformanceFreeProfessional } from '../../Models/responseToperformanceFreeProfessional';
import { showPerformance } from '../../Models/showPerformance';
import { PerformanceFreeProfessional } from '../../Models/performanceFreeProfessional';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-management-dossier',
  templateUrl: './project-management-dossier.component.html',
  styleUrls: ['./project-management-dossier.component.css']
})
export class ProjectManagementDossierComponent implements OnDestroy {
  isModalOpen = false;
  readOnly: boolean = true;  // This property is no longer used for the sidebar fields.
  user: any;
  formProjectManager: FormGroup;
  showOptions: boolean = false;
  performancesFreeProfessional: PerformanceFreeProfessional[] = [];
  performancesBuy: PerformanceBuy[] = [];
  performances: showPerformance[] = [];
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);
  isUser: boolean = false;
  isAdmin: boolean = false;
  emptyPerformance!: PerformanceBuy;
  allPerformances: any[] = [];
  displayedItems: any[] = [];
  amountProject: number = 0;
  openSideBar: boolean = true;
  Projects$: Observable<Project[]> = this.osdDataService.ProjectsList$;
  selectedProject!: Project | undefined;
  allProjects!: Project[];
  loadProjectManager: boolean = true;
  showModalSubPerformance: boolean = false;
  subPerformance!: ResponseToPerformanceFreeProfessional[];
  validatseCreatePerformance: boolean = false;
  projectSelected: string = "";

  constructor(
    private router: Router,
    private store: Store,
    private formBuilder: FormBuilder,
    private osdDataService: OSDDataService,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
  ) {
    this.formProjectManager = this.createForm({} as Project);
  }

  async ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());

      this.osdEventService.GetProjects();
      this.user = this.authService.userInfo;
      if (this.user) {
        if (this.user.isadmin) {
          this.isAdmin = true;
          this.showOptionsPerformance();
        } else {
          this.isUser = true;
        }
      }
    }, 0);

    this.Projects$.subscribe(projects => {
      this.allProjects = projects;
      this.loadProjectManager = false;
    });
  }

  viewPerformance(performance: any) {
    this.store.dispatch(PerformanceActions.setPerformanceFreeProfessional({ performanceFreeProfessional: performance }));
    this.router.navigate(['/project-manager/create-performances']);
  }

  viewPerformanceBuy(performance: any) {
    this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: performance }));
    this.router.navigate(['/project-manager/create-performances-buy']);
  }

  viewSubPerformance(subPerformance: any) {
    const performance: PerformanceFreeProfessional | undefined = this.performancesFreeProfessional.find(performance => performance.Id == subPerformance.PerformanceId);
    if (performance) {
      this.store.dispatch(PerformanceActions.setPerformanceFreeProfessional({ performanceFreeProfessional: performance }));
      this.store.dispatch(PerformanceActions.setSubPerformance({ subPerformance: subPerformance }));
      this.router.navigate(['/project-manager/response-to-performance']);
    }
  }

  createNewPerformanceFP() {
    this.store.dispatch(PerformanceActions.setProjectSelected({ projectSelected: this.projectSelected }));
    this.router.navigate(['/project-manager/create-performances']);
  }

  createNewPerformancePurchase() {
    this.store.dispatch(PerformanceActions.setProjectSelected({ projectSelected: this.projectSelected }));
    this.router.navigate(['/project-manager/create-performances-buy']);
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
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createForm(project: Project): FormGroup {
    const form = this.formBuilder.group({
      startDate: project.startdate ? new Date(project.startdate).toISOString().split('T')[0] : '',
      endDate: project.enddate ? new Date(project.enddate).toISOString().split('T')[0] : '',
      economicBudget: '€' + (project.economic_budget ?? 0),
      expectedTimes: (project.expected_hours ?? 0) + ' ' + this.translate.instant('Hours'),
      projectID: project.id,
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
      const project = this.allProjects.find(element => element.id === id);
      if (project) {
        this.formProjectManager = this.createForm(project);
        this.store.dispatch(PerformanceActions.setProjecTManagerId({ projectManagerId: project.id }));
        this.projectSelected = project.id;
        this.osdEventService.getPerformancesProjectManagerById(id);
        this.loadPerformance();
        this.openSideBar = false;
      }
    }, 0);
  }

  loadPerformance() {
    this.loadProjectManager = true;
    setTimeout(() => {
      this.osdDataService.performanceFreeProfessionalList$.pipe(take(1)).subscribe(performanceFree => {
        this.performancesFreeProfessional = performanceFree;
        this.performancesFreeProfessional.forEach(pf => pf.Type = "Performance Free Professional");

        this.osdDataService.performanceBuyList$.pipe(take(1)).subscribe(performanceBuy => {
          this.performancesBuy = performanceBuy;
          this.performancesBuy.forEach(pb => pb.Type = "Performance Buy");

          this.performances = [...this.performancesFreeProfessional, ...this.performancesBuy];
          this.loadProjectManager = false;
          this.updateDisplayedItems();
        });
      });
    }, 0);
  }

  openModal() {
    this.isModalOpen = true;
  }

  viewSubPerformances(performanceId: string) {
    setTimeout(() => {
      this.showModalSubPerformance = true;
      this.osdEventService.GetSubPerformanceById(performanceId);
    }, 0);

    this.osdDataService.SubPerformanceByIdList$.subscribe(subPerformances => {
      this.subPerformance = subPerformances;
    });
  }

  closeModal() {
    this.showModalSubPerformance = false;
  }

  filterPerformance(type: string) {
    if (type === 'buy') {
      this.performances = this.performancesBuy;
      this.performances.forEach(pf => {
        pf.Type = "Performance Buy";
      });
    } else {
      this.performances = this.performancesFreeProfessional;
      this.performances.forEach(pf => {
        pf.Type = "Performance Free Professional";
      });
    }
  }

  // New updateProjectDetails function
  updateProjectDetails() {
    const updatedProjectData = this.formProjectManager.value;
    // Call the osdEventService to update the project details.
    this.osdEventService.updateProjectDetails(updatedProjectData)
      .subscribe(response => {
        console.log('Project details updated successfully', response);
        this.snackBar.open('Project details updated successfully', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }, error => {
        console.error('Error updating project details', error);
      });
  }

  deletePerformance(pf: any) {
    console.log('Deleting performance', pf);
    const performanceId = pf.id;
    this.osdEventService.deletePerformance(performanceId)
      .subscribe(response => {
        console.log('Performance deleted successfully', response);
        this.snackBar.open('Performance deleted successfully', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }, error => {
        console.error('Error deleting performance', error);
      });
  }

  deleteProject() {
    this.osdEventService.deleteProject(this.formProjectManager.value.projectID)
      .subscribe(response => {
        console.log('Project deleted successfully', response);
        this.snackBar.open('Project deleted successfully', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }, error => {
        console.error('Error deleting project', error);
      });
  }
}
