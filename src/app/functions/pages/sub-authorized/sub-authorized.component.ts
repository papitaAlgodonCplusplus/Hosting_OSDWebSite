import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { UserInfo } from 'src/app/models/userInfo';
import { TranslateService } from '@ngx-translate/core';
import { OSDService } from 'src/app/services/osd-event.services';
import { Subscriber } from '../../models/Subscriber';
import { BackblazeService } from 'src/app/services/backblaze.service';
import { CountryService } from 'src/app/services/country.service';
import { map } from 'rxjs/operators';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sub-authorized',
  templateUrl: './sub-authorized.component.html',
  styleUrls: ['./sub-authorized.component.css']
})
export class SubAuthorizedComponent implements OnDestroy {
  items: any[] = [];
  displayedItems: any[] = [];
  myForm!: FormGroup; // Declare FormGroup instance
  // Map USER_TYPE codes to display names
  userTypeDisplayNames: { [key: string]: string } = {
    CL: 'Cliente',
    PL: 'Profesional Libre',
    R: 'Reclamante',
    CFH: 'Centro de Formacion Homologado',
    IT: 'Ingeniero Tecnico',
    TC: 'Tecnico Contabilidad',
    Unknown: 'Desconocido' // Default display name for unexpected types
  };


  // Existing modal for authorizing
  showAuthorizatedModal: boolean = false;
  messageModal: string = this.translate.instant('MessageModalAuthorizedCostumer');
  user!: any;
  subscribers: Subscriber[] = [];
  subscriber!: Subscriber;
  itemsBackup: any[] = [];
  itemsGroupedByUserType: { [key: string]: any[] } = {
    Cliente: [],
    CFH: [],
    RestFreeProfessionals: [],
    Reclamante: []
  };
  userTypes: DropDownItem[] = [
    { value: '', key: 'All' },
    { value: 'Cliente', key: 'Cliente' },
    { value: 'Centro de Formacion Homologado', key: 'Centro de Formacion Homologado' },
    { value: 'Reclamante', key: 'Reclamante' }
  ];
  showProcessorsModal: boolean = false;
  selectedProcessors: any[] = [];
  selectedProcessorsTitle: string = '';
  ClientProcessorsArray: any[] = [];
  CFHProcessorsArray: any[] = [];
  solutions_clients: any[] = [];
  office_clients: any[] = [];
  countries: DropDownItem[] = [];

  userId!: string;
  isAuthorized!: boolean;

  // NEW PROPERTIES: for "See Info" modal
  showSubscriberInfo: boolean = false;
  selectedSubscriber: Subscriber | null = null;

  constructor(
    private store: Store,
    private osdDataService: OSDDataService,
    private translate: TranslateService,
    private backblazeService: BackblazeService,
    private osdEventService: OSDService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private countryService: CountryService
  ) { }

