import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { UiActions } from 'src/app/store/actions';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { ClaimSelectors } from 'src/app/store/selectors';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventConstants } from 'src/app/models/eventConstants';

@Component({
  selector: 'app-claimant-and-claims-customer-performance',
  templateUrl: './claimant-and-claims-customer-performance.component.html',
  styleUrls: ['./claimant-and-claims-customer-performance.component.css']
})
export class ClaimantAndClaimsCustomerPerformanceComponent implements OnDestroy {
  performanceForm: FormGroup;
  documentName!: string;
  selectedType: string | undefined;
  type!: DropDownItem[];
  claimId!: string;
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  isErrorInForm: boolean = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService,
    private OSDEventService: OSDService,
    private AuthenticationService: AuthenticationService
  ) {
    this.performanceForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())

      if (this.AuthenticationService.userInfo) {
        var accountType = this.AuthenticationService.userInfo.AccountType;
        if (accountType == EventConstants.CLAIMANT) {
          this.type = this.typesOfPerformanceClaimsService.getTypesClaimant()
        } else {
          this.type = this.typesOfPerformanceClaimsService.getTypesSubscriber()
        }
      }
    }, 0);
    
    this.claim$.subscribe(claim => {
      this.claimId = claim.Id;
    });
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  private createRegisterForm(): FormGroup {
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
