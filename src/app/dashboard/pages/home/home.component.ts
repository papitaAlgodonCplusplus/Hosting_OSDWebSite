import { Component, OnInit } from '@angular/core';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Store } from '@ngrx/store';
import { MenuOptionsActions, ModalActions, UiActions } from 'src/app/store/actions';
import { MenuOption } from 'src/app/models/menuOptions';
import { EventConstants } from 'src/app/models/eventConstants';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user!: any;



  constructor(
    public eventFactoryService: EventFactoryService,
    private authenticationService: AuthenticationService,
    private store: Store,
    private translate: TranslateService,
    private menuService: MenuService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo;

        if (this.user.AccountType === "ApprovedTrainingCenter") {
          this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionCFH() }));
        } else if (this.user.AccountType === "Claimant") {
          this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionClaimant() }));
        } else if (this.user.AccountType === "SubscriberCustomer") {
          this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionSubscriber()}));
        } else {
          if(this.user.Isadmin === true){
            this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionAdmin() }));
          }
          else{
            this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionFreeProfessional()}));
          }
        }
        if (this.user.AccountType === EventConstants.SUBSCRIBER_CUSTOMER || this.user.AccountType === EventConstants.FREE_PROFESSIONAL) {
          if (this.user.Isauthorized === false) {
            if (this.translate.currentLang == "en") {
              const alertMessage = "Your account is not authorized";
              this.store.dispatch(ModalActions.addAlertMessage({ alertMessage }));
            } else {
              const alertMessage = "No tienes autorizada tu cuenta";
              this.store.dispatch(ModalActions.addAlertMessage({ alertMessage }));
            }
            this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
            setTimeout(() => {
                  this.store.dispatch(ModalActions.openAlert());
            }, 2000);      
          }
        }
      }
  }
}


