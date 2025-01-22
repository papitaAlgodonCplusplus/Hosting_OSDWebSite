import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { UserInfo } from 'src/app/models/userInfo';

import { TranslateService } from '@ngx-translate/core';
import { OSDService } from 'src/app/services/osd-event.services';
import { Subscriber } from '../../models/Subscriber';

@Component({
  selector: 'app-sub-authorized',
  templateUrl: './sub-authorized.component.html',
  styleUrls: ['./sub-authorized.component.css']
})

export class SubAuthorizedComponent implements OnDestroy {
  items: any[] = [];
  displayedItems: any[] = [];
  showAuthorizatedModal: boolean = false;
  messageModal: string = this.translate.instant('MessageModalAuthorizedCostumer');
  user!: any;
  subscribers: any[] = [];
  subscriber: any;
  userId!: string;
  isAuthorized!: boolean

  constructor(private store: Store, private osdDataService: OSDDataService,
    private translate: TranslateService,
    private osdEventService: OSDService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.osdEventService.GetSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);

    this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
      this.items = osdUsersSubscribers;

      this.osdDataService.getSubscribersSuccess$.subscribe(subscribers => {
        this.subscribers = subscribers;

        this.items.forEach(item => {
          const matchingSubscriber = this.subscribers.find(sub => sub.userId === item.id);
          if (matchingSubscriber) {
           
            item.trainerAssigned = matchingSubscriber.trainerAssigned;
          } else {

          }
        });

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

  selectUser(userId: string) {
    const foundUser: UserInfo = this.displayedItems.find(item => item.id === userId);
    if (foundUser.Isauthorized) {
      this.isAuthorized = true
    }
    else {
      this.isAuthorized = false
    }
    this.userId = foundUser.userid;
    const userDTO: UserInfo = {} as UserInfo;
    "foundUser", foundUser)
    userDTO.Identity = foundUser.identity;
    userDTO.Name = foundUser.name.trim();
    userDTO.Email = foundUser.email;
    this.user = userDTO;

    var subscriber = this.subscribers.find(item => item.id === userId);
    const subscriberDTO: Subscriber = {} as Subscriber;
    subscriberDTO.clientType = subscriber.clienttype
    this.subscriber = subscriberDTO;

    this.showAuthorizatedModal = true;
  }

  onConfirmHandler() {
    this.osdEventService.changingUsdUserAutorizationStatusEvent(this.userId);
    const newItems = this.items.map(item => {
      if (item.Id === this.userId) {
        return { ...item, Isauthorized: "true" };
      }
      return item;
    });
    this.items = newItems;
    this.updateDisplayedItems()
    this.showAuthorizatedModal = false;
  }

  onCancelHandler() {
    this.showAuthorizatedModal = false
  }
}
