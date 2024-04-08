import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthSelectors, MenuOptionsSelectors, UiSelectors } from 'src/app/store/selectors';
import { UiActions } from 'src/app/store/actions';
import { Router } from '@angular/router';
import { OSDService } from 'src/app/services/osd-event.services';
import { MenuOption } from 'src/app/models/menuOptions';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventConstants } from 'src/app/models/eventConstants';

@Component({
  selector: 'shared-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent{
  leftSidebarOpen$: Observable<boolean> = this.store.select(UiSelectors.leftSidebarOpen);
  arrowLeftSidebar: boolean = false;
  menuOptions$: Observable<MenuOption[]> = this.store.select(MenuOptionsSelectors.menuOptions);
  
  constructor(private store: Store, private router: Router, private osdEventService: OSDService,
    private authenticationService: AuthenticationService
  ) { }

  toggleLeftSidebar(): void {
    this.store.dispatch(UiActions.toggleLeftSidebar());
    if (this.arrowLeftSidebar === true) {
      this.arrowLeftSidebar = false;
    }
  }

  showArrow(): void {
    this.arrowLeftSidebar = true;
  }

  hideArrow(): void {
    this.arrowLeftSidebar = false;
  }

  autorizationFreeProfessionals(): void {
    this.osdEventService.CreateGettingFreeProfessionalsDataEvent();
  }

  getSubscribers() {
    this.osdEventService.GetSubscribers();
  }

  onSubmitAssignClaimsToFreeProfessionalsTR(): void {
    this.osdEventService.gettingClaimsData();
    this.osdEventService.gettingFreeProfessionalsTRData();
  }
}
