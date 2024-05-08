import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuOptionsSelectors, UiSelectors } from 'src/app/store/selectors';
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
export class LeftSidebarComponent implements OnInit {
  leftSidebarOpen$: Observable<boolean> = this.store.select(UiSelectors.leftSidebarOpen);
  arrowLeftSidebar: boolean = false;
  menuOptions$: Observable<MenuOption[]> = this.store.select(MenuOptionsSelectors.menuOptions);
  isAuthorized!: boolean;
  user!: any;

  constructor(private store: Store, private router: Router, private osdEventService: OSDService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo
        console.log(this.user)
        if (this.user.AccountType == EventConstants.SUBSCRIBER_CUSTOMER || this.user.AccountType == EventConstants.FREE_PROFESSIONAL) {
          if (this.user.Isauthorized == true) {
            this.isAuthorized = true
          }
          else {
            this.isAuthorized = false
          }
        }
        else{
          this.isAuthorized = true
        }
      }
    }, 0);
  }

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
}
