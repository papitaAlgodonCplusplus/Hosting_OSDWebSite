import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';

export interface CFHModeDetails {
  cfhIngresos: number;
  alumnos: number;
  alumnosAprobados: number;
  beneficios: string;
}

export interface CFHresultItems {
  formadorConsultor: {
    online: CFHModeDetails;
    presencial: CFHModeDetails;
  };
  tecnicoOSD: {
    online: CFHModeDetails;
    presencial: CFHModeDetails;
  };
}

@Component({
  selector: 'app-cfhresult-report',
  templateUrl: './cfhresult-report.component.html',
  styleUrls: ['./cfhresult-report.component.css'],
})
export class CFHResultReportComponent implements OnInit, OnDestroy {
  reports: CFHresultItems = {
    formadorConsultor: {
      online: { cfhIngresos: 0, alumnos: 0, alumnosAprobados: 0, beneficios: '' },
      presencial: { cfhIngresos: 0, alumnos: 0, alumnosAprobados: 0, beneficios: '' },
    },
    tecnicoOSD: {
      online: { cfhIngresos: 0, alumnos: 0, alumnosAprobados: 0, beneficios: '' },
      presencial: { cfhIngresos: 0, alumnos: 0, alumnosAprobados: 0, beneficios: '' },
    },
  };
  expandedRow: string | null = null;

  constructor(
    private store: Store,
    private osdService: OSDService,
    private osdDataService: OSDDataService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.osdService.GetCFHReports();
    }, 0);

    this.osdDataService.CFHResultList$.subscribe((data: CFHresultItems[]) => {
      if (data.length > 0) {
        this.reports = data[0];
      }
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  toggleRow(rowName: string): void {
    this.expandedRow = this.expandedRow === rowName ? null : rowName;
  }
}
