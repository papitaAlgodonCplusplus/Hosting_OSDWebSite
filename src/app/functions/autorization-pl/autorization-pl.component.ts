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
  showModalConfirm: boolean = false; // Nueva propiedad para controlar la visibilidad del modal
  messageModal: string = ''; // Nueva propiedad para el mensaje del modal
  selectedUser: any = null; // Nueva propiedad para almacenar la información del usuario seleccionado
  
  constructor(private store: Store,
              private osdEventService : OSDService) {
  }

  ngOnInit(): void {
    this.osdEventService.getFreeProfessionalsList().then(freeProfessionals => {
      this.freeProfessionals = freeProfessionals;
      this.items = this.freeProfessionals;
      this.displayedItems = this.items.slice(0, 10);
      console.log("Ya en el componente:", freeProfessionals);

      if (this.items.length <= 0) {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No hay subscriptores para mostrar" }))
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }))
        this.store.dispatch(ModalActions.openAlert())
      }
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
    this.messageModal = "Confirmar Autorizacion!"
  }

  closeModal() {
    this.selectedUser = null;
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
    this.osdEventService.cleanFreeProfessionalsList()
  }
}