  downloadSelectedFile(document_type: string) {
    if (!document_type) {
      return;
    }
    let fileId = '';
    switch (document_type) {
      case 'identification':
        fileId = this.selectedSubscriber?.identificationfileid || '';
        break;
      case 'civilliability':
        fileId = this.selectedSubscriber?.civilliabilityinsurancefileid || '';
        break;
      case 'curriculum':
        fileId = this.selectedSubscriber?.curriculumvitaefileid || '';
        break;
    }
    if (fileId === '') {
      return;
    }

    this.backblazeService.authorizeAccount().subscribe(response => {
      const apiUrl = response.apiUrl;
      const authorizationToken = response.authorizationToken;

      this.backblazeService.getDownloadUrl(apiUrl, authorizationToken, fileId).subscribe(downloadResponse => {
        const downloadUrl = downloadResponse.downloadUrl;
        const fileName = downloadResponse.fileName;
        if (!downloadUrl || !fileName) {
          return;
        }

        this.backblazeService.downloadFile(downloadUrl, fileName, authorizationToken).subscribe(blob => {
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName;
          link.click();
        }, error => {
          console.error(error);
        });
      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }

  getUserTypeDisplayName(userType: string): string {
    return this.userTypeDisplayNames[userType] || 'Desconocido';
  }

  groupSubscribersByUserType(): void {
    const groupedItems: { [key: string]: any[] } = {
      Cliente: [],
      CFH: [],
      RestFreeProfessionals: [],
      Reclamante: [],
    };

    this.items.forEach(item => {
      const match = item.code.match(/.+\/([^\/]+)\/.+\/.+$/);
      const userType = match && match[1] ? match[1] : 'Unknown';

      if (userType === 'CL') {
        groupedItems['Cliente'].push(item);
        console.log('Getting processors for client:', item.userid);
        this.osdEventService.getMyAssignedProcessors(item.userid).subscribe({
          next: (processors) => {
            console.log('Got processors for client:', processors.Body?.processors);
            this.ClientProcessorsArray[item.code] = processors.Body?.processors;
          },
          error: (err) => {
            console.error('Error fetching processors for client:', err);
          }
        })
      } else if (userType === 'CFH') {
        groupedItems['CFH'].push(item);
        this.osdEventService.getMyAssignedProcessors(item.userid).subscribe({
          next: (processors) => {
            console.log('Got processors for client:', processors.Body?.processors);
            this.CFHProcessorsArray[item.code] = processors.Body?.processors;
          },
          error: (err) => {
            console.error('Error fetching processors for client:', err);
          }
        })
      } else if (userType === 'R') {
        groupedItems['Reclamante'].push(item);
      } else {
        groupedItems['RestFreeProfessionals'].push(item);
      }
    });

    // Assign the grouped items back to `itemsGroupedByUserType` in the specified order
    this.itemsGroupedByUserType = {
      Cliente: groupedItems['Cliente'],
      CFH: groupedItems['CFH'],
      RestFreeProfessionals: groupedItems['RestFreeProfessionals'],
      Reclamante: groupedItems['Reclamante'],
    };
  }


  ngOnInit(): void {
    this.myForm = this.fb.group({
      selectedCountry: new FormControl(''),
      selectedUserType: new FormControl('') // New control for user type filter
    });
    this.itemsGroupedByUserType = {
      Cliente: [],
      CFH: [],
      RestFreeProfessionals: [],
      Reclamante: [],
    };
    setTimeout(() => {
      this.osdEventService.GetSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);

    // Observing the user's subscribers
    this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
      this.items = osdUsersSubscribers;
      this.itemsBackup = osdUsersSubscribers;
      console.log("Got subscribers", osdUsersSubscribers);

      // Observing all subscribers
      this.osdDataService.getSubscribersSuccess$.subscribe(subscribers => {
        this.subscribers = subscribers;

        // Assign 'trainerAssigned' to items
        this.items.forEach(item => {
          const matchingSubscriber = this.subscribers.find(
            sub => sub.userId === item.id
          );
          if (matchingSubscriber) {
            item.trainerassigned = matchingSubscriber.trainerAssigned;
          }
        });

        this.loadCountries();
        this.groupSubscribersByUserType();
        this.updateDisplayedItems();
        this.SubCategorizeClients();
        console.log("Office clients: ", this.office_clients, "Solutions clients: ", this.solutions_clients);
      });
    });
  }

  filterUsers(): void {
    const selectedCountry: string = this.myForm.value.selectedCountry.trim().toLowerCase();
    const selectedUserType: string = this.myForm.value.selectedUserType;
    console.log("Selected country: ", selectedCountry, "Selected user type: ", selectedUserType);
    if (selectedUserType) {
      let groupName: string;
      switch (selectedUserType) {
        case 'Cliente':
          groupName = 'Cliente';
          break;
        case 'CL':
          groupName = 'Cliente';
          break;
        case 'Centro de Formacion Homologado':
          groupName = 'CFH';
          break;
        case 'CFH':
          groupName = 'CFH';
          break;
        case 'Reclamante':
          groupName = 'Reclamante';
          break;
        case 'R':
          groupName = 'Reclamante';
          break;
        default:
          groupName = 'All';
      }
      
      let groupItems = this.itemsGroupedByUserType[groupName] || [];
      if (selectedCountry) {
        groupItems = groupItems.filter(item =>
          item.country.trim().toLowerCase() === selectedCountry
        );
      }

      console.log("Group items: ", groupItems);
      Object.keys(this.itemsGroupedByUserType).forEach(key => {
        if (key !== groupName) {
          this.itemsGroupedByUserType[key] = [];
        }
      });
      this.itemsGroupedByUserType[groupName] = groupItems;
      this.items = groupItems;
    } else {
      const filteredItems = this.items.filter(item => {
        if (selectedCountry) {
          return item.country.trim().toLowerCase() === selectedCountry;
        }
        return true;
      });
      
      this.items = filteredItems;
      this.groupSubscribersByUserType();
    }
    this.updateDisplayedItems();
    this.SubCategorizeClients();
  }
  
   /**
   * Deletes the user record from the form array and calls the backend deletion.
   * @param index The index of the user to delete.
   */
   deleteSubscriber(item: any): void {
    const userId = item.userid;
    console.log("Deleting user with ID:", userId);
    this.osdEventService.deleteUser(userId).subscribe({
      next: () => {
        this.snackBar.open('User record deleted successfully.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error: any) => {
        console.error('❌ Error deleting user record:', error);
        this.snackBar.open('❌ Error deleting user record.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onCancel() {
    this.myForm.patchValue({
      selectedCountry: '',
      selectedUserType: ''
    });
    this.items = this.itemsBackup;
    this.itemsGroupedByUserType = {
      Cliente: [],
      CFH: [],
      RestFreeProfessionals: [],
      Reclamante: [],
    };
    this.groupSubscribersByUserType();
    this.updateDisplayedItems();
    this.SubCategorizeClients();
  }

  private loadCountries(): void {
    this.countryService.getCountries()
      .pipe(
        map((countries: any[]) => this.mapCountriesToDropdown(countries))
      )
      .subscribe(countries => {
        this.countries = countries;
        this.sortCountries();
      });
  }

  private mapCountriesToDropdown(countries: any[]): DropDownItem[] {
    return countries
      .map(country => this.getCountryDropdownItem(country))
      .filter(item => item !== undefined) as DropDownItem[];
  }
  private getCountryDropdownItem(country: any): DropDownItem | undefined {
    const name = this.translate.currentLang === 'en'
      ? country.name?.common
      : country.translations?.spa?.common;

    return name && country.cca2 ? { value: name, key: country.name.common } : undefined;
  }
  private sortCountries(): void {
    this.countries.sort((a, b) => a.value.localeCompare(b.value));
  }

  SubCategorizeClients() {
    for (let i = 0; i < this.itemsGroupedByUserType['Cliente'].length; i++) {
      console.log("Item: ", this.itemsGroupedByUserType['Cliente'][i]);
    }
    this.solutions_clients = this.itemsGroupedByUserType['Cliente']?.filter(item => !item.can_be_claimed) || [];
    this.office_clients = this.itemsGroupedByUserType['Cliente']?.filter(item => item.can_be_claimed) || [];
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 10) {
    this.displayedItems = this.items.slice(startIndex, endIndex + 1);
  }

  // Existing "Select" user => open authorized modal
  selectUser(user: any) {
    console.log("Clicked user", user);
    const foundUser: UserInfo = this.displayedItems.find(
      item => item.userid === user.userid
    );
    if (foundUser.Isauthorized) {
      this.isAuthorized = true;
    } else {
      this.isAuthorized = false;
    }

    this.userId = foundUser.userid;
    const userDTO: UserInfo = {} as UserInfo;
    userDTO.Identity = foundUser.identity;
    userDTO.Name = foundUser.name.trim();
    userDTO.Email = foundUser.email;
    userDTO.Code = foundUser.code;
    this.user = userDTO;

    // Assign subscriber, though your existing code sets it but doesn't do much with it yet
    const subscriber = this.subscribers.find(
      sub => sub.userid === foundUser.userid
    );

    // Just in case
    const subscriberDTO: Subscriber = {} as Subscriber;
    if (subscriber) {
      subscriberDTO.id = subscriber.id;
      subscriberDTO.userId = subscriber.userId;
      subscriberDTO.name = subscriber.name;
      // etc. fill as needed
    }

    this.subscriber = subscriberDTO;
    this.showAuthorizatedModal = true;
  }

  sendAuthorizationEmail(to_email: string, userCode?: string) {
    const payload = {
      to_email: to_email,
      UserCode: userCode || '',
      template_id: "d-d639040e9f4c443dadf211bafca3d8ba",
      from: {
        email: "info@digitalsolutionoffice.com",
        name: "Digital Solution Office"
      },
      personalizations: [
        {
          to: [
            { email: to_email }
          ],
          dynamic_template_data: {
            subject: "Registro de CFH",
          }
        }
      ]
    };

    const url = 'https://api.sendgrid.com/v3/mail/send';
    // Return the observable so the caller can subscribe.
    return this.osdEventService.userRegisterEmail(payload, url);
  }

  onConfirmHandler() {
    // Call the service to authorize the user and subscribe to the response
    this.osdEventService.changingUsdUserAutorizationStatusEvent(this.userId).subscribe({
      next: () => {
        // Update items array locally for the new Isauthorized state
        const newItems = this.items.map(item => {
          if (item.Id === this.userId) {
            return { ...item, Isauthorized: true };
          }
          return item;
        });
        this.items = newItems;
        this.updateDisplayedItems();

        // Send an authorization email using the new template
        if (this.user && this.user.Email) {
          const userCode = this.user.Code;
          this.sendAuthorizationEmail(this.user.Email, userCode).subscribe({
            next: () => {
              console.log("Authorization email sent successfully.");
            },
            error: (err) => {
              console.error("Error sending authorization email:", err);
            }
          });
        } else {
          console.error("User email not available for sending authorization email.");
        }
        this.showAuthorizatedModal = false;
      },
      error: (err) => {
        console.error("Error changing user authorization status:", err);
      }
    });
  }

  onCancelHandler() {
    this.showAuthorizatedModal = false;
  }

  /**
   * Opens the Processors modal and sets the processors list based on the item.
   */
  viewProcessors(item: any): void {
    // Check which processors array has the data for this user
    console.log("arays: ", this.ClientProcessorsArray, this.CFHProcessorsArray)
    console.log("item: ", item.code);
    if (this.ClientProcessorsArray[item.code]) {
      this.selectedProcessors = this.ClientProcessorsArray[item.code];
    } else if (this.CFHProcessorsArray[item.code]) {
      this.selectedProcessors = this.CFHProcessorsArray[item.code];
    } else {
      this.selectedProcessors = [];
    }
    console.log("Selected processors: ", this.selectedProcessors);
    // Set a title using the company name or name
    this.selectedProcessorsTitle = item.companyname || item.name || '';
    this.showProcessorsModal = true;
  }

  /**
   * Closes the Processors modal.
   */
  closeProcessorsModal(): void {
    this.showProcessorsModal = false;
    this.selectedProcessors = [];
    this.selectedProcessorsTitle = '';
  }

  // NEW METHOD: "See Info" -> display subscriber details in a modal
  viewSubscriberInfo(item: any) {
    const matchingSubscriber = this.subscribers.find(
      sub => sub.userId === item.id
    );

    if (matchingSubscriber) {
      this.selectedSubscriber = matchingSubscriber;
    } else {
      // Ensure fallback item is shaped correctly
      this.selectedSubscriber = {
        ...new Subscriber(),
        id: item.identity,
        userId: item.id,
        name: item.name,
        firstsurname: item.firstsurname || '',
        middlesurname: item.middlesurname || '',
        email: item.email || '',
        companyName: item.companyname || '',
        trainerAssigned: item.trainerassigned || '',
        country: item.country || '',
        FreeprofessionaltypeAcronym: item.FreeprofessionaltypeAcronym || '',
        identificationfileid: item.identificationfileid || '',
        civilliabilityinsurancefileid: item.civilliabilityinsurancefileid || '',
        curriculumvitaefileid: item.curriculumvitaefileid || '',
        // Newly added fields
        city: item.city || '',
        address: item.address || '',
        zipCode: item.zipcode || '',
        landline: item.landline || '',
        mobilePhone: item.mobilephone || '',
        web: item.web || '',
        referrer: item.refeer || '',
      };
    }

    this.showSubscriberInfo = true;
  }

  closeInfoModal() {
    this.showSubscriberInfo = false;
    this.selectedSubscriber = null;
  }
}
