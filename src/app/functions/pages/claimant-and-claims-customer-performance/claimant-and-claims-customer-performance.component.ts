import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { ClaimActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventConstants } from 'src/app/models/eventConstants';
import { FreeProfessional } from '../../models/FreeProfessional';
import { ClaimantAndClaimsCustomerPerformance } from '../../models/ClaimantAndClaimsCustomerPerformance';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-claimant-and-claims-customer-performance',
  templateUrl: './claimant-and-claims-customer-performance.component.html',
  styleUrls: ['./claimant-and-claims-customer-performance.component.css']
})
export class ClaimantAndClaimsCustomerPerformanceComponent implements OnDestroy {
  performanceForm: FormGroup;
  documentName!: string;
  selectedType: string | undefined;
  type: DropDownItem[] = [];
  claimId!: string;
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  performance$: Observable<ClaimantAndClaimsCustomerPerformance> = this.store.select(PerformanceSelectors.claimantAndClaimsCustomerPerformance);
  performance!: ClaimantAndClaimsCustomerPerformance;
  isErrorInForm: boolean = false;
  isTrainer: boolean = true;
  isUnrevised: boolean = false;
  isViewPerformance!: boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService,
    private OSDEventService: OSDService,
    private AuthenticationService: AuthenticationService,
    private datePipe: DatePipe
  ) {
    this.performanceForm = this.createForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
    }, 0);

    if (this.AuthenticationService.userInfo) {
      var accountType = this.AuthenticationService.userInfo.AccountType;
      if (accountType == EventConstants.CLAIMANT) {
        this.type = this.typesOfPerformanceClaimsService.getTypesClaimant()
      } else if (accountType == EventConstants.SUBSCRIBER_CUSTOMER) {
        this.type = this.typesOfPerformanceClaimsService.getTypesSubscriber()
      }
      else {
        this.OSDEventService.GetFreeProfessionalsDataEvent();
        this.OSDEventService.getFreeProfessionalsList()
          .then(freeProfessionals => {
            if (Array.isArray(freeProfessionals)) {
              var freeProfessionalFind: FreeProfessional = freeProfessionals.find(fp => fp.Userid == this.AuthenticationService.userInfo?.Id)
              if (freeProfessionalFind.FreeprofessionaltypeName == "Trainer") {
                this.isTrainer = false
              }
            }
          })
      }
    }

    this.performance$.subscribe(performanceClaim => {
      if (performance) {
        this.performance = performanceClaim;
        this.performanceForm = this.fillForm(performanceClaim)
        if (performanceClaim.TrainerWorkHours != null) {
          this.isUnrevised = true;
        }
      }
    })
    
    if(this.performance.Id != null){
      this.isViewPerformance = true;
    }else{
      this.isViewPerformance = false;
    }

    this.claim$.subscribe(claim => {
      this.claimId = claim.Id;
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.store.dispatch(PerformanceActions.setClaimantAndClaimsCustomerPerformance({ performanceClaim: {} as ClaimantAndClaimsCustomerPerformance }))
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      Summary: ['', [Validators.required]],
      Trainer_Date: [''],
      Trainer_WorkHours: [''],
      Trainer_TravelTime: [''],
      Trainer_TravelExpenses: [''],
      Trainer_Remuneration: ['']
    });
    return form;
  }

  private fillForm(performance: ClaimantAndClaimsCustomerPerformance): FormGroup {
    this.type = [
      ...this.typesOfPerformanceClaimsService.getTypesSubscriber(),
      ...this.typesOfPerformanceClaimsService.getTypesClaimant()
    ];
    let originalDate = performance.Date;
    let formatedStartDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');
    this.documentName = performance.JustifyingDocument
    const form = this.formBuilder.group({
      Date: [formatedStartDate, [Validators.required]],
      Type: [performance.Type, [Validators.required]],
      JustifyingDocument: [performance.JustifyingDocument, [Validators.required]],
      Summary: [performance.Summary, [Validators.required]],
      Trainer_Date: [''],
      Trainer_WorkHours: [''],
      Trainer_TravelTime: [''],
      Trainer_TravelExpenses: [''],
      Trainer_Remuneration: ['']
    });
    return form;
  }

  displayFileName(): void {
    const justifyingDocument = document.getElementById('JustifyingDocument') as HTMLInputElement;
    if (justifyingDocument.value !== null) {
      this.documentName = justifyingDocument.value;
      this.isErrorInForm = false;
    }
  }

  verifiedFormat() {
    const formValues = this.performanceForm.value;
    let travelTime, workHours, expenses;

    travelTime = formValues.Trainer_TravelTime;
    workHours = formValues.Trainer_WorkHours;
    expenses = formValues.Trainer_TravelExpenses;

    const isTravelTimeValid = this.validateTravelTime(travelTime);
    const isWorkHoursValid = this.validateWorkHours(workHours);

    if (isTravelTimeValid && isWorkHoursValid && expenses >= 0) {

      this.chargeRemunerationTrainer(formValues);
    } else {
      this.performanceForm.patchValue({ Trainer_Remuneration: '' });
    }
  }

  validateTravelTime(horaStr: string): boolean {
    const regex = /^([0-9]|[01][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regex.test(horaStr)) {
      return false;
    }
    const [hora, minutos] = horaStr.split(':').map(Number);
    return hora >= 0 && hora < 24 && minutos >= 0 && minutos < 60;
  }

  validateWorkHours(horaStr: string): boolean {
    const regex = /^([0-9]|[01][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regex.test(horaStr)) {
      return false;
    }
    const [hora, minutos] = horaStr.split(':').map(Number);
    return hora >= 0 && hora < 24 && minutos >= 0 && minutos < 60;
  }

  private convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  chargeRemunerationTrainer(formValues: any) {
    const WorkHours = this.convertTimeToMinutes(formValues.Trainer_WorkHours) / 60;
    const TransportHours = this.convertTimeToMinutes(formValues.Trainer_TravelTime) / 60;
    const TransportExpenses = Number(formValues.Trainer_TravelExpenses);

    const totalWorkHours = WorkHours * 60;
    const totalTransportHours = TransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + TransportExpenses;

    this.performanceForm.patchValue({
      Trainer_Remuneration: total
    });
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      this.isErrorInForm = true;
      return;
    }

    this.isErrorInForm = false;
    if (this.claimId) {
      this.OSDEventService.createClaimantAndClaimsCustomerPerformance(this.performanceForm.value, this.claimId);
    }
  }
}
