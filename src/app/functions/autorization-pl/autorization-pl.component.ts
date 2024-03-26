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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedItems: any;
  showModalConfirm! :boolean;
  messageModal! : string;
  constructor(private store: Store,
              private osdEventService : OSDService) {
    for (let i = 1; i <= 50; i++) {
      this.items.push({ field1: 'Campo 1 - ' + i, field2: 'Campo 2 - ' + i });
    }
    if (this.items.length <= 0) {
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No hay subscriptores para mostrar" }))
      this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }))
      this.store.dispatch(ModalActions.openAlert())
    }
    this.displayedItems = this.items.slice(0, 10);
  }
 

  showModal(){
    this.showModalConfirm = true;
    this.messageModal = "Confirmar Autorizacion!"
  }

  onConfirmHandler() {
    this.showModalConfirm = false;
  }
  onCancelHandler(){
    this.showModalConfirm = false;
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
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.osdEventService.GetSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);
  }
}
