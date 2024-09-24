import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';
import { PerformanceFreeProfessional } from '../../Models/performanceFreeProfessional';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { PerformAction } from '@ngrx/store-devtools/src/actions';

@Component({
  selector: 'app-assigned-performances',
  templateUrl: './assigned-performances.component.html',
  styleUrls: ['./assigned-performances.component.css']
})
export class AssignedPerformancesComponent implements OnDestroy {
  performanceAssigned: PerformanceFreeProfessional[] = []
  isUser: boolean = true;
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  
  constructor(private osdEventService : OSDService,
              private osdDataService : OSDDataService,
              private store : Store,  
              private auth : AuthenticationService
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
      if(this.auth.userInfo){
        this.osdEventService.getPerformancesAssignedById(this.auth.userInfo.Id)
       } 
    }, 0);
    
    this.osdDataService.PerformanceAssignedList$.subscribe(performanceAssigned=>{
      this.performanceAssigned = performanceAssigned;
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.performanceAssigned.slice(startIndex, endIndex);
  }

  selectPerformance(performanceSelected : PerformanceFreeProfessional){
    this.store.dispatch(PerformanceActions.setProjectPerformance({performance: performanceSelected}))
  }

  checkDateIsNotInFuture(dateString: string): boolean {
    //const dateToCheck = new Date(dateString);
    // const today = new Date(); 
    // today.setHours(0, 0, 0, 0); 

    // if (dateToCheck >= today) {
    //   return true;
    // }
     return true; 
  }
   
}
