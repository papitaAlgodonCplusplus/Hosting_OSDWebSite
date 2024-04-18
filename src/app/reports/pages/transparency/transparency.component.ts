import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiActions } from 'src/app/store/actions';
import { switchReport } from 'src/app/store/actions/ui.actions';
import { UiSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-transparency',
  templateUrl: './transparency.component.html',
  styleUrls: ['./transparency.component.css']
})
export class TransparencyComponent implements OnDestroy{

  leftSidebarOpen$: Observable<boolean> = this.store.select(UiSelectors.leftSidebarOpen);
  reportOpen$: Observable<string> = this.store.select(UiSelectors.selectSwitchReport);
  TEST! : string;
  arrowLeftSidebar : boolean = false;

  constructor(
    private store : Store,
    private router : Router
  ){

  }

  ngOnInit(): void{
    setTimeout(() => { 
      this.store.dispatch(switchReport({ reportName: 'sub' }));
    }, 0);
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(switchReport({ reportName: 'null' }));
    }, 0);
  }
  
}
