import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { claimantClaimedOsdReportItems } from '../../interface/claimantClaimedOsdReportItems.interface copy';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';


@Component({
  selector: 'app-claimant-claimed-osd-report',
  templateUrl: './claimant-claimed-osd-report.component.html',
  styleUrls: ['./claimant-claimed-osd-report.component.css']
})
export class ClaimantClaimedOsdReportComponent implements OnDestroy {
  reports: claimantClaimedOsdReportItems[] = [
    {
      institutionEntity: "Institucion 1",
      claimsAmount: 3,
      claimantCompensation: 5000,
      savingsImprovement: 1000,
      claimantRating: 4,
      claimedRating: 3,
      osdRating: 4,
    },
    {

      institutionEntity: "Institucion 2",
      claimsAmount: 5,
      claimantCompensation: 8000,
      savingsImprovement: 2000,
      claimantRating: 5,
      claimedRating: 4,
      osdRating: 3,
    },
    {

      institutionEntity: "Institucion 3",
      claimsAmount: 5,
      claimantCompensation: 8000,
      savingsImprovement: 2000,
      claimantRating: 5,
      claimedRating: 4,
      osdRating: 3,
    },
    {

      institutionEntity: "Institucion 4",
      claimsAmount: 5,
      claimantCompensation: 8000,
      savingsImprovement: 2000,
      claimantRating: 5,
      claimedRating: 4,
      osdRating: 3,
    },
  ];


  constructor(
    private translate: TranslateService,
    private store : Store
  ) { }

  ngOnInit(): void{
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
}
