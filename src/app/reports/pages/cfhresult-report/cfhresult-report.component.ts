import { Component, OnDestroy } from '@angular/core';
import { CFHresultItems } from '../../interface/CFHresultItems.interface';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-cfhresult-report',
  templateUrl: './cfhresult-report.component.html',
  styleUrls: ['./cfhresult-report.component.css']
})
export class CFHResultReportComponent implements OnDestroy {

  constructor(private store : Store){}
  reports : CFHresultItems[] = [
    {
      online: {
        cfhIngresos: 100,
        alumnos: 50,
        alumnosAprobados: 40,
        beneficios: 'Becas online'
      },
      FC: {
        cfhIngresos: 200,
        alumnos: 75,
        alumnosAprobados: 60,
        beneficios: 'Becas FC'
      },
      tramitador: {
        cfhIngresos: 150,
        alumnos: 60,
        alumnosAprobados: 45,
        beneficios: 'Becas tramitador'
      },
      presencial: {
        cfhIngresos: 300,
        alumnos: 100,
        alumnosAprobados: 80,
        beneficios: 'Becas presencial'
      }
    }
  ]

  ngOnInit(): void{
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
}
