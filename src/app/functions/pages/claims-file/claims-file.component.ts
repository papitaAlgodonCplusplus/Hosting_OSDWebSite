import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Claim } from 'src/app/models/claim';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ClaimActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { Router, ActivatedRoute  } from '@angular/router';
import { OSDDataService } from 'src/app/services/osd-data.service';

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
    private router: Router,
    private authenticationService: AuthenticationService,
    private osdDataService: OSDDataService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);

    if (this.authenticationService.userInfo) {
      this.user = this.authenticationService.userInfo
      this.osdEventService.gettingClaimsData(this.user.Id, this.user.AccountType)
    }
    
    this.osdDataService.ClaimsList$.subscribe(claims => {
      this.claims = claims;
      this.updateDisplayedItems();
    },)
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
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
