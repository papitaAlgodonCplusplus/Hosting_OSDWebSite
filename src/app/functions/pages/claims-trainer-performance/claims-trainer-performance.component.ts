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
  selector: 'app-claims-trainer-performance',
  templateUrl: './claims-trainer-performance.component.html',
  styleUrls: ['./claims-trainer-performance.component.css']
})
export class ClaimsTrainerPerformanceComponent implements OnDestroy {
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
      this.type = this.typesOfPerformanceClaimsService.getTypesClaimant()
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
      Trainer_WorkHours: ['', [Validators.required]],
      Trainer_TravelTime: ['', [Validators.required]],
      Trainer_TravelExpenses: ['', [Validators.required]],
      Trainer_Remuneration: ['', [Validators.required]],
      Technical_Director_Date: [''],
      Technical_Director_WorkHours: [''],
      Technical_Director_TravelTime: [''],
      Technical_Director_TravelExpenses: [''],
      Technical_Director_Remuneration: ['']
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
      case "trainer":
        travelTime = formValues.Trainer_TravelTime;
        workHours = formValues.Trainer_WorkHours;
        expenses = formValues.Trainer_TravelExpenses;
        break;
      case "technicalDirector":
        travelTime = formValues.Technical_Director_TravelTime;
        workHours = formValues.Technical_Director_WorkHours;
        expenses = formValues.Technical_Director_TravelExpenses;
        break;
      default:
        return;
    }
   
    const isTravelTimeValid = this.validateTravelTime(travelTime);
    const isWorkHoursValid = this.validateWorkHours(workHours);

    if (isTravelTimeValid && isWorkHoursValid && expenses >= 0) {
      if (data === "trainer") {
        this.chargeRemunerationTrainer(formValues);
      } else if (data === "technicalDirector") {
        this.chargeRemunerationTechnicalDirector(formValues);
      }
    } else {
      if (data === "trainer") {
        this.performanceForm.patchValue({ Trainer_Remuneration: '' });
      } else if (data === "technicalDirector") {
        this.performanceForm.patchValue({ Technical_Director_Remuneration: '' });
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

  chargeRemunerationTechnicalDirector(formValues: any) {
    const WorkHours = this.convertTimeToMinutes(formValues.Technical_Director_WorkHours) / 60;
    const TransportHours = this.convertTimeToMinutes(formValues.Technical_Director_TravelTime) / 60;
    const TransportExpenses = Number(formValues.Technical_Director_TravelExpenses);

    const totalWorkHours = WorkHours * 60;
    const totalTransportHours = TransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + TransportExpenses;
    this.performanceForm.patchValue({
      Technical_Director_Remuneration: total
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
      //this.OSDEventService.createPerformanceClaim(this.performanceForm.value, this.claimId);
    }
  }
}

