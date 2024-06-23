import { Component, OnInit } from '@angular/core';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Store } from '@ngrx/store';
import { MenuOptionsActions, ModalActions, UiActions } from 'src/app/store/actions';
import { MenuOption } from 'src/app/models/menuOptions';
import { EventConstants } from 'src/app/models/eventConstants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user!: any;

  menuOptionFreeProfessional: MenuOption[] = [
    { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
    { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' }
  ];

  menuOptionAdmin: MenuOption[] = [
    { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
    // { name: 'TitlePerformance', path: '/home/free-professional-file', icon: 'fa-file' },
    { name: 'registerNewUser', path: '/onboarding', icon: 'fa-user-plus' },
    { name: 'Assign_Processor_to_Claim', path: '/functions/assign-pltr-claims', icon: 'fa-user' },
    { name: 'authorizeCustomers', path: '/functions/sub-authorized', icon: 'fa-check-circle' },
    { name: 'authorizeFreeProfessionals', path: '/functions/autorization-pl', icon: 'fa-check-circle' }
  ];

  menuOptionClaimant: MenuOption[] = [
    { name: 'presentar_reclamación', path: '/onboarding/onboarding-register-claimant/False', icon: 'fa-balance-scale' },
    { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' }
  ]

  menuOptionCFH: MenuOption[] = [
    //{ name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' }
  ]

  menuOptionSubscriber: MenuOption[] = [
    { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' }
  ]

  constructor(
    public eventFactoryService: EventFactoryService,
    private authenticationService: AuthenticationService,
    private store: Store,
    private translate: TranslateService
  ) {
  }
  ngOnInit(): void {
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo;

        if (this.user.AccountType === "ApprovedTrainingCenter") {
          this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionCFH }));
        } else if (this.user.AccountType === "Claimant") {
          this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionClaimant }));
        } else if (this.user.AccountType === "SubscriberCustomer") {
          this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionSubscriber }));
        } else {
          console.log(this.user.Isadmin)
          if(this.user.Isadmin === true){
            this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionAdmin }));
          }
          else{
            this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionFreeProfessional }));
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


