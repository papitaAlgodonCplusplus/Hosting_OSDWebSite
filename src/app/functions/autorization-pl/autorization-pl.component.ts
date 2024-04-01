import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { ModalActions } from 'src/app/store/actions';
import { MatPaginator } from '@angular/material/paginator';
import { OSDService } from 'src/app/services/osd-event.services';

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
  message: string = "";
  
  constructor(private store: Store,
              private osdEventService : OSDService) {
  }

  ngOnInit(): void {
    this.osdEventService.getFreeProfessionalsList().then(freeProfessionals => {
      this.freeProfessionals = freeProfessionals;
      this.items = this.freeProfessionals;
      this.displayedItems = this.items.slice(0, 10);
    });

    setTimeout(() => {
      this.osdEventService.GetSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);
  }

  showModal(user: any) { 
    this.selectedUser = user; 
    this.showModalConfirm = true;
  }

  closeModal() {
    this.selectedUser = null;
    this.showModalConfirm = false;
  }

  AuthorizeUser(selectedUser: any) {
    this.osdEventService.changingUsdUserAutorizationStatusEvent(selectedUser.Id)
    this.closeModal();
    this.store.dispatch(ModalActions.openAlert());

    this.items.forEach(item => {
      if (item.Id === selectedUser.Id) {
        item.Isauthorized = true; 
      }
    });
    this.displayedItems = this.items.slice(this.paginator.pageIndex * this.paginator.pageSize, (this.paginator.pageIndex + 1) * this.paginator.pageSize);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.displayedItems = this.items.slice(startIndex, endIndex);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
    this.osdEventService.cleanFreeProfessionalsList()
  }
}
