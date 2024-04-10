import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { ModalActions } from 'src/app/store/actions';
import { MatPaginator } from '@angular/material/paginator';
import { OSDService } from 'src/app/services/osd-event.services';
import { UserInfo } from 'src/app/models/userInfo';
import { Subscriber } from 'src/app/models/subscriber';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-autorization-pl',
  templateUrl: './autorization-pl.component.html',
  styleUrls: ['./autorization-pl.component.css']
})
export class AutorizationPlComponent implements OnDestroy {
  items: any[] = [];
  freeProfessionals: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedItems: any;
  showModalConfirm: boolean = false; 
  selectedUser: any = null; 
  user!: any;
  message: string = "";
  showAuthorizatedModal: boolean = false;
  subscriber: any;

  constructor(private store: Store,
              private osdEventService : OSDService,
            private translate : TranslateService) {
  }

  ngOnInit(): void {
    this.osdEventService.getFreeProfessionalsList().then(freeProfessionals => {
      this.freeProfessionals = freeProfessionals;
      this.items = this.freeProfessionals;
      this.displayedItems = this.items.slice(0, 10);
    });

    setTimeout(() => {
      this.osdEventService.GetFreeProfessionalsDataEvent();
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);
  }

  selectUser(user: any) {
    this.selectedUser = user; 
    this.showAuthorizatedModal = true;
    const userDTO: UserInfo = {} as UserInfo;

    userDTO.Identity = this.selectedUser?.Identity;
    userDTO.Name = this.selectedUser?.Name;
    userDTO.Email = this.selectedUser?.Email;
    this.user = userDTO;

    const subscriberDTO: Subscriber = {} as Subscriber;
    subscriberDTO.clientType = this.translate.instant("profesional_libre");
    this.subscriber = subscriberDTO;

    this.showAuthorizatedModal = true;
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 10) {
    this.displayedItems = this.items.slice(startIndex, endIndex);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
    this.osdEventService.cleanFreeProfessionalsList()
  }

  onConfirmHandler(selectedUser: any) {
    this.osdEventService.changingUsdUserAutorizationStatusEvent(selectedUser.Id)
    this.store.dispatch(ModalActions.openAlert());
    
    this.items.forEach(item => {
      if (item.Id === selectedUser.Id) {
        item.Isauthorized = true; 
      }
    });
    this.showAuthorizatedModal = false;
  }

  onCancelHandler() {
    this.showAuthorizatedModal = false
  }
}