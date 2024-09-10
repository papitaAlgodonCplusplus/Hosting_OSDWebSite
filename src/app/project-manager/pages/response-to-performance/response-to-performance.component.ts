import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { PerformanceFreeProfessional } from '../../Models/performanceFreeProfessional';
import { PerformanceSelectors } from 'src/app/store/selectors';
import { Observable } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ResponseToPerformanceFreeProfessional } from '../../Models/responseToperformanceFreeProfessional';
import { Router, ActivatedRoute } from '@angular/router';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';
import { TranslateService } from '@ngx-translate/core';

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
  isTechnicalDirector: boolean = false
  userInfo!: UserInfo
  modifiedPerformanceFP: any;
  visualizePerformanceFP: any;
  performanceAssigned$: Observable<PerformanceFreeProfessional> = this.store.select(PerformanceSelectors.projectPerformance);
  subPerformance$: Observable<ResponseToPerformanceFreeProfessional> = this.store.select(PerformanceSelectors.projectSubPerformance);
  isWorkMore: boolean = false;
  responseToPerformanceFreeProfessional = {} as ResponseToPerformanceFreeProfessional;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private osdEventService: OSDService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private translate: TranslateService,) {
    this.showPerformanceAssignedForm = this.ShowForm()
    this.responsePerformanceForm = this.ShowResponseForm()
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.store.dispatch(PerformanceActions.setSubPerformance({subPerformance: {} as ResponseToPerformanceFreeProfessional}));
    }, 0);
  }

  validateAccount() {
    if (this.userInfo) {
      if (this.userInfo.AccountType === "FreeProfessional") {
        this.osdEventService.GetFreeProfessionalsDataEvent();
        this.osdEventService.getFreeProfessionalsList()
          .then(freeProfessionals => {
            if (Array.isArray(freeProfessionals)) {
              freeProfessionals.forEach(item => {
                var freeProfessional: FreeProfessional = item;
                if (freeProfessional.Userid == this.userInfo.Id) {
                  if (freeProfessional.FreeprofessionaltypeAcronym == "TR") {
                    this.isTechnicalDirector = false;
                    this.responsePerformanceForm.get('AcceptIncreaseInHours')?.disable();
                  }
                  else if (freeProfessional.FreeprofessionaltypeAcronym == "INFIT") {
                    this.isTechnicalDirector = false;
                    this.responsePerformanceForm.get('AcceptIncreaseInHours')?.disable();
                  }
                  else if (freeProfessional.FreeprofessionaltypeAcronym == "DT") {
                    this.isTechnicalDirector = true;
                    this.responsePerformanceForm.get('AcceptIncreaseInHours')?.enable();
                  }
                  else if (freeProfessional.FreeprofessionaltypeAcronym == "FC") {
                    this.isTechnicalDirector = false;
                    this.responsePerformanceForm.get('AcceptIncreaseInHours')?.disable();
                  }
                }
              });
            } else {
              console.error('freeProfessionals is not an array:', freeProfessionals);
            }
      })}
    }
  }

  ngOnInit(): void {
    var userInfo = this.authenticationService.userInfo;
    if (userInfo) {
      this.userInfo = userInfo;
    }
    this.validateAccount();

    this.route.queryParams.subscribe(params => {
      this.modifiedPerformanceFP = params['modified'];
    });
    this.route.queryParams.subscribe(params => {
      this.visualizePerformanceFP = params['visualize'];
    });
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())

      if(this.responseToPerformanceFreeProfessional.Revised == 'True'){
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "The Subperformance has already been reviewed by the TD" }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "La subactuacion ya se encuentra revisada por el DT" }));
        }
        this.store.dispatch(ModalActions.openAlert())
      }
    
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
    if(this.responseToPerformanceFreeProfessional != null ){
      this.subPerformance$.subscribe(performance => {
        this.responseToPerformanceFreeProfessional = performance
      })
  
      this.showPerformanceResponseForm = this.formBuilder.group({
        FP_WorkHours: this.responseToPerformanceFreeProfessional.FP_WorkHours,
        FP_TravelTime: this.responseToPerformanceFreeProfessional.FP_TravelTime,
        FP_TravelExpenses: this.responseToPerformanceFreeProfessional.FP_TravelExpenses,
        Total_FP: this.responseToPerformanceFreeProfessional.Total_FP,
        JustifyChangeEstimatedWorkHours: this.responseToPerformanceFreeProfessional.JustifyChangeEstimatedWorkHours,
        DocumentIncreaseWorkingHours: this.responseToPerformanceFreeProfessional.DocumentIncreaseWorkingHours,
        TD_Date: this.responseToPerformanceFreeProfessional.TD_Date,
        TD_WorkHours: this.responseToPerformanceFreeProfessional.TD_WorkHours,
        AcceptIncreaseInHours: this.responseToPerformanceFreeProfessional.AcceptIncreaseInHours
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

  validateSubPerformance(): void {
    if (this.responsePerformanceForm.invalid) {
      this.responsePerformanceForm.markAllAsTouched();
      return;
    }
    var fillForm = {} as ResponseToPerformanceFreeProfessional;
    this.subPerformance$.subscribe(performance => {
      fillForm = performance
    })

    this.osdEventService.validateResponseToPerformanceAssigned(fillForm.Id ,this.responsePerformanceForm.value);
  }

  verifiedFormat(data: string) {
    const formValues = this.responsePerformanceForm.value;
    console.log(this.responsePerformanceForm.value)
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
      if (professionalFreeTransportExpenses != '' && data == "freeProfessional") {
        this.totalExpensesOfFreeProfessional(formValues);
      }
    } else {
      if (professionalFreeTransportExpenses != '' && data == "freeProfessional") {
        console.log(professionalFreeTransportExpenses);
        this.responsePerformanceForm.patchValue({ Total_FP: '' });
      }else{
        this.responsePerformanceForm.patchValue({ TD_WorkHours: '' });
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
    const FreeProfessionalExpenses = parseFloat(formValues.FP_TravelExpenses);

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
