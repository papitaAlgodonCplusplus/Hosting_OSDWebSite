import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-response-to-performance',
  templateUrl: './response-to-performance.component.html',
  styleUrls: ['./response-to-performance.component.css']
})
export class ResponseToPerformanceComponent implements OnDestroy {
  showPerformanceAssignedForm!: FormGroup;
  responsePerformanceForm!: FormGroup;
  DocumentIncreaseWorkingHours!: string;
  justifyingDocument!: string;
  isTechnicalDirector: boolean = true
  userInfo! : UserInfo

  constructor(private store: Store,
              private formBuilder: FormBuilder,
              private authenticationService : AuthenticationService,
              private osdEventService : OSDService) {
    this.responsePerformanceForm = this.createForm()
    this.showPerformanceAssignedForm = this.ShowForm()
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      FP_WorkHours: ['', [Validators.required]],
      FP_TravelTime: ['', [Validators.required]],
      FP_TravelExpenses: ['', [Validators.required]],
      FP_total: ['', [Validators.required]],
      JustifyChangeEstimatedWorkHours: [''],
      DocumentIncreaseWorkingHours: [''],
      TD_Date: [''],
      TD_WorkHours: [''],
      AcceptIncreaseInHours: [{ value: '',disabled: this.isTechnicalDirector}]
    });
    return form;
  }

  private ShowForm(): FormGroup {
    const form = this.formBuilder.group({
      start_date: [''],
      end_date: [''],
      freeProfessionalId: [''],
      freeProfessionalCode: [''],
      Summary: [''],
      JustifyingDocument: [''],
      ForecastTravelExpenses: [''],
      ForecastTravelTime: [''],
      ForecastWorkHours: [''],
      Totalforecastdata: ['']
    });
    return form;
  }

  onSubmit(): void {
    if (this.responsePerformanceForm.invalid) {
      this.responsePerformanceForm.markAllAsTouched();
      return;
    }
  }

  verifiedFormat(data: string) {
    const formValues = this.responsePerformanceForm.value;
    let travelTime, workHours, professionalFreeTransportExpenses;
    switch (data) {
      case "freeProfessional":
        travelTime = formValues.FP_TravelTime;
        workHours = formValues.FP_WorkHours;
        professionalFreeTransportExpenses = formValues.FP_TravelExpenses;
        break;
      case "technicalDirector":
        workHours = formValues.TD_WorkHours;
        travelTime = "0:00";
        break;
      default:
        return;
    }

    const isTravelTimeValid = this.validarHora(travelTime);
    const isWorkHoursValid = this.validarHora(workHours);

    if (isTravelTimeValid && isWorkHoursValid) {
      if (professionalFreeTransportExpenses != '') {
        this.totalExpensesOfFreeProfessional(formValues);
      }
    } else {
      if (professionalFreeTransportExpenses != '') {
        this.responsePerformanceForm.patchValue({ FP_total: '' });
      }
    }
  }

  validarHora(horaStr: string): boolean {
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

  totalExpensesOfFreeProfessional(formValues: any) {
    const FreeProfessionalWorkHours = this.convertTimeToMinutes(formValues.FP_WorkHours) / 60;
    const FreeProfessionalTransportHours = this.convertTimeToMinutes(formValues.FP_TravelTime) / 60;
    const FreeProfessionalExpenses = Number(formValues.FP_TravelExpenses);

    const totalWorkHours = FreeProfessionalWorkHours * 60;
    const totalTransportHours = FreeProfessionalTransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + FreeProfessionalExpenses;

    this.responsePerformanceForm.patchValue({
      FP_total: total
    });
  }

  displayFileName(): void {
    const DocumentIncreaseWorkingHours = document.getElementById('DocumentIncreaseWorkingHours') as HTMLInputElement;

    if (DocumentIncreaseWorkingHours.value !== null) {
      this.DocumentIncreaseWorkingHours = DocumentIncreaseWorkingHours.value;
    }
  }
}
