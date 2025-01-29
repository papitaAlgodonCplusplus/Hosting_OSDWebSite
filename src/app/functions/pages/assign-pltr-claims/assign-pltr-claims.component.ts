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
import { Observable } from 'rxjs';

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
    }, 0);

    if (this.authenticationService.userInfo) {
      this.user = this.authenticationService.userInfo
      if (this.user.Isadmin) {
        this.osdEventService.gettingClaimsData(this.user.Id, "")
      } else {
        this.osdEventService.gettingClaimsData(this.user.Id, this.user.AccountType)
      }
    }

    this.osdDataService.ClaimsList$.subscribe(claims => {
      this.claims = claims
    },)

    const tempArray: UserInfo[] = [];
    this.osdDataService.usersFreeProfessionalTR$.subscribe(item => {
      item.forEach(user => {
        if (!tempArray.some(tempUser => tempUser.code === user.code)) {
          tempArray.push(user);
        }
      });
      this.users = tempArray;
    });
  }

  assignFreeProfessionalToClaim(idClaim: string, idTR: string) {
    this.osdEventService.cleanClaimList();
    console.log(this.users, idTR)
    var freeProfessional = this.users.find(fp => fp.id == idTR)
    if (freeProfessional) {
      this.osdEventService.assignFreeProfessionalsTRToClaim(idClaim, freeProfessional.id);
      this.store.dispatch(
        ModalActions.addAlertMessage({ alertMessage: "Registration successful!" })
      );
      this.store.dispatch(ModalActions.openAlert());
    }
    this.showModal = false;
  }

  openModal(claim: Claim): void {
    this.osdEventService.gettingFreeProfessionalsTRData(claim.subscriberclaimedid);
    this.claim = claim
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
  }
}
