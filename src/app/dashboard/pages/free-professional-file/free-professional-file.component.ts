import { Component, OnDestroy } from '@angular/core';
import { Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { Router } from 'express';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { OSDService } from 'src/app/services/osd-event.services';
import { ClaimActions, UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-free-professional-file',
  templateUrl: './free-professional-file.component.html',
  styleUrls: ['./free-professional-file.component.css']
})
export class FreeProfessionalFileComponent {

  claimId!: string;
  claims$: Observable<Claim[]> = this.store.select(ClaimSelectors.claims);

  constructor(
    private osdEventService: OSDService,
    private store: Store
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.claims$.subscribe(ddad => {
        console.log(ddad)
      })
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
      this.osdEventService.GetClaims()
    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  selectClaim(claimId: string) {
    this.claimId = claimId;
    this.store.dispatch(ClaimActions.setClaimId({claimId : claimId}))
  }
}
