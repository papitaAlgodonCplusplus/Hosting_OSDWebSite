import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { CFHresultItems } from '../../interface/CFHresultItems.interface';

@Component({
  selector: 'app-cfhresult-report',
  templateUrl: './cfhresult-report.component.html',
  styleUrls: ['./cfhresult-report.component.css']
})
export class CFHResultReportComponent implements OnInit, OnDestroy {

  /**
   * This array will be populated with CFH data from the backend
   */
  reports: CFHresultItems[] = [];

  constructor(
    private store: Store,
    private osdService: OSDService,
    private osdDataService: OSDDataService
  ) {}

  ngOnInit(): void {
    // Hide certain UI elements if needed
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());

      // 1) Fetch the CFH data from the backend
      //    Make sure you have a corresponding method in OSDService
      this.osdService.GetCFHReports();
    }, 0);

    // 2) Subscribe to the CFH data store observable
    //    Adjust the property name to whatever you actually have in OSDDataService
    this.osdDataService.CFHResultList$.subscribe(data => {
      this.reports = data; 
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      // Restore UI elements
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
}
