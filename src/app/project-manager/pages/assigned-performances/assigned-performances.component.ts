import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-assigned-performances',
  templateUrl: './assigned-performances.component.html',
  styleUrls: ['./assigned-performances.component.css']
})
export class AssignedPerformancesComponent implements OnDestroy {
  subscribers: any[] = [{d: "d"}];
  isUser: boolean = true;
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  
  constructor(private osdEventService : OSDService,
              private store : Store
  ){}

  ngOnInit(): void{
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())

      this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated === false) {
          this.isUser = false
        }
      })

    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.subscribers.slice(startIndex, endIndex);
  }
}
