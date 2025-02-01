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
import { BackblazeService } from 'src/app/services/backblaze.service';
import { app } from 'server';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit, OnDestroy {
  fileManager!: FormGroup;
  closeClaimfileForm!: FormGroup;
  addUpdateForm!: FormGroup;
  selectedOption: string = 'complaint'; // Default selection
  uploadFile: boolean = true;

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
  isUserProcessor: boolean = false;
  isTrainer: boolean = false;
  showModalRatings: boolean = false;
  showModalPerformances: boolean = false;
  showAddUpdateModal: boolean = false;
  showEvalDialog: boolean = false;
  allPerformances!: any[];
  isTerminatedPerformance: boolean = false;
  public showTextModal: boolean = false;
  public modalContent: string = '';
  public modalTitle: string = '';

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
    private authenticationService: AuthenticationService,
    private backblazeService: BackblazeService,
  ) {
    // Main forms
    this.fileManager = this.createForm();
    this.closeClaimfileForm = this.createCloseClaimFileForm();

    // "Add Update" form
    this.addUpdateForm = this.formBuilder.group({
      status: [''],
      document: [''],
      summary: [''],
      improvementSavings: [''],
      amountPaid: [''],
      creditingDate: [''],
      askForMoreInfo: [false],
      factsUpdate: [''],
      solutionSuggestion: [''],
      solutionComplaint: [''],
      appeal: [''],
      complaint: [''],
      answer_to_appeal: [''],
      solution: ['']
    });

    // NEW: Finalize Form for user rating 0-5
    this.finalizeForm = this.formBuilder.group({
      finalRating: [0, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  handleFileUploaded(event: { typeFile: string, fileId: string }): void {
    this.addUpdateForm.patchValue({ document: event.fileId });
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

      console.log(this.user.AccountType, this.user.FreeProfessionalTypeID, this.user.AccountType);
      if (this.user.FreeProfessionalTypeID === '2fc2a66a-69ca-4832-a90e-1ff590b80d24') {
        this.isUserProcessor = true;
      } else if (this.user.FreeProfessionalTypeID === "eea2312e-6a85-4ab6-85ff-0864547e3870") {
        this.isTrainer = true;
      } else if (this.user.AccountType === "Claimant") {
        this.isClaimant = true;
      } else if (this.user.AccountType === "ApprovedTrainingCenter" || this.user.AccountType === "SubscriberCustomer") {
        this.isSubscriber = true;
      }

      // Subscribe to the checkbox changes
      this.addUpdateForm.get('askForMoreInfo')?.valueChanges.subscribe((checked: boolean) => {
        if (checked) {
          // Disable fields you want blocked
          this.addUpdateForm.get('status')?.disable();
          this.addUpdateForm.get('document')?.disable();
          this.addUpdateForm.get('improvementSavings')?.disable();
          this.addUpdateForm.get('amountPaid')?.disable();
          this.addUpdateForm.get('creditingDate')?.disable();
          this.addUpdateForm.get('answer_to_appeal')?.disable();
        } else {
          // Re-enable them if unchecked
          this.addUpdateForm.get('status')?.enable();
          this.addUpdateForm.get('document')?.enable();
          this.addUpdateForm.get('improvementSavings')?.enable();
          this.addUpdateForm.get('amountPaid')?.enable();
          this.addUpdateForm.get('creditingDate')?.enable();
          this.addUpdateForm.get('answer_to_appeal')?.enable();
        }
      });
    }, 0);
  }

  // Opens the modal with the passed content and title.
  openTextModal(content: string, title: string): void {
    this.modalContent = content;
    this.modalTitle = title;
    this.showTextModal = true;
  }

  // Closes the text modal.
  closeTextModal(): void {
    this.showTextModal = false;
  }
  
  downloadSelectedFile(optionalDocument: any) {
    let fileId: string;

    console.log("Optional Document", optionalDocument);
    if (optionalDocument !== '') {
      fileId = optionalDocument;
    } else {
      fileId = this.claim.documentfile1id;
    }

    if (!fileId) {
      return;
    }

    this.backblazeService.authorizeAccount().subscribe(response => {
      const apiUrl = response.apiUrl;
      const authorizationToken = response.authorizationToken;

      this.backblazeService.getDownloadUrl(apiUrl, authorizationToken, fileId).subscribe(downloadResponse => {
        const downloadUrl = downloadResponse.downloadUrl;
        const fileName = downloadResponse.fileName;
        if (!downloadUrl || !fileName) {
          return;
        }

        this.backblazeService.downloadFile(downloadUrl, fileName, authorizationToken).subscribe(blob => {
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName;
          link.click();
        }, error => {
          console.error(error);
        });
      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
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

    const formData = this.addUpdateForm.value;
    if (formData.status === 'Falta Información' && !formData.factsUpdate) {
      alert('Please provide updated facts.');
      return;
    }

    const { status, document, summary, improvementSavings, amountPaid, creditingDate, solution } = this.addUpdateForm.value;

    try {
      // Extract filetype from the document field
      const filetype = document ? document.split('.').pop() : null;

      const payload = {
        ClaimId: this.claim.id,
        NewStatus: status,
        Document: document,
        FileType: filetype, // Add filetype to the payload
        Summary: summary,
        ImprovementSavings: improvementSavings,
        AmountPaid: amountPaid,
        CreditingDate: creditingDate,
        askForMoreInfo: false,
        FactsUpdate: formData.factsUpdate || null,
        appeal: formData.appeal || null,
        complaint: formData.complaint || null,
        solutionSuggestion: formData.solutionSuggestion || null,
        answer_to_appeal: formData.answer_to_appeal || null,
        solution: solution || null,
        solutionComplaint: formData.solutionComplaint || null,
      };

      if (this.addUpdateForm.value.askForMoreInfo) {
        payload.askForMoreInfo = true;
      } else {
        payload.askForMoreInfo = false;
      }

      console.log("Add Update payload", payload);
      await this.osdEventService.addPerformanceUpdate(payload);

      this.closeAddUpdateModal();
    } catch (error) {
      console.error("Error submitting update:", error);
    }
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
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
    const formGroup = this.formBuilder.group({
      code: [claim?.code || ''],
      claimant: [this.translate.instant(claim?.claimtype || '')],
      state: [this.translate.instant(claim?.status || '')],
      subscriber: [claim?.namecompanysubscriberclaimed || ''],
      amountClaimed: ['€ ' + (claim?.amountclaimed || 0)],
      facts: [claim?.facts || ''],
      valuationSubscriber: [claim?.valuationsubscriber || 0],
      valuationClaimant: [claim?.valuationclaimant || 0],
      valuationFreeProfessionals: [claim?.valuationfreeprofessionals || 0],
      complaint: [claim?.complaint || ''],
      appeal: [claim?.appeal || ''],
      solution_suggestion: [claim?.solution_suggestion || ''],
      answer_to_appeal: [claim?.answer_to_appeal || ''],
      solution: [claim?.solution || ''],
      solution_complaint: [claim?.solution_complaint || ''],
    });
    return formGroup;
  }

  private createCloseClaimFileForm(): FormGroup {
    return this.formBuilder.group({
      AAsavingsPP: ['', [Validators.required]],
      creditingDate: ['', [Validators.required]],
      AmountPaid: ['', [Validators.required]]
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
      AmountPaid: ['€ ' + claim.amountpaid, [Validators.required]]
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
        console.log("Claimant and Customer", claimantAndCustomer);
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
