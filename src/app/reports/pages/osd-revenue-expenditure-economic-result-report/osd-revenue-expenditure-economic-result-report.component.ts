import { Component } from '@angular/core';
import { OSDRevenueExpenditureEconomicResultReportItems } from '../../interface/OSDRevenueExpenditureEconomicResultReportItems.interface';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { TransparencyIncomeExpenses } from '../../models/TransparencyIncomeExpenses.interface';

@Component({
  selector: 'app-osd-revenue-expenditure-economic-result-report',
  templateUrl: './osd-revenue-expenditure-economic-result-report.component.html',
  styleUrls: ['./osd-revenue-expenditure-economic-result-report.component.css']
})
export class OSDRevenueExpenditureEconomicResultReportComponent {
  
  transparencyIncomeExpenses!: TransparencyIncomeExpenses

  constructor(
    private store : Store,
    private osdService :OSDService,
    private osdDataService: OSDDataService
  ) { }

  ngOnInit(): void{
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.osdService.GetTransparencyReportsIncomeExpenses();
    }, 0);

    this.osdDataService.TotalOsdIncomeExpenses$.subscribe(item => {
      this.transparencyIncomeExpenses = item
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
}
