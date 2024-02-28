import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiSelectors } from 'src/app/store/selectors';
import { AuthenticationActions, UiActions } from 'src/app/store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-left-sidebar-transparency',
  templateUrl: './left-sidebar-transparency.component.html',
  styleUrls: ['./left-sidebar-transparency.component.css']
})
export class LeftSidebarTransparencyComponent {
  // leftSidebarOpen$: Observable<boolean> gets the 'leftSidebarOpen' state from the store
  // and exposes it as an observable that can be subscribed to from the template
  leftSidebarOpen$: Observable<boolean> = this.store.select(UiSelectors.leftSidebarOpen);
  arrowLeftSidebar : boolean = false;

  constructor(private store: Store, private router: Router) {}

  toggleLeftSidebar(): void {
    this.store.dispatch(UiActions.toggleLeftSidebar());
    if(this.arrowLeftSidebar === true){
      this.arrowLeftSidebar = false;
    }
  }

  showArrow(): void{
      this.arrowLeftSidebar = true;
      
  }
  
  hideArrow(): void{
    this.arrowLeftSidebar = false;
  }
}
