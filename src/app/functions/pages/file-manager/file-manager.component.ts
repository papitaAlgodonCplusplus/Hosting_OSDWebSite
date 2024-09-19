import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { CreateClaimValuationEvent } from '../../Interface/ClaimValuation.interface';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/models/userInfo';
import { EventConstants } from 'src/app/models/eventConstants';
import { FreeProfessional } from '../../models/FreeProfessional';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnDestroy {
  fileManager!: FormGroup;
  closeClaimfileForm!: FormGroup;
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  claimId!: string;
  displayedItems: any[] = [];
  isSubscriber: boolean = false;
  isClaimant: boolean = false;
  isFreeProfessional: boolean = false;
  isAssignedClaim: boolean = false;
  showModalRatings: boolean = false;
  showModalPerformances: boolean = false;
  user!: UserInfo
  document1!: string;
  document2!: string;
  allPerformances!: any[];
  isTerminatedPerformance: boolean = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private osdDataService: OSDDataService,
    private router: Router,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService) {
    this.fileManager = this.createForm();
    this.closeClaimfileForm = this.createCloseClaimFileForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.claim$.subscribe(claim => {
        this.fileManager = this.fillForm(claim);
        this.claimId = claim.Id;
        if (claim.Status == "Running") {
          this.isAssignedClaim = true;
          this.isTerminatedPerformance = true;
        } else if (claim.Status == "Completed") {
          this.isAssignedClaim = false;
          this.assignValuation(claim)
          console.log(claim)
          this.closeClaimfileForm = this.fillFormCloseClaimFile(claim);
        }

      })

      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo
      }
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      claimant: [''],
      state: [''],
      subscriber: [''],
      amountClaimed: [''],
      freeProfessional: [''],
      valuationSubscriber: [],
      valuationClaimant: [],
      valuationFreeProfessionals: [],
    });
    return form;
  }

  private fillForm(claim: Claim): FormGroup {
    this.document1 = claim.Document1;
    this.document2 = claim.Document2;

    const form = this.formBuilder.group({
      code: [claim.Code],
      claimant: [this.translate.instant(claim.Claimtype)],
      state: [this.translate.instant(claim.Status)],
      subscriber: [claim.NameCompanySubscriberclaimed],
      amountClaimed: ['€ ' + claim.Amountclaimed],
      facts: [claim.Facts],
      //freeProfessional: [''],
      valuationSubscriber: [claim.Valuationsubscriber || 0],
      valuationClaimant: [claim.Valuationclaimant || 0],
      valuationFreeProfessionals: [claim.Valuationfreeprofessionals || 0],
    });
    return form;
  }

  convertDate(dateAndHour: string): string {
    const [datePart, timePart] = dateAndHour.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');

    const fechaConHora = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    const soloFecha = fechaConHora.toISOString().split('T')[0];

    return soloFecha;
  }

  onSubmit(): void {
    if (this.fileManager.invalid) {
      this.fileManager.markAllAsTouched();
      return;
    }
  }


  async openPerformanceClaimsModal() {
    this.showModalPerformances = true;

    if (this.claimId) {
      await this.osdEventService.GetPerformancesClaimById(this.claimId);
      combineLatest([
        this.osdDataService.claimantAndClaimsCustomerPerformanceList$.pipe(map(performanceClaim =>
          performanceClaim.map(item => ({ ...item, typePerformance: 'ClaimantCustomer' }))
        )),
        this.osdDataService.claimsProcessorPerformanceList$.pipe(map(performanceClaim =>
          performanceClaim.map(item => ({ ...item, typePerformance: 'Processor' }))
        )),
        this.osdDataService.claimsTrainerPerformanceList$.pipe(map(performanceClaim =>
          performanceClaim.map(item => ({ ...item, typePerformance: 'Trainer' }))
        ))
      ]).subscribe(([claimantAndCustomer, processor, trainer]) => {
        this.allPerformances = [
          ...claimantAndCustomer,
          ...processor,
          ...trainer
        ];
        this.updateDisplayedItems(0, 5);
      });
    }
  }

  closePerformanceModal(): void {
    this.showModalPerformances = false;
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  private updateDisplayedItems(startIndex: number, endIndex: number) {
    this.displayedItems = this.allPerformances.slice(startIndex, endIndex);
  }

  viewPerformance(performance: any) {
    if (performance.typePerformance == "ClaimantCustomer") {
      this.router.navigate(["/functions/claimant-and-claims-customer-performance"]);
      this.store.dispatch(PerformanceActions.setClaimantAndClaimsCustomerPerformance({ performanceClaim: performance }))
    }
    else if (performance.typePerformance == "Processor") {
      this.router.navigate(["/functions/claims-processor-performance"]);
      this.store.dispatch(PerformanceActions.setClaimProcessorPerformance({ performanceClaim: performance }))
    }
    else {
      this.router.navigate(["/functions/claims-trainer-performance"]);
      this.store.dispatch(PerformanceActions.setClaimTrainerPerformance({ performanceClaim: performance }))
    }
  }

  async assignValuation(claim: Claim) {
    var userInfo = this.authenticationService.userInfo
    if (userInfo?.AccountType == "SubscriberCustomer") {
      this.isSubscriber = true
      if (claim.Valuationsubscriber == "0") {
        this.showModalRatings = true;
      }
    }
    else if (userInfo?.AccountType == "Claimant") {
      this.isClaimant = true
      if (claim.Valuationclaimant == "0") {
        this.showModalRatings = true;
      }
    }
    else {
      this.osdEventService.GetFreeProfessionalsDataEvent();
      const freeProfessionals = await this.osdEventService.getFreeProfessionalsList();
      if (Array.isArray(freeProfessionals)) {
        const freeProfessionalFind: FreeProfessional | undefined = freeProfessionals.find(fp => fp.Userid == this.user.Id);
        if (freeProfessionalFind?.FreeprofessionaltypeName == "Processor") {
          this.isFreeProfessional = true
          if (claim.Valuationfreeprofessionals == "0") {
            this.showModalRatings = true;
          }
        }
      }
    }
  }

  updateValuation() {
    var valuationForm: CreateClaimValuationEvent = {
      ClaimId: this.claimId,
      ValuationClaimant: this.fileManager.value.valuationClaimant,
      ValuationFreeProfessionals: this.fileManager.value.valuationFreeProfessionals,
      ValuationSubscriber: this.fileManager.value.valuationSubscriber
    }
    this.osdEventService.UpdateValuation(valuationForm);
    this.closeModalRatings();
  }

  private createCloseClaimFileForm(): FormGroup {
    const form = this.formBuilder.group({
      AAsavingsPP: ['', [Validators.required]],
      creditingDate: ['', [Validators.required]],
      AmountPaid: ['', [Validators.required]],
    });
    return form;
  }

  closeModalRatings() {
    this.showModalRatings = false;
  }

  closeClaimFile() {
    if (this.closeClaimfileForm.invalid) {
      this.closeClaimfileForm.markAllAsTouched();
      return;
    }

    this.osdEventService.CloseClaimFile(this.closeClaimfileForm.value, this.claimId);
  }

  async newPerformance() {
    if (this.user.AccountType == EventConstants.SUBSCRIBER_CUSTOMER || this.user.AccountType == EventConstants.CLAIMANT) {
      this.router.navigate(['/functions/claimant-and-claims-customer-performance']);
    } else if (this.user.AccountType == EventConstants.FREE_PROFESSIONAL) {
      await this.osdEventService.GetFreeProfessionalsDataEvent();
      const freeProfessionals = await this.osdEventService.getFreeProfessionalsList();
      if (Array.isArray(freeProfessionals)) {
        const freeProfessionalFind: FreeProfessional | undefined = freeProfessionals.find(fp => fp.Userid == this.user.Id);
        if (freeProfessionalFind?.FreeprofessionaltypeName == "Trainer") {
          this.router.navigate(['/functions/claims-trainer-performance']);
        } else if (freeProfessionalFind?.FreeprofessionaltypeName == "Processor") {
          this.router.navigate(['/functions/claims-processor-performance']);
        }
      }
    }
  }

  private fillFormCloseClaimFile(claim: Claim): FormGroup {
    console.log(claim)
    let originalDate = claim.Date; 
    let parts = originalDate.split("/");
    let formattedDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])); // Create a valid Date object
    let formatedStartDate = this.datePipe.transform(formattedDate, 'yyyy-MM-dd');
    
    const form = this.formBuilder.group({
      AAsavingsPP: ['€ ' + claim.ImprovementSavings, [Validators.required]],
      creditingDate: [formatedStartDate, [Validators.required]],
      AmountPaid: ['€ ' + claim.AmountPaid, [Validators.required]],
    });
    return form;
  }
}
