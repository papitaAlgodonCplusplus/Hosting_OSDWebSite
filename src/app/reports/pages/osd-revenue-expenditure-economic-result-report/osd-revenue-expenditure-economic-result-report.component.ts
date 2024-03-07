import { Component } from '@angular/core';
import { OSDRevenueExpenditureEconomicResultReportItems } from '../../interface/OSDRevenueExpenditureEconomicResultReportItems.interface';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-osd-revenue-expenditure-economic-result-report',
  templateUrl: './osd-revenue-expenditure-economic-result-report.component.html',
  styleUrls: ['./osd-revenue-expenditure-economic-result-report.component.css']
})
export class OSDRevenueExpenditureEconomicResultReportComponent {
  
  listaInformes: OSDRevenueExpenditureEconomicResultReportItems[] = [
    {
      total: {
        osdIngresos: 1000,
        osdGastos: 800,
        reclamacionesCuantia: 200,
        indemnizacion: 50
      },
      areaDeTrabajo: {
        // Puedes llenar con valores específicos para 'areaDeTrabajo'
      },
      profesionalesLibres: {
        osdIngresos: 500,
        osdGastos: 300,
      },
      direccionTecnica: {
        osdIngresos: 700,
        osdGastos: 400,
      },
      contabilidad: {
        osdIngresos: 1500,
        osdGastos: 1000,
      },
      marketing: {
        osdIngresos: 1200,
        osdGastos: 1000,
      },
      inf_sac: {
        osdIngresos: 300,
        osdGastos: 150,
      }
    },
    // Puedes agregar más objetos con la misma estructura
  ];
  constructor(
    private store : Store
  ) { }

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
