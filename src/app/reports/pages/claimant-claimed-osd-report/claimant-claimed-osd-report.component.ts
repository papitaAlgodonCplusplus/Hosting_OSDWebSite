import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { claimantClaimedOsdReportItems } from '../../interface/claimantClaimedOsdReportItems.interface copy';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';


@Component({
  selector: 'app-claimant-claimed-osd-report',
  templateUrl: './claimant-claimed-osd-report.component.html',
  styleUrls: ['./claimant-claimed-osd-report.component.css']
})
export class ClaimantClaimedOsdReportComponent implements OnDestroy {
  institutionsNames: any[] = [];
  claimsAmount: any[] = [];
  compensationObtainedByClaimant: any[] = [];
  savingsImprovement: any[] = [];
  claimantsRating: any[] = [];
  claimedRating: any[] = [];
  osdRating: any[] = [];


  constructor(
    private translate: TranslateService,
    private store : Store,
    private osdService: OSDService,
    private osdDataService: OSDDataService
  ) { }

  ngOnInit(): void{
    this.osdService.GetTransparencyReportsSubscriberClients();
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
    this.assignData();
  }
  assignData(){
    this.osdDataService.InstitutionsNames$.subscribe(item => {
      this.institutionsNames = item;
    })
    this.osdDataService.ClaimsAmount$.subscribe(item => {
      this.claimsAmount = item;
    })
    this.osdDataService.CompensationObtainedByClaimant$.subscribe(item => {
      this.compensationObtainedByClaimant = item;
    })
    this.osdDataService.SavingsImprovement$.subscribe(item => {
      this.savingsImprovement = item;
    })
    this.osdDataService.ClaimantsRating$.subscribe(item => {
      this.claimantsRating = item;
    })
    this.osdDataService.ClaimedRating$.subscribe(item => {
      this.claimedRating = item;
    })
    this.osdDataService.OsdRating$.subscribe(item => {
      this.osdRating = item;
    })
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
  generateStarRating(rating: number): string {
    let starsHTML = '';
    const fullStar = '<i class="fa-solid fa-star text-darkslategray"></i>';
    const regularStar = '<i class="fa-regular fa-star text-darkslategray"></i>';
    
    for (let i = 0; i < rating; i++) {
      starsHTML += fullStar;
    }
    
    for (let i = rating; i < 5; i++) {
      starsHTML += regularStar;
    }
    
    return starsHTML;
  }
}
