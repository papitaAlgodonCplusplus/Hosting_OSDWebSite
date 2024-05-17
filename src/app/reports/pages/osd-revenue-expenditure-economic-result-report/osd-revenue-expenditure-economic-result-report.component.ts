import { Component } from '@angular/core';
import { OSDRevenueExpenditureEconomicResultReportItems } from '../../interface/OSDRevenueExpenditureEconomicResultReportItems.interface';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';

@Component({
  selector: 'app-osd-revenue-expenditure-economic-result-report',
  templateUrl: './osd-revenue-expenditure-economic-result-report.component.html',
  styleUrls: ['./osd-revenue-expenditure-economic-result-report.component.css']
})
export class OSDRevenueExpenditureEconomicResultReportComponent {
  totalOsdExpenses: any = 0;
  compensationOfClaimant: any = 0;
  totalOsdIncomes: any = 0;
  TD_Expenses: any = 0;
  TC_Expenses: any = 0;
  TM_Expenses: any = 0;
  IN_Expenses: any = 0;
  TS_Expenses: any = 0;

  constructor(
    private store : Store,
    private osdService :OSDService,
    private osdDataService: OSDDataService
  ) { }

  ngOnInit(): void{
    this.osdService.GetTransparencyReportsIncomeExpenses();

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
    this.osdDataService.TotalOsdIncomes$.subscribe(item => {
      this.totalOsdIncomes = item;
    })
    this.osdDataService.TotalOsdExpenses$.subscribe(item => {
      this.totalOsdExpenses = item;
    })
    this.osdDataService.CompensationOfClaimant$.subscribe(item => {
      this.compensationOfClaimant = item;
    })
    this.osdDataService.DT_Expenses$.subscribe(item => {
      this.TD_Expenses = item;
    })
    this.osdDataService.TC_Expenses$.subscribe(item => {
      this.TC_Expenses = item;
    })
    this.osdDataService.TM_Expenses$.subscribe(item => {
      this.TM_Expenses = item;
    })
    this.osdDataService.TS_Expenses$.subscribe(item => {
      this.TS_Expenses = item;
    })
    this.osdDataService.IN_Expenses$.subscribe(item => {
      this.IN_Expenses = item;
    })
    this.osdDataService.TotalOsdExpenses$.subscribe(item => {
      this.totalOsdExpenses = item;
    })
  }
}
