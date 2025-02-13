import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions, ModalActions } from 'src/app/store/actions';
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
  selectedOption: string = ''; // Default selection
  uploadFile: boolean = true;
  editingPerformance: any = null;

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
  public modalPerformance: any; // Holds the full 'performance' object for documents, etc.
  canCloseClaim: boolean = true;
  canAddUpdate: boolean = true;

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
      document2: [''],
      summary: [''],
      improvementSavings: [''],
      amountPaid: [''],
      creditingDate: [''],
      askForMoreInfo: [false],
      factsUpdate: [''],
      solutionSuggestion: [''],
      solutionAppeal: [''],
      solutionComplaint: [''],
      appeal: [''],
      complaint: [''],
      answer_to_appeal: [''],
      solution: [''],
      userid: [''],
      timeTaken: [''],
    });

    // NEW: Finalize Form for user rating 0-5
    this.finalizeForm = this.formBuilder.group({
      finalRating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      savingsImprovement: [''],
      claimantPayment: [''],
    });
  }

  handleFileUploaded(event: { typeFile: string, fileId: string }): void {
    this.addUpdateForm.patchValue({ document: event.fileId });
  }

  handleFileUploaded2(event: { typeFile: string, fileId: string }): void {
    console.log("Event", event);
    this.addUpdateForm.patchValue({ document2: event.fileId });
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

        if (claim.status === 'Closed') {
          this.canCloseClaim = false;
          this.canAddUpdate = false;
        }
        if (claim.status === "Running") {
          this.isAssignedClaim = true;
          this.isTerminatedPerformance = true;
        } else if (claim.status === "Closed") {
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
        this.canCloseClaim = true;
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
          this.addUpdateForm.get('document2')?.disable();
          this.addUpdateForm.get('improvementSavings')?.disable();
          this.addUpdateForm.get('amountPaid')?.disable();
          this.addUpdateForm.get('creditingDate')?.disable();
          this.addUpdateForm.get('answer_to_appeal')?.disable();
        } else {
          // Re-enable them if unchecked
          this.addUpdateForm.get('status')?.enable();
          this.addUpdateForm.get('document')?.enable();
          this.addUpdateForm.get('document2')?.enable();
          this.addUpdateForm.get('improvementSavings')?.enable();
          this.addUpdateForm.get('amountPaid')?.enable();
          this.addUpdateForm.get('creditingDate')?.enable();
          this.addUpdateForm.get('answer_to_appeal')?.enable();
        }
      });
    }, 500);
  }

  copyText(to_copy: any): void {
    let text: string | undefined;
    switch (to_copy) {
      case 'facts':
        text = this.claim.facts;
        break;
      case 'complaint':
        text = this.claim.complaint;
        break;
      case 'appeal':
        text = this.claim.appeal;
        break;
      case 'solution_suggestion':
        text = this.claim.solution_suggestion;
        break;
      case 'solution_appeal':
        text = this.claim.solution_appeal;
        break;
      case 'answer_to_appeal':
        text = this.claim.answer_to_appeal;
        break;
      case 'solution':
        text = this.claim.solution;
        break;
      case 'solution_complaint':
        text = this.claim.solution_complaint;
        break;
      case 'code':
        text = this.claim.code;
        break;
      default:
        text = '';
    }

    if (!text) { return; }
    navigator.clipboard.writeText(text).then(() => {
      // Optionally, display a toast or alert indicating success
      console.log('Text copied successfully');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }

  // Opens the modal with the passed performance, content, and title.
  openTextModal(performance: any, content: string, title: string): void {
    this.modalPerformance = performance; // store the entire row object
    this.modalContent = content;
    this.modalTitle = this.translate.instant(title);
    this.showTextModal = true;
  }

  // Closes the text modal.
  closeTextModal(): void {
    this.showTextModal = false;
  }

  downloadSelectedFile(optionalDocument: any) {
    let fileId: string;

    console.log("Optional Document", optionalDocument);
    if (optionalDocument && optionalDocument !== '') {
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
    if (this.canAddUpdate) {
      // If the performance modal is open, close it first
      this.closePerformanceModal();
      this.showAddUpdateModal = true;
    } else {
      alert(this.translate.instant('This claim is already closed.'));
    }
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

    const { status, document, document2, summary, improvementSavings, amountPaid, creditingDate, solution } = this.addUpdateForm.value;

    try {
      // Extract filetype from the document fields
      const filetype = document ? document.split('.').pop() : null;
      const document2Type = document2 ? document2.split('.').pop() : null;

      formData.timeTaken = formData.timeTaken + 'm';

      const payload = {
        ClaimId: this.claim.id,
        NewStatus: status,
        Document: document,
        FileType: filetype,
        Document2: document2,
        Document2Type: document2Type,
        Summary: summary,
        ImprovementSavings: improvementSavings,
        AmountPaid: amountPaid,
        CreditingDate: creditingDate,
        askForMoreInfo: !!formData.askForMoreInfo,
        FactsUpdate: formData.factsUpdate || null,
        appeal: formData.appeal || null,
        complaint: formData.complaint || null,
        solutionSuggestion: formData.solutionSuggestion || null,
        solutionAppeal: formData.solutionAppeal || null,
        answer_to_appeal: formData.answer_to_appeal || null,
        solution: solution || null,
        solutionComplaint: formData.solutionComplaint || null,
        userid: this.user.Id || '0',
        performanceId: this.editingPerformance?.id || null,
        timeTaken: formData.timeTaken || null
      };

      console.log("Add/Update payload", payload, "Is editing?", this.editingPerformance);

      if (this.editingPerformance) {
        // Call your update service method
        await this.osdEventService.updatePerformanceUpdate(payload);
        // Clear the edit mode flag
        this.editingPerformance = null;
      } else {
        // Call your add service method
        await this.osdEventService.addPerformanceUpdate(payload).subscribe(() => {
          this.osdEventService.sendNewPerformanceUpdateToEveryone(this.claim, this.user.Id).subscribe(() => {
            console.log('New performance update sent to everyone');
          });
        });
      }

      this.store.dispatch(
        ModalActions.addAlertMessage({ alertMessage: "Success!" })
      );
      this.store.dispatch(ModalActions.openAlert());
      this.closeAddUpdateModal();
      this.osdEventService.gettingClaimsData(this.user.Id, "")
    } catch (error) {
      console.error("Error submitting update:", error);
    }
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
  }

  openEditPerformance(performance: any): void {
    // Save the performance to indicate we are in edit mode.
    this.editingPerformance = performance;

    // Patch the Add Update form with the performance's current values.
    this.addUpdateForm.patchValue({
      status: performance.status || '',
      document: performance.document || '',
      document2: performance.document2 || '',
      summary: performance.summary || '',
      improvementSavings: performance.improvementSavings || '',
      amountPaid: performance.amountPaid || '',
      creditingDate: performance.creditingDate || '',
      askForMoreInfo: false,
      factsUpdate: performance.factsUpdate || performance.facts || '',
      appeal: performance.appeal || '',
      complaint: performance.complaint || '',
      solutionSuggestion: performance.solution_suggestion || '',
      solutionAppeal: performance.solution_appeal || '',
      answer_to_appeal: performance.answer_to_appeal || '',
      solution: performance.solution || '',
      solutionComplaint: performance.solution_complaint || '',
      userid: performance.userid || '',
      timeTaken: performance.time_taken || ''
    });

    // Open the Add Update modal.
    this.showAddUpdateModal = true;
    this.showModalPerformances = false;
  }

  /** ==============================
   *    Finalize Claim (Rating)
   *  ============================== */
  openFinalizeModal(): void {
    this.showFinalizeModal = true;
    this.showModalPerformances = false; // Make sure the other modal is closed
    console.log('showFinalizeModal just set to', this.showFinalizeModal);
    // ...
  }

  closeFinalizeModal(): void {
    this.showFinalizeModal = false;
    this.changeDetectorRef.detectChanges();
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
    const valFree = (claim?.valuationfreeprofessionals === '-1' || claim?.valuationfreeprofessionals === '-1')
      ? 'None'
      : claim?.valuationfreeprofessionals;

    const valClaimant = (claim?.valuationclaimant === '-1' || claim?.valuationclaimant === '-1')
      ? 'None'
      : claim?.valuationclaimant;

    const valSubscriber = (claim?.valuationsubscriber === '-1' || claim?.valuationsubscriber === '-1')
      ? 'None'
      : claim?.valuationsubscriber;
    const formGroup = this.formBuilder.group({
      code: [claim?.code || ''],
      claimant: [this.translate.instant(claim?.claimtype || '')],
      state: [this.translate.instant(claim?.status || '')],
      subscriber: [claim?.namecompanysubscriberclaimed || ''],
      amountClaimed: ['€ ' + (claim?.amountclaimed || 0)],
      facts: [claim?.facts || ''],
      valuationSubscriber: [valSubscriber],
      valuationClaimant: [valClaimant],
      valuationFreeProfessionals: [valFree],
      complaint: [claim?.complaint || ''],
      appeal: [claim?.appeal || ''],
      solution_suggestion: [claim?.solution_suggestion || ''],
      solution_appeal: [claim?.solution_appeal || ''],
      answer_to_appeal: [claim?.answer_to_appeal || ''],
      solution: [claim?.solution || ''],
      solution_complaint: [claim?.solution_complaint || ''],
      userid: [this.authenticationService.userInfo?.Id || '']
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
    const savingsImprovement = this.finalizeForm.value.savingsImprovement;
    const claimantPayment = this.finalizeForm.value.claimantPayment;
    // Merge rating into your final payload
    const payload = {
      ...this.closeClaimfileForm.value,
      finalRating: rating,
      savingsImprovement: savingsImprovement,
      claimantPayment: claimantPayment
    };

    // Now call your service method
    this.osdEventService.CloseClaimFile(payload, this.claim?.id, this.user.Id);

    this.store.dispatch(
      ModalActions.addAlertMessage({ alertMessage: "Success!" })
    );
    this.store.dispatch(ModalActions.openAlert());
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
