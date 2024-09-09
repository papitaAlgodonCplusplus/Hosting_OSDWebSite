import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { PerformanceFreeProfessional } from '../../Models/performanceFreeProfessional';
import { PerformanceSelectors } from 'src/app/store/selectors';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ResponseToPerformanceFreeProfessional } from '../../Models/responseToperformanceFreeProfessional';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-response-to-performance',
  templateUrl: './response-to-performance.component.html',
  styleUrls: ['./response-to-performance.component.css']
})
export class ResponseToPerformanceComponent implements OnDestroy {
  showPerformanceAssignedForm!: FormGroup;
  showPerformanceResponseForm!: FormGroup;
  responsePerformanceForm!: FormGroup;
  DocumentIncreaseWorkingHours!: string;
  justifyingDocument!: string;
  isTechnicalDirector: boolean = true
  userInfo!: UserInfo
  modifiedPerformanceFP: any;
  visualizePerformanceFP: any;
  performanceAssigned$: Observable<PerformanceFreeProfessional> = this.store.select(PerformanceSelectors.projectPerformance);
  subPerformance$: Observable<ResponseToPerformanceFreeProfessional> = this.store.select(PerformanceSelectors.projectSubPerformance);
  isWorkMore: boolean = false;
  
  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private osdEventService: OSDService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,) {
    this.showPerformanceAssignedForm = this.ShowForm()
    this.responsePerformanceForm = this.ShowResponseForm()
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.store.dispatch(PerformanceActions.setSubPerformance({subPerformance: {} as ResponseToPerformanceFreeProfessional}));
    }, 0);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.modifiedPerformanceFP = params['modified'];
    });
    this.route.queryParams.subscribe(params => {
      this.visualizePerformanceFP = params['visualize'];
    });
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
      Total_FP: ['', [Validators.required]],
      JustifyChangeEstimatedWorkHours: [''],
      DocumentIncreaseWorkingHours: [''],
      TD_Date: [''],
      TD_WorkHours: [''],
      AcceptIncreaseInHours: [{ value: '', disabled: this.isTechnicalDirector }]
    });
    return form;
  }

  private ShowForm(): FormGroup {
    var fillForm = {} as PerformanceFreeProfessional;
    this.performanceAssigned$.subscribe(performance => {
      fillForm = performance
    })

    this.justifyingDocument = fillForm.JustifyingDocument

    let originalStartDate = fillForm.Start_Date;
    let formatedStartDate = this.datePipe.transform(originalStartDate, 'yyyy-MM-dd');

    let originalEndDate = fillForm.End_Date;
    let formatedEndDate = this.datePipe.transform(originalEndDate, 'yyyy-MM-dd');

    const form = this.formBuilder.group({
      start_date: formatedStartDate,
      end_date: formatedEndDate,
      freeProfessionalId: fillForm.FreeProfessionalId,
      freeProfessionalCode: fillForm.FreeProfessionalAssignedCode,
      Summary: fillForm.SummaryTypeName,
      JustifyingDocument: fillForm.JustifyingDocument,
      ForecastTravelExpenses: fillForm.ForecastTravelExpenses,
      ForecastTravelTime: fillForm.ForecastTravelTime,
      ForecastWorkHours: fillForm.ForecastWorkHours,
      Totalforecastdata: fillForm.TotalForecastData
    });
    return form;
  }

  private ShowResponseForm(): FormGroup {
    var fillForm = {} as ResponseToPerformanceFreeProfessional;
    if(fillForm != null ){
      this.subPerformance$.subscribe(performance => {
        fillForm = performance
      })
  
      this.showPerformanceResponseForm = this.formBuilder.group({
        FP_WorkHours: fillForm.FP_WorkHours,
        FP_TravelTime: fillForm.FP_TravelTime,
        FP_TravelExpenses: fillForm.FP_TravelExpenses,
        Total_FP: fillForm.Total_FP,
        JustifyChangeEstimatedWorkHours: fillForm.JustifyChangeEstimatedWorkHours,
        DocumentIncreaseWorkingHours: fillForm.DocumentIncreaseWorkingHours,
        TD_Date: fillForm.TD_Date,
        TD_WorkHours: fillForm.TD_WorkHours,
        AcceptIncreaseInHours: [{ value: '', disabled: this.isTechnicalDirector }]
      });

    }else{
      this.showPerformanceResponseForm = this.createForm()
    }
    
    return this.showPerformanceResponseForm;
  }

  onSubmit(): void {
    if (this.responsePerformanceForm.invalid) {
      this.responsePerformanceForm.markAllAsTouched();
      return;
    }
    var performanceAssigned = {} as PerformanceFreeProfessional;
    this.performanceAssigned$.subscribe(performance => {
      performanceAssigned = performance
    })
    this.osdEventService.addResponseToPerformanceAssigned(this.responsePerformanceForm.value, performanceAssigned.Id)
  }

  modifySubPerformance(): void {
    if (this.responsePerformanceForm.invalid) {
      this.responsePerformanceForm.markAllAsTouched();
      return;
    }
    var fillForm = {} as ResponseToPerformanceFreeProfessional;
    this.subPerformance$.subscribe(performance => {
      fillForm = performance
    })
    var performanceAssigned = {} as PerformanceFreeProfessional;
    this.performanceAssigned$.subscribe(performance => {
      performanceAssigned = performance
    })
    this.osdEventService.modifyResponseToPerformanceAssigned(fillForm.Id ,this.responsePerformanceForm.value, performanceAssigned.Id);
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
        this.responsePerformanceForm.patchValue({ Total_FP: '' });
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
      Total_FP: total
    });
  }

  displayFileName(): void {
    const DocumentIncreaseWorkingHours = document.getElementById('DocumentIncreaseWorkingHours') as HTMLInputElement;

    if (DocumentIncreaseWorkingHours.value !== null) {
      this.DocumentIncreaseWorkingHours = DocumentIncreaseWorkingHours.value;
    }
  }

  checkWorkHours() {
    var form = this.responsePerformanceForm.value;
    var isHourValid = this.validarHora(form.FP_WorkHours);

    if (isHourValid) {
      var formPerformanceAssigned = this.showPerformanceAssignedForm.value;
      var totalMinutesFreeProfessional = this.convertTimeToMinutes(form.FP_WorkHours) / 60;
      var totalMinutesForecastWorkHours = this.convertTimeToMinutes(formPerformanceAssigned.ForecastWorkHours) / 60;

      if (totalMinutesFreeProfessional > totalMinutesForecastWorkHours) {
        this.isWorkMore = true;

        this.responsePerformanceForm.get('JustifyChangeEstimatedWorkHours')?.setValidators(Validators.required);
        this.responsePerformanceForm.get('DocumentIncreaseWorkingHours')?.setValidators(Validators.required);

        this.responsePerformanceForm.get('JustifyChangeEstimatedWorkHours')?.updateValueAndValidity();
        this.responsePerformanceForm.get('DocumentIncreaseWorkingHours')?.updateValueAndValidity();
      } else {
        this.isWorkMore = false;

        this.responsePerformanceForm.get('JustifyChangeEstimatedWorkHours')?.clearValidators();
        this.responsePerformanceForm.get('DocumentIncreaseWorkingHours')?.clearValidators();

        this.responsePerformanceForm.get('JustifyChangeEstimatedWorkHours')?.updateValueAndValidity();
        this.responsePerformanceForm.get('DocumentIncreaseWorkingHours')?.updateValueAndValidity();
      }
    }
    else {
      this.isWorkMore = false;
      this.responsePerformanceForm.get('JustifyChangeEstimatedWorkHours')?.clearValidators();
      this.responsePerformanceForm.get('DocumentIncreaseWorkingHours')?.clearValidators();

      this.responsePerformanceForm.get('JustifyChangeEstimatedWorkHours')?.updateValueAndValidity();
      this.responsePerformanceForm.get('DocumentIncreaseWorkingHours')?.updateValueAndValidity();
    }
  }


}
