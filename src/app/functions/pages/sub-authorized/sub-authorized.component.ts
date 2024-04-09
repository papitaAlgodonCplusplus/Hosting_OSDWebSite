import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { UserInfo } from 'src/app/models/userInfo';
import { Subscriber } from 'src/app/models/subscriber';
import { TranslateService } from '@ngx-translate/core';
import { OSDService } from 'src/app/services/osd-event.services';

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
      this.updateDisplayedItems();
    });

    this.osdDataService.getSubscribersSuccess$.subscribe(osdUsersSubscribers => {
      this.subscribers = osdUsersSubscribers;
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
    var foundUser = this.displayedItems.find(item => item.Id === userId);
    this.userId = foundUser.Id;
    const userDTO: UserInfo = {} as UserInfo;
    userDTO.Identity = foundUser.Identity;
    userDTO.Name = foundUser.Name;
    userDTO.Email = foundUser.Email;
    this.user = userDTO;

    var subscriber = this.subscribers.find(item => item.userId === userId);
    const subscriberDTO: Subscriber = {} as Subscriber;
    subscriberDTO.clientType = subscriber.clientType
    this.subscriber = subscriberDTO;

    this.showAuthorizatedModal = true;
  }

  onConfirmHandler() {
    this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.translate.instant('UserAuthorized') }))
    this.store.dispatch(ModalActions.openAlert());

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
