import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { CreateClaimValuationEvent } from '../../Interface/ClaimValuation.interface';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/models/userInfo';
import { EventConstants } from 'src/app/models/eventConstants';
import { FreeProfessional } from '../../models/FreeProfessional';

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
  isSubscriber: boolean = true;
  isClaimant: boolean = true;
  isFreeProfessional: boolean = true;
  isAssignedClaim: boolean = false;
  showModalRatings: boolean = false;
  showModalPerformances: boolean = false;
  user!: UserInfo
  document1!: string;
  document2!: string;
  allPerformances!: any[];

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private osdDataService: OSDDataService,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.fileManager = this.createForm();
    this.closeClaimfileForm = this.createCloseClaimFileForm();
  }

  ngOnInit() {
    this.assignValuation()
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.claim$.subscribe(claim => {
        this.fileManager = this.fillForm(claim);
        this.claimId = claim.Id;
        if (claim.Status == "Running") {
          this.isAssignedClaim = true;
        } else if (claim.Status == "Finished") {
          this.isAssignedClaim = false;
          this.showModalRatings = true;
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
      claimant: [this.translate.instant(claim.Claimtype)],
      state: [this.translate.instant(claim.Status)],
      subscriber: [claim.NameCompanySubscriberclaimed],
      amountClaimed: [claim.Amountclaimed],
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
    // Asegurarte de que se pagine sobre el array que contiene todas las entidades.
    this.displayedItems = this.allPerformances.slice(startIndex, endIndex);
  }


  viewPerformance(performance: any) {
    console.log(performance.typePerformance)
    if(performance.typePerformance == "ClaimantCustomer"){
      this.router.navigate(["/functions/claimant-and-claims-customer-performance"]);
      //this.store.dispatch(PerformanceActions.setPerformanceClaim({ performanceClaim: performance }))
    }
    else if(performance.typePerformance == "Processor"){
      this.router.navigate(["/functions/claims-processor-performance"]);
    }
    else{
      this.router.navigate(["/functions/claims-trainer-performance"]);

    }
  }

  assignValuation() {
    var userInfo = this.authenticationService.userInfo
    if (userInfo?.AccountType == "SubscriberCustomer") {
      this.isSubscriber = false
    }
    else if (userInfo?.AccountType == "Claimant") {
      this.isClaimant = false
    }
    else {
      this.isFreeProfessional = false
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

}
