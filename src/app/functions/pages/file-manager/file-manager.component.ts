import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class FileManagerComponent implements OnInit, OnDestroy {
  fileManager!: FormGroup;
  closeClaimfileForm!: FormGroup;
  addUpdateForm!: FormGroup;

  /** NEW: Form & Flag to gather a final rating before finalizing claim */
  finalizeForm!: FormGroup;
  showFinalizeModal: boolean = false;

  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  claim!: Claim;
  claimId!: string;
  displayedItems: any[] = [];
  isSubscriber: boolean = false;
  isClaimant: boolean = false;
  isFreeProfessional: boolean = false;
  isAssignedClaim: boolean = false;
  showModalRatings: boolean = false;
  showModalPerformances: boolean = false;
  showAddUpdateModal: boolean = false;
  showEvalDialog: boolean = false;
  allPerformances!: any[];
  isTerminatedPerformance: boolean = false;

  user!: UserInfo;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private osdDataService: OSDDataService,
    private router: Router,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService
  ) {
    // Main forms
    this.fileManager = this.createForm();
    this.closeClaimfileForm = this.createCloseClaimFileForm();

    // "Add Update" form
    this.addUpdateForm = this.formBuilder.group({
      status: ['', Validators.required],
      document: [''],
      summary: ['', Validators.required],
      improvementSavings: ['', Validators.required],
      amountPaid: ['', Validators.required],
      creditingDate: ['', Validators.required]
    });

    // NEW: Finalize Form for user rating 0-5
    this.finalizeForm = this.formBuilder.group({
      finalRating: [0, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());

      this.claim$.subscribe(claim => {
        this.fileManager = this.fillForm(claim);
        this.claimId = claim.Id;
        this.claim = claim;
        this.changeDetectorRef.detectChanges();

        if (claim.Status === "Running") {
          this.isAssignedClaim = true;
          this.isTerminatedPerformance = true;
        } else if (claim.Status === "Completed") {
          this.isAssignedClaim = false;
          this.assignValuation(claim);
          this.closeClaimfileForm = this.fillFormCloseClaimFile(claim);
        }
      });

      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo;
      }
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  /** ==============================
   *       "Add Update" Modal 
   *  ============================== */
  openAddUpdateModal(): void {
    // If the performance modal is open, close it first
    this.closePerformanceModal();
    this.showAddUpdateModal = true;
  }

  closeAddUpdateModal(): void {
    this.showAddUpdateModal = false;
    this.addUpdateForm.reset();
  }

  async submitAddUpdate(): Promise<void> {
    if (this.addUpdateForm.invalid) {
      this.addUpdateForm.markAllAsTouched();
      return;
    }

    const { status, document, summary, improvementSavings, amountPaid, creditingDate } = this.addUpdateForm.value;

    try {
      const payload = {
        ClaimId: this.claim.id,
        NewStatus: status,
        Document: document,
        Summary: summary,
        ImprovementSavings: improvementSavings,
        AmountPaid: amountPaid,
        CreditingDate: creditingDate
      };

      await this.osdEventService.addPerformanceUpdate(payload);

      this.closeAddUpdateModal();
    } catch (error) {
      console.error('Error submitting update:', error);
    }
  }

  /** ==============================
   *    Finalize Claim (Rating)
   *  ============================== */
  openFinalizeModal(): void {
    this.showFinalizeModal = true;
  }

  closeFinalizeModal(): void {
    this.showFinalizeModal = false;
  }

  submitFinalize(): void {
    this.closeClaimFileDirect();
  }

  /** ==============================
   *        Form Builders
   *  ============================== */
  private createForm(): FormGroup {
    return this.formBuilder.group({
      claimant: [''],
      state: [''],
      subscriber: [''],
      amountClaimed: [''],
      freeProfessional: [''],
      valuationSubscriber: [],
      valuationClaimant: [],
      valuationFreeProfessionals: [],
    });
  }

  private fillForm(claim: Claim): FormGroup {
    return this.formBuilder.group({
      code: [claim.code],
      claimant: [this.translate.instant(claim.claimtype)],
      state: [this.translate.instant(claim.status)],
      subscriber: [claim.namecompanysubscriberclaimed],
      amountClaimed: ['€ ' + claim.amountclaimed],
      facts: [claim.facts],
      valuationSubscriber: [claim.valuationsubscriber || 0],
      valuationClaimant: [claim.valuationclaimant || 0],
      valuationFreeProfessionals: [claim.valuationfreeprofessionals || 0],
    });
  }

  private createCloseClaimFileForm(): FormGroup {
    return this.formBuilder.group({
      AAsavingsPP: ['', [Validators.required]],
      creditingDate: ['', [Validators.required]],
      AmountPaid: ['', [Validators.required]],
    });
  }

  private fillFormCloseClaimFile(claim: Claim): FormGroup {
    let originalDate = claim.Date;
    let parts = originalDate.split("/");
    let formattedDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    let formatedStartDate = this.datePipe.transform(formattedDate, 'yyyy-MM-dd');

    return this.formBuilder.group({
      AAsavingsPP: ['€ ' + claim.improvementsavings, [Validators.required]],
      creditingDate: [formatedStartDate, [Validators.required]],
      AmountPaid: ['€ ' + claim.amountpaid, [Validators.required]],
    });
  }

  /** ==============================
   *         Performance
   *  ============================== */
  async openPerformanceClaimsModal() {
    this.showModalPerformances = true;
    if (this.claim?.id) {
      await this.osdEventService.GetPerformancesClaimById(this.claim?.id);

      combineLatest([
        this.osdDataService.claimantAndClaimsCustomerPerformanceList$.pipe(
          map(performanceClaim => performanceClaim.map(item => ({ ...item, typePerformance: 'ClaimantCustomer' })))
        )
      ]).subscribe(([claimantAndCustomer]) => {
        this.allPerformances = [...claimantAndCustomer];
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
    if (performance.typePerformance === "ClaimantCustomer") {
      this.router.navigate(["/functions/claimant-and-claims-customer-performance"]);
      this.store.dispatch(PerformanceActions.setClaimantAndClaimsCustomerPerformance({ performanceClaim: performance }));
    }
    else if (performance.typePerformance === "Processor") {
      this.router.navigate(["/functions/claims-processor-performance"]);
      this.store.dispatch(PerformanceActions.setClaimProcessorPerformance({ performanceClaim: performance }));
    }
    else {
      this.router.navigate(["/functions/claims-trainer-performance"]);
      this.store.dispatch(PerformanceActions.setClaimTrainerPerformance({ performanceClaim: performance }));
    }
  }

  /** ==============================
   *       Ratings & Valuation
   *  ============================== */
  async assignValuation(claim: Claim) {
    const userInfo = this.authenticationService.userInfo;
    if (userInfo?.AccountType === "SubscriberCustomer") {
      this.isSubscriber = true;
      if (claim.Valuationsubscriber === "0") {
        this.showModalRatings = true;
      }
    }
    else if (userInfo?.AccountType === "Claimant") {
      this.isClaimant = true;
      if (claim.Valuationclaimant === "0") {
        this.showModalRatings = true;
      }
    }
    else {
      this.osdEventService.GetFreeProfessionalsDataEvent();
      const freeProfessionals = await this.osdEventService.getFreeProfessionalsList();
      if (Array.isArray(freeProfessionals)) {
        const freeProfessionalFind: FreeProfessional | undefined = freeProfessionals.find(fp => fp.Userid === this.user.Id);
        if (freeProfessionalFind?.FreeprofessionaltypeName === "Processor") {
          this.isFreeProfessional = true;
          if (claim.Valuationfreeprofessionals === "0") {
            this.showModalRatings = true;
          }
        }
      }
    }
  }

  updateValuation() {
    const valuationForm: CreateClaimValuationEvent = {
      ClaimId: this.claimId,
      ValuationClaimant: this.fileManager.value.valuationClaimant,
      ValuationFreeProfessionals: this.fileManager.value.valuationFreeProfessionals,
      ValuationSubscriber: this.fileManager.value.valuationSubscriber
    };
    this.osdEventService.UpdateValuation(valuationForm);
    this.closeModalRatings();
  }

  closeModalRatings() {
    this.showModalRatings = false;
  }

  /** ==============================
   *        Finalizing
   *  ============================== */
  closeClaimFileDirect() {
    if (this.finalizeForm.invalid) {
      this.finalizeForm.markAllAsTouched();
      return;
    }

    const rating = this.finalizeForm.value.finalRating;
    // Merge rating into your final payload
    const payload = {
      ...this.closeClaimfileForm.value,
      finalRating: rating
    };

    // Now call your service method
    this.osdEventService.CloseClaimFile(payload, this.claim?.id, this.user.Id);

    // Hide modal afterwards
    this.closeFinalizeModal();
  }

  showRatingDialog() {
    this.showEvalDialog = true;
  }

  closeModalEval() {
    this.showEvalDialog = false;
  }

  /** ==============================
   *   Final fallback methods
   *  ============================== */
  onSubmit(): void {
    if (this.fileManager.invalid) {
      this.fileManager.markAllAsTouched();
      return;
    }
  }

  async newPerformance() {
    if (this.user.AccountType === EventConstants.SUBSCRIBER_CUSTOMER || this.user.AccountType === EventConstants.CLAIMANT) {
      this.router.navigate(['/functions/claimant-and-claims-customer-performance']);
    }
    else if (this.user.AccountType === EventConstants.FREE_PROFESSIONAL) {
      await this.osdEventService.GetFreeProfessionalsDataEvent();
      const freeProfessionals = await this.osdEventService.getFreeProfessionalsList();
      if (Array.isArray(freeProfessionals)) {
        const freeProfessionalFind: FreeProfessional | undefined = freeProfessionals.find(fp => fp.Userid === this.user.Id);
        if (freeProfessionalFind?.FreeprofessionaltypeName === "Trainer") {
          this.router.navigate(['/functions/claims-trainer-performance']);
        } else if (freeProfessionalFind?.FreeprofessionaltypeName === "Processor") {
          this.router.navigate(['/functions/claims-processor-performance']);
        }
      }
    }
  }
}
