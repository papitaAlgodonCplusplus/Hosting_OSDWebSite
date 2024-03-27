import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { MatPaginator } from '@angular/material/paginator';
import { OSDService } from 'src/app/services/osd-event.services';

@Component({
  selector: 'app-assign-pltr-claims',
  templateUrl: './assign-pltr-claims.component.html',
  styleUrls: ['./assign-pltr-claims.component.css']
})
export class AssignPLTRClaimsComponent implements OnDestroy {
  claims: any[] = [];
  freeProfessionalsTr: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedItems: any;
  showModalConfirm! :boolean;
  messageModal! : string;
  modalState : boolean = false;
  claim: any = null;


  constructor(private store: Store,
              private osdEventService : OSDService) {
    this.osdEventService.getClaimList().then(claims => {
      this.claims = claims
    }, )
    this.osdEventService.getFreeProfessionalsTRList().then(fp => {
      this.freeProfessionalsTr = fp
    })
    
    console.log('Reclamos en constructor')
    console.log(this.claims)
    console.log('FP en constructor')
    console.log(this.freeProfessionalsTr)
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
    this.displayedItems = this.claims.slice(startIndex, endIndex);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
    this.osdEventService.cleanClaimList()
  }

  ngOnInit(): void {
    setTimeout(() => {
      //this.osdEventService.GetSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);
  }

  openModal(claim: any): void{
    this.claim = claim
    this.modalState=true
    console.log("Se abre el modal", claim)
  }
  closeModal(): void{

    this.modalState=false
  }

}
