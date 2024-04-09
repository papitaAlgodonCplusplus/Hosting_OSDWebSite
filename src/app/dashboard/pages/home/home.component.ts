import { Component, OnInit } from '@angular/core';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { SecurityDataService } from 'src/app/services/security-data.service';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { RestAPIService } from 'src/app/services/rest-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Store } from '@ngrx/store';
import { MenuOptionsSelectors } from 'src/app/store/selectors';
import { MenuOptionsActions } from 'src/app/store/actions';
import { MenuOption } from 'src/app/models/menuOptions';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menuOptionFreeProfessional: MenuOption[] = [
    { name: 'Gestion Etica y Transparente de Proyecto', path: '/project-manager', icon: 'fa-project-diagram' },
    { name: 'TitlePerformance', path: '/home/free-professional-file', icon: 'fa-file' },
    { name: 'registerNewUser', path: '/onboarding', icon: 'fa-user-plus' },
    { name: 'Assign_Processor_to_Claim', path: '/functions/assign-pltr-claims', icon: 'fa-user' },
    { name: 'authorizeCustomers', path: '/functions/sub-authorized', icon: 'fa-check-circle' },
    { name: 'authorizeFreeProfessionals', path: '/functions/autorization-pl', icon: 'fa-check-circle' }
  ];

  menuOptionClaimant: MenuOption[] = [
    { name: 'presentar_reclamación', path: '/onboarding/onboarding-register-claimant', icon: 'fa-balance-scale' },
    { name: 'Gestion Etica y Transparente de Proyecto', path: '/project-manager', icon: 'fa-project-diagram' }
  ]

  menuOptionCFH: MenuOption[] = [
    { name: 'Gestion Etica y Transparente de Proyecto', path: '/project-manager', icon: 'fa-project-diagram' }
  ]

  menuOptionSubscriber: MenuOption[] = [
    { name: 'Gestion Etica y Transparente de Proyecto', path: '/project-manager', icon: 'fa-project-diagram' }
  ]

  constructor(
    public eventFactoryService: EventFactoryService,
    private restApiService: RestAPIService,
    public securityEventService: SecurityEventService,
    public securityDataService: SecurityDataService,
    private authenticationService: AuthenticationService,
    private store: Store
  ) {
  }
  ngOnInit(): void {
    if (this.authenticationService.userInfo) {
      if (this.authenticationService.userInfo.AccountType === "Approved Training Center") {
        this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionCFH }))
      }
      else if (this.authenticationService.userInfo.AccountType === "Claimant") {
        this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionClaimant }))
      }
      else if (this.authenticationService.userInfo.AccountType === "Subscriber Customer") {
        this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionSubscriber }))
      }
      else {
        this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: this.menuOptionFreeProfessional }))
      }
    }
  }


}

