import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuService } from 'src/app/services/menu.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { MenuOptionsActions, UiActions } from 'src/app/store/actions';
import { MenuOption } from 'src/app/models/menuOptions';
import { EventConstants } from 'src/app/models/eventConstants';
import { UserInfo } from 'src/app/models/userInfo';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',

  /* 
    We can embed our styles directly here instead of using separate .css files.
    The key classes are:
      .category-container -> 2 columns
      .single-option -> 1 column, centered
  */
  styles: [`
    /* Two-column layout for categories with multiple items */
    .category-container {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
    }

    /* Single item, centered layout */
    .single-option {
      display: grid;
      grid-template-columns: 1fr;
      justify-items: center; /* horizontally center the item */
      gap: 1.5rem;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  user!: UserInfo;
  showModal: boolean = false;
  message!: string;
  menuOptions: MenuOption[] = [];

  // --------------------------------------------
  // 1) Define your categories in a simple array
  // --------------------------------------------
  // Each category object has a 'title' and an array of 'optionNames' that
  // belong to that category. The 'optionNames' must match what you have in
  // your MenuOption model for 'option.name'.
  categories = [
    {
      title: '1. GESTOR USUARIOS',
      optionNames: [
        'authorizeCustomers',
        'Assign_client_to_Trainer',
        'fp_management',
        'edit_user_profile',
      ]
    },
    {
      title: '2. GESTOR EXPEDIENTES',
      optionNames: [
        'Assign_Processor_to_Claim',
        'logs'
      ]
    },
    {
      title: '3. GESTOR FORMACION OSD',
      optionNames: [
        'administer_users'
      ]
    },
    {
      title: '4. GESTOR ECONOMICO',
      optionNames: [
        'accounting_services',
        'accounting'
      ]
    },
    {
      title: '5. GETP -GESTOR ETICO y TRANSPARENTE de PROYECTO-',
      optionNames: [
        'assignarProyectoAFC',
        'gestorPersonasPL',
        'gestorProveedoresBS',
        'transparent_project'
      ]
    }
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private store: Store,
    private translate: TranslateService,
    private menuService: MenuService,
    private osdEventService: OSDService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UiActions.showAll());
    this.loadUserInfo().then(() => {
      this.setupMenu();
    });
  }

  async loadUserInfo(): Promise<void> {
    const userInfo = this.authenticationService.userInfo;
    if (userInfo) {
      this.user = userInfo;
    }
  }

  async setupMenu(): Promise<void> {
    if (this.user) {
      switch (this.user.AccountType) {
        case 'ApprovedTrainingCenter':
          this.menuOptions = this.menuService.getMenuOptionCFH();
          break;
        case 'Claimant':
          this.menuOptions = this.menuService.getMenuOptionClaimant();
          break;
        case 'SubscriberCustomer':
          this.menuOptions = this.menuService.getMenuOptionSubscriber();
          break;
        default:
          await this.loadFreeProfessionalMenu();
          break;
      }

      // Handle unauthorized users
      if (
        this.user.AccountType === EventConstants.SUBSCRIBER_CUSTOMER ||
        this.user.AccountType === EventConstants.FREE_PROFESSIONAL
      ) {
        if (!this.user.Isauthorized) {
          this.setUnauthorizedMessage();
        }
      }
    }
  }

  private async loadFreeProfessionalMenu(): Promise<void> {
    try {
      this.osdEventService.GetFreeProfessionalsDataEvent();
      const freeProfessionals = await this.osdEventService.getFreeProfessionalsList();

      if (Array.isArray(freeProfessionals)) {
        const matchingProfessional = freeProfessionals.find(
          (item) => item.userid === this.user.Id
        );

        if (matchingProfessional) {
          const type = matchingProfessional.FreeprofessionaltypeAcronym;
          this.menuOptions =
            type === 'TR'
              ? this.menuService.getMenuOptionFreeProfessionalProcessor()
              : type === 'INFIT' || type === 'DT'
              ? this.menuService.getMenuOptionAdmin()
              : type === 'FC'
              ? this.menuService.getMenuOptionFreeProfessionalTrainer()
              : this.menuService.getMenuOptionAllFreeProfessional();
        }
      } else {
        console.error('freeProfessionals is not an array:', freeProfessionals);
      }
    } catch (error) {
      console.error('Error fetching free professionals:', error);
    }
  }

  private setUnauthorizedMessage(): void {
    this.translate.get(this.user.AccountType).subscribe((translatedValue: string) => {
      const messageKey =
        this.translate.currentLang === 'en'
          ? 'Your account has been successfully created, but has not yet been authorized. Once approved, you will receive your '
          : 'Tu cuenta ha sido creada con éxito, pero aún no ha sido autorizada. Una vez aprobada, recibirás tu código de ';

      this.message = `${messageKey}${translatedValue} code`;
    });
  }

  // ----------------------------------------------------------------
  // 2) Helper function to filter menuOptions by category array
  // ----------------------------------------------------------------
  // We pass in an array of "optionNames" and return the actual matching
  // MenuOptions from this.menuOptions
  getOptionsForCategory(optionNames: string[]): MenuOption[] {
    return this.menuOptions.filter((option) => optionNames.includes(option.name));
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(MenuOptionsActions.setMenuOptions({ menuOptions: [] }));
    }, 0);
  }
}
