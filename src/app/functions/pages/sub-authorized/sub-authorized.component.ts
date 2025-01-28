import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { UserInfo } from 'src/app/models/userInfo';
import { TranslateService } from '@ngx-translate/core';
import { OSDService } from 'src/app/services/osd-event.services';
import { Subscriber } from '../../models/Subscriber';
import { BackblazeService } from 'src/app/services/backblaze.service';

@Component({
  selector: 'app-sub-authorized',
  templateUrl: './sub-authorized.component.html',
  styleUrls: ['./sub-authorized.component.css']
})
export class SubAuthorizedComponent implements OnDestroy {
  items: any[] = [];
  displayedItems: any[] = [];
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
  itemsGroupedByUserType: { [key: string]: any[] } = {};

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
    private osdEventService: OSDService
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
    const validUserTypes = ['CL', 'PL', 'R', 'CFH', 'IT', 'TC']; // Predefined USER_TYPE codes

    this.itemsGroupedByUserType = this.items.reduce((groups, item) => {
      const match = item.code.match(/.+\/([^\/]+)\/.+\/.+$/);
      const userType = match && validUserTypes.includes(match[1]) ? match[1] : 'Unknown'; // Validate USER_TYPE

      if (!groups[userType]) {
        groups[userType] = [];
      }
      groups[userType].push(item);
      return groups;
    }, {});
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.osdEventService.GetSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);

    // Observing the user's subscribers
    this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
      this.items = osdUsersSubscribers;

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

        this.groupSubscribersByUserType();
        this.updateDisplayedItems();
      });
    });
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
    this.displayedItems = this.items.slice(startIndex, endIndex);
  }

  // Existing "Select" user => open authorized modal
  selectUser(user: any) {
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

  onConfirmHandler() {
    // Example: call the service to authorize the user
    this.osdEventService.changingUsdUserAutorizationStatusEvent(this.userId);

    // Update items array locally for the new Isauthorized state
    const newItems = this.items.map(item => {
      if (item.Id === this.userId) {
        return { ...item, Isauthorized: true };
      }
      return item;
    });
    this.items = newItems;

    this.updateDisplayedItems();
    this.showAuthorizatedModal = false;
  }

  onCancelHandler() {
    this.showAuthorizatedModal = false;
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
