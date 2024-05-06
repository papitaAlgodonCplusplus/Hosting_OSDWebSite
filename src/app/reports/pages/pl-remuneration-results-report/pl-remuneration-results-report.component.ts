import { Component } from '@angular/core';
import { PLRemunerationResultsItems } from '../../interface/plRemunerationResultsItems.interface';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-pl-remuneration-results-report',
  templateUrl: './pl-remuneration-results-report.component.html',
  styleUrls: ['./pl-remuneration-results-report.component.css']
})
export class PLRemunerationResultsReportComponent {

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
    private store : Store
  ) { }

  ngOnInit(): void{
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
  };


