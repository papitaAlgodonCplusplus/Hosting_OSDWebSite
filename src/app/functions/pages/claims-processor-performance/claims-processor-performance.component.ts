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

@Component({
  selector: 'app-claims-processor-performance',
  templateUrl: './claims-processor-performance.component.html',
  styleUrls: ['./claims-processor-performance.component.css']
})
export class ClaimsProcessorPerformanceComponent implements OnDestroy {
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
    private OSDEventService: OSDService
  ) {
    this.performanceForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.type = this.typesOfPerformanceClaimsService.getTypesProcessor()
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
      Processor_WorkHours: ['', [Validators.required]],
      Processor_TravelTime: ['', [Validators.required]],
      Processor_TravelExpenses: [0, [Validators.required]],
      Processor_Remuneration: ['', [Validators.required]],
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

  verifiedFormat(data: string) {
    const formValues = this.performanceForm.value;
    let travelTime, workHours, expenses;

    switch (data) {
      case "processor":
        travelTime = formValues.Processor_TravelTime;
        workHours = formValues.Processor_WorkHours;
        expenses = formValues.Processor_TravelExpenses;
        break;
      case "trainer":
        travelTime = formValues.Trainer_TravelTime;
        workHours = formValues.Trainer_WorkHours;
        expenses = formValues.Trainer_TravelExpenses;
        break;
      default:
        return;
    }

    const isTravelTimeValid = this.validateTravelTime(travelTime);
    const isWorkHoursValid = this.validateWorkHours(workHours);

    if (isTravelTimeValid && isWorkHoursValid && expenses >= 0) {
      if (data === "processor") {
        this.chargeRemuneration(formValues);
      } else if (data === "trainer") {
        this.chargeRemunerationTD(formValues);
      }
    } else {
      if (data === "processor") {
        this.performanceForm.patchValue({ Processor_Remuneration: '' });
      } else if (data === "trainer") {
        this.performanceForm.patchValue({ Trainer_Remuneration: '' });
      }
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

  chargeRemunerationTD(formValues: any) {
    const trainerWorkHours = this.convertTimeToMinutes(formValues.Trainer_WorkHours) / 60;
    const trainerTransportHours = this.convertTimeToMinutes(formValues.Trainer_TravelTime) / 60;
    const trainerTransportExpenses = Number(formValues.Trainer_TravelExpenses);

    const totalWorkHours = trainerWorkHours * 60;
    const totalTransportHours = trainerTransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + trainerTransportExpenses;

    this.performanceForm.patchValue({
      Trainer_Remuneration: total
    });
  }

  chargeRemuneration(formValues: any) {
    const ProcessorWorkHours = this.convertTimeToMinutes(formValues.Processor_WorkHours) / 60;
    const ProcessorTransportHours = this.convertTimeToMinutes(formValues.Processor_TravelTime) / 60;
    const ProcessorTransportExpenses = Number(formValues.Processor_TravelExpenses);

    const totalWorkHours = ProcessorWorkHours * 60;
    const totalTransportHours = ProcessorTransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + ProcessorTransportExpenses;
    this.performanceForm.patchValue({
      Processor_Remuneration: total
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
      this.OSDEventService.createClaimsProcessorPerformance(this.performanceForm.value, this.claimId);
    }
  }
}
