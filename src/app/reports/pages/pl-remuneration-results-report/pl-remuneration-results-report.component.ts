import { Component } from '@angular/core';
import { PLRemunerationResultsItems } from '../../interface/plRemunerationResultsItems.interface';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pl-remuneration-results-report',
  templateUrl: './pl-remuneration-results-report.component.html',
  styleUrls: ['./pl-remuneration-results-report.component.css'],
})
export class PLRemunerationResultsReportComponent {
  totalItems: number = 0; 
  itemsPerPage: number = 1; 
  currentPage: number = 1;

  fpFullNames: any[] = [];
  hoursPerformances: any[] = [];
  summationFiles: any[] = [];
  summationPerformances: any[] = [];
  formationCost: any[] = [];
  displayedFpFullNames: any[] = [];
  displayedHoursPerformances: any[] = [];
  displayedSummationFiles: any[] = [];
  displayedSummationPerformances: any[] = [];
  displayedFormationCost: any[] = [];
  
  datos : PLRemunerationResultsItems[] =[{
    plInfo: {
      name: 'Jaen Carlo',
      apellidos: 'Gonzalez Arauz'
    },
    certificado: {
      total: 10,
      resultados: 5
    },
    externalizacion: {
      total: 20,
      resultados: 15
    },
    formacion: {
      total: 30,
      resultados: 25
    },
    primaComercial: {
      total: 40,
      resultados: 35
    },
    retribucion: {
      total: 50,
      resultados: 45
    }
  }]


  constructor(
    private store: Store,
    private osdService: OSDService,
    private osdDataService: OSDDataService
  ) {}

  ngOnInit(): void {
    this.osdService.GetTransparencyFreeProfessionals();
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
    this.assignData();
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  assignData(){
    this.osdDataService.FpFullNames$.subscribe(item => {
      this.fpFullNames = item;
      this.totalItems = item.length;
    })
    this.osdDataService.HoursPerformances$.subscribe(item => {
      this.hoursPerformances = item;
    })
    this.osdDataService.SummationFiles$.subscribe(item => {
      this.summationFiles = item;
    })
    this.osdDataService.SummationPerformances$.subscribe(item => {
      this.summationPerformances = item;
    })
    this.osdDataService.FormationCost$.subscribe(item => {
      this.formationCost = item;
      this.updateDisplayedItems(0, 1);
    })
  }
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }
  
  updateDisplayedItems(startIndex: number, endIndex: number) {
    console.log("start",startIndex,"end",endIndex)
    this.displayedFpFullNames = this.fpFullNames.slice(startIndex, endIndex);
    this.displayedHoursPerformances = this.hoursPerformances.slice(startIndex, endIndex);
    this.displayedSummationFiles = this.summationFiles.slice(startIndex, endIndex);
    this.displayedSummationPerformances = this.summationPerformances.slice(startIndex, endIndex);
    this.displayedFormationCost = this.formationCost.slice(startIndex, endIndex);
  }
}
