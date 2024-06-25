import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Claim } from 'src/app/models/claim';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ClaimActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-claims-file',
  templateUrl: './claims-file.component.html',
  styleUrls: ['./claims-file.component.css']
})

export class ClaimsFileComponent {
  claims: any[] = [];
  displayedItems: any[] = [];
  user!: UserInfo;
  constructor(
    private osdEventService: OSDService,
    private store: Store,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo
        this.osdEventService.gettingClaimsData(this.user.Id, this.user.AccountType)
      }
    }, 0);

    setTimeout(() => {
      this.osdEventService.getClaimList().then(claims => {
        this.claims = claims
        console.log(claims)
        this.updateDisplayedItems();
      },)
    }, 1000);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  showDate(dateAndHour: string): string {
    const [datePart, timePart] = dateAndHour.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');

    const fechaConHora = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    const soloFecha = fechaConHora.toLocaleDateString();

    return soloFecha;
  }


  selectClaim(claim: Claim) {
    this.store.dispatch(ClaimActions.setClaim({ claim: claim }))
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 5) {
    this.displayedItems = this.claims.slice(startIndex, endIndex);
  }
}
