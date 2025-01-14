import { Component, OnDestroy } from '@angular/core';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Store } from '@ngrx/store';
import { MenuOptionsActions, UiActions } from 'src/app/store/actions';
import { MenuOption } from 'src/app/models/menuOptions';
import { EventConstants } from 'src/app/models/eventConstants';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from 'src/app/services/menu.service';
import { UserInfo } from 'src/app/models/userInfo';
import { OSDService } from 'src/app/services/osd-event.services';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  user!: UserInfo;
  showModal: boolean = false
  message!: string

  constructor(
    public eventFactoryService: EventFactoryService,
    private authenticationService: AuthenticationService,
    private store: Store,
    private translate: TranslateService,
    private menuService: MenuService,
    private osdEventService: OSDService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(UiActions.showAll());
    this.loadUserInfo().then(() => {
      this.setupMenu();
    });
  }

  async loadUserInfo() {
    var userInfo = this.authenticationService.userInfo;
    if (userInfo) {
      this.user = userInfo;
    }
  }

  setupMenu() {
    if (this.user) {
      if (this.user.AccountType === "ApprovedTrainingCenter") {
        this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionCFH() }));
      } else if (this.user.AccountType === "Claimant") {
        this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionClaimant() }));
      } else if (this.user.AccountType === "SubscriberCustomer") {
        this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionSubscriber() }));
      } else {
        this.osdEventService.GetFreeProfessionalsDataEvent();
        this.osdEventService.getFreeProfessionalsList()
          .then(freeProfessionals => {
            if (Array.isArray(freeProfessionals)) {
              freeProfessionals.forEach(item => {
                var freeProfessional: FreeProfessional = item;
                if (freeProfessional.Userid == this.user.Id) {
                  if (freeProfessional.FreeprofessionaltypeAcronym == "TR") {
                    this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionFreeProfessionalProcessor() }));
                  }
                  else if (freeProfessional.FreeprofessionaltypeAcronym == "INFIT") {
                    this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionAdmin() }));
                  }
                  else if (freeProfessional.FreeprofessionaltypeAcronym == "DT") {
                    this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionAdmin() }));
                  }
                  else if (freeProfessional.FreeprofessionaltypeAcronym == "FC") {
                    this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionFreeProfessionalTrainer() }));
                    this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionStudentsManagement() }));
                  }
                  else{
                    this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuService.getMenuOptionAllFreeProfessional() }));
                  }
                }
              });
            } else {
              console.error('freeProfessionals is not an array:', freeProfessionals);
            }
          })
          .catch(error => {
            console.error('Error fetching free professionals:', error);
          });
      }

      if (this.user.AccountType === EventConstants.SUBSCRIBER_CUSTOMER || this.user.AccountType === EventConstants.FREE_PROFESSIONAL) {
        if (!this.user.Isauthorized) {
          this.translate.get(this.user.AccountType).subscribe((translatedValue: string) => {
            if (this.translate.currentLang == "en") {
              this.message = 'Your account has been successfully created, but has not yet been authorized. Once approved, you will receive your ' + translatedValue + ' code';
            } else {
              this.message = 'Tu cuenta ha sido creada con éxito, pero aún no ha sido autorizada. Una vez aprobada, recibirás tu código de ' + translatedValue;
            }
          });
        }
      }
    }
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: {} as MenuOption[] }));
    }, 0);
  }
}




