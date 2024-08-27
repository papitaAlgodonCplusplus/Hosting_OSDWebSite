import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { ModalActions } from 'src/app/store/actions';
import { MatPaginator } from '@angular/material/paginator';
import { OSDService } from 'src/app/services/osd-event.services';
import { UserInfo } from 'src/app/models/userInfo';
import { TranslateService } from '@ngx-translate/core';
import { Subscriber } from '../../models/Subscriber';
import { FreeProfessional } from '../../models/FreeProfessional';

@Component({
  selector: 'app-autorization-pl',
  templateUrl: './autorization-pl.component.html',
  styleUrls: ['./autorization-pl.component.css']
})
export class AutorizationPlComponent implements OnDestroy {
  items: any[] = [];
  displayedItems: any;
  showModalConfirm: boolean = false;
  user!: UserInfo;
  message: string = "";
  showAuthorizatedModal: boolean = false;
  freeProfessional!: FreeProfessional;
  userSelected: string = ""
  isAuthorized!: boolean

  constructor(private store: Store,
    private osdEventService: OSDService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.osdEventService.getFreeProfessionalsList().then(freeProfessionals => {
      freeProfessionals.forEach(item => {
        if (item.Isadmin === false) {
          this.items.push(item)
        }
      });

      this.updateDisplayedItems();
    });

    setTimeout(() => {
      this.osdEventService.GetFreeProfessionalsDataEvent();
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);
  }

  selectUser(user: FreeProfessional) {
    if (user.Isauthorized) {
      this.isAuthorized = true
    }
    else {
      this.isAuthorized = false
    }
    const userDTO: UserInfo = {} as UserInfo;
    userDTO.Identity = user.Identity
    this.user = userDTO;
    this.userSelected = user.Userid
    const FreeProfessionalDTO: FreeProfessional = {} as FreeProfessional;
    FreeProfessionalDTO.clientType = this.translate.instant("FreeProfessional");
    FreeProfessionalDTO.FreeprofessionaltypeName = user.FreeprofessionaltypeName;
    this.freeProfessional = FreeProfessionalDTO;
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

  onConfirmHandler() {
    this.osdEventService.changingUsdUserAutorizationStatusEvent(this.userSelected)
    const newItems = this.items.map(item => {
      if (item.Id === this.userSelected) {
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