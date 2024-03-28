import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { MatPaginator } from '@angular/material/paginator';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { UserInfo } from 'src/app/models/userInfo';
import { get } from 'http';
import { subscribe } from 'diagnostics_channel';
import { th } from 'date-fns/locale';
import { Subscriber } from 'src/app/models/subscriber';



@Component({
  selector: 'app-sub-authorized',
  templateUrl: './sub-authorized.component.html',
  styleUrls: ['./sub-authorized.component.css']
})
export class SubAuthorizedComponent implements OnDestroy {
  items: any[] = [];
  displayedItems: any[] = [];
  showModalConfirm: boolean = false;
  showAuthorizatedModal: boolean = false;
  messageModal: string = "Datos de la cuenta de subscriptor cliente";
  user!: any;
  subscribers: any[] = [];
  subscriber: any;

  constructor(private store: Store, private osdDataService: OSDDataService) { }

  ngOnInit(): void {
    this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
      this.items = osdUsersSubscribers;
      this.updateDisplayedItems();
    });

    this.osdDataService.getSubscribersSuccess$.subscribe(osdUsersSubscribers => {
      this.subscribers = osdUsersSubscribers;
    });

    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);
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

  showModal() {
    this.showModalConfirm = true;
    this.messageModal = "Confirmar Autorizacion!"
  }

  onConfirmHandler() {
    this.showModalConfirm = false;
    this.showAuthorizatedModal = false;
  }

  selectUser(userId: string) {
    var foundUser = this.displayedItems.find(item => item.id === userId);
    const userDTO: UserInfo = {} as UserInfo;
    userDTO.identity = foundUser.identity;
    userDTO.name = foundUser.name;
    userDTO.email = foundUser.email;
    this.user = userDTO;

    var subscriber = this.subscribers.find(item => item.userId === userId);
    const subscriberDTO: Subscriber = {} as Subscriber;
    subscriberDTO.clientType = subscriber.clientType
    this.subscriber = subscriberDTO;

    this.showAuthorizatedModal = true;
  }

  onCancelHandler() {
    this.showModalConfirm = false;
    this.showAuthorizatedModal = false
  }
}
