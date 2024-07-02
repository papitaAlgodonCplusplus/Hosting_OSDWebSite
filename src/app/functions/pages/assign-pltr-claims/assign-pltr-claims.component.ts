import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { MatPaginator } from '@angular/material/paginator';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assign-pltr-claims',
  templateUrl: './assign-pltr-claims.component.html',
  styleUrls: ['./assign-pltr-claims.component.css']
})
export class AssignPLTRClaimsComponent implements OnDestroy {
  claims: any[] = [];
  freeProfessionalsTr: any[] = [];
  users: any[] = [];
  idTRSelected: string = '';
  idClaim: string = '';
  userName: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedItems: any;
  showModalConfirm!: boolean;
  messageModal!: string;
  modalState: boolean = false;
  showDialogState: boolean = false;
  claim: any = null;


  constructor(private store: Store,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private translate: TranslateService) {
  }

  showModal() {
    this.showModalConfirm = true;
    this.messageModal = "Confirmar Autorizacion!"
  }

  onConfirmHandler() {
    this.showModalConfirm = false;
  }
  onCancelHandler() {
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
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
      this.osdEventService.gettingClaimsData("", "");
      this.osdEventService.gettingFreeProfessionalsTRData();
    }, 0);

    this.osdEventService.getClaimList().then(claims => {
      this.claims = claims
    },)

    this.osdDataService.freeProfessionalTR$.subscribe(item => {
      this.freeProfessionalsTr = item;
    })

    this.osdDataService.usersFreeProfessionalTR$.subscribe(item => {
      this.users = item;
    })

    setTimeout(() => {
      if (this.freeProfessionalsTr.length < 0) {
        this.store.dispatch(ModalActions.changeAlertType({ alertType: 'warning' }));
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'There are no authorized processors' }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'No hay tramitadores autorizados' }));
        }
        this.store.dispatch(ModalActions.openAlert());
      }
    }, 2000);

  }

  assignFreeProfessionalToClaim() {
    this.showDialog()
    this.osdEventService.cleanClaimList();
    this.osdEventService.assignFreeProfessionalsTRToClaim(this.idClaim, this.idTRSelected);
    this.claims = this.claims.filter(claim => claim.Id !== this.idClaim);

    this.osdEventService.getClaimList().then(claims => {
      this.claims = claims
    },)

    this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Se asigno el Tramitador' }));
  }

  openModal(claim: any): void {
    this.claim = claim
    this.modalState = true
  }
  closeModal(): void {
    this.cleanDataToAssignFreeProfessionalTRToClaim();
    this.modalState = false
  }

  actualSegment = 0;
  freeProfessionalsTRPerPage = 5;
  totalSegments = 0;

  setPage(page: number) {
    if (this.totalSegments) {
      if (page < 1 || page > this.totalSegments) {
        return;
      }
      this.actualSegment = page;
    }
  }

  setDataToAssignFreeProfessionalTRToClaim(idClaim: string, idTR: string, userName: string) {
    this.idClaim = idClaim;
    this.idTRSelected = idTR;
    this.userName = userName;
  }
  cleanDataToAssignFreeProfessionalTRToClaim() {
    this.idClaim = '';
    this.idTRSelected = '';
    this.userName = '';
  }

  closeDialog() {
    this.showDialogState = false;
  }
  showDialog() {
    this.showDialogState = true;
  }
}
