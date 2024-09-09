import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { MatPaginator } from '@angular/material/paginator';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { TranslateService } from '@ngx-translate/core';
import { Claim } from 'src/app/models/claim';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FreeProfessional } from '../../models/FreeProfessional';

@Component({
  selector: 'app-assign-pltr-claims',
  templateUrl: './assign-pltr-claims.component.html',
  styleUrls: ['./assign-pltr-claims.component.css']
})
export class AssignPLTRClaimsComponent implements OnDestroy {
  claims: Claim[] = [];
  freeProfessionalsTr: FreeProfessional[] = [];
  users: UserInfo[] = [];
  idTRSelected: string = '';
  idClaim: string = '';
  userName: string = '';
  user!: UserInfo;
  showModal: boolean = false;
  displayedItems: any;
  messageModal!: string;
  claim: any = null;

  constructor(private store: Store,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService) {
  }

  onPageChangeClaims(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.claims.slice(startIndex, endIndex);
  }

  onPageChangeUsers(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.users.slice(startIndex, endIndex);
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
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo
        this.osdEventService.gettingClaimsData(this.user.Id, this.user.AccountType)
      }
    }, 0);

    this.osdEventService.getClaimList().then(claims => {
      this.claims = claims
    },)

    this.osdDataService.freeProfessionalTR$.subscribe(item => {
      this.freeProfessionalsTr = item;
    })

    this.osdDataService.usersFreeProfessionalTR$.subscribe(item => {
      console.log(item)
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

  assignFreeProfessionalToClaim(idClaim: string, idTR: string) {
    this.osdEventService.cleanClaimList();
    var freeProfessional = this.freeProfessionalsTr.find(fp => fp.Userid == idTR)
    if (freeProfessional) {
      this.osdEventService.assignFreeProfessionalsTRToClaim(idClaim, freeProfessional.Id);
    }
    this.showModal = false;
  }

  openModal(claim: Claim): void {
    this.osdEventService.gettingFreeProfessionalsTRData(claim.SubscriberclaimedId);
    this.claim = claim
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
  }

  showDate(dateAndHour: string): string {
    const [datePart, timePart] = dateAndHour.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');

    const fechaConHora = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    const soloFecha = fechaConHora.toLocaleDateString();

    return soloFecha;
  }
}
