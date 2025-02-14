import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { switchReport } from 'src/app/store/actions/ui.actions';
import { AuthSelectors, UiSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-transparency',
  templateUrl: './transparency.component.html',
  styleUrls: ['./transparency.component.css']
})
export class TransparencyComponent implements OnDestroy{
  reportOpen$: Observable<string> = this.store.select(UiSelectors.selectSwitchReport);
  TEST! : string;
  arrowLeftSidebar : boolean = false;
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  isUser: boolean = true;

  constructor(
    private store : Store,
    private router : Router,
    private osdEventService : OSDService
  ){

  }

  ngOnInit(): void{
    setTimeout(() => { 
      this.store.dispatch(switchReport({ reportName: 'sub' }));
      this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated === false) {
          this.isUser = false
        }
      });
    }, 0);
  }
  
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(switchReport({ reportName: 'null' }));
    }, 0);
  }
  
  toggleLeftSidebar(): void {
      this.arrowLeftSidebar = !this.arrowLeftSidebar; 
  }

  showArrow(): void {
    this.arrowLeftSidebar = true;

  }

  hideArrow(): void {
    this.arrowLeftSidebar = false;
  }

  changeReport(report: string) {
    this.store.dispatch(switchReport({ reportName: report }));
  }
}
