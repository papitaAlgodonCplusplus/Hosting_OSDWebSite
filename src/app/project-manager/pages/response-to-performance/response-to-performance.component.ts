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
  responsePerformanceForm!: FormGroup;
  reviewPerformanceForm!: FormGroup;
  DocumentIncreaseWorkingHours!: string;
  justifyingDocument!: string;
  isAdmin: boolean = false
  userInfo!: UserInfo
  performanceAssigned$: Observable<PerformanceFreeProfessional> = this.store.select(PerformanceSelectors.performanceFreeProfessional);
  subPerformance$: Observable<ResponseToPerformanceFreeProfessional> = this.store.select(PerformanceSelectors.projectSubPerformance);
  isWorkMore: boolean = false;
  responseToPerformanceFreeProfessional: ResponseToPerformanceFreeProfessional = {} as ResponseToPerformanceFreeProfessional;
  isViewer: boolean = false;
  isModifyPerformance: boolean = false
  isReviewPerformance: boolean = false
  isRevisedPerformance: boolean = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private osdEventService: OSDService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private translate: TranslateService,) {
    this.showPerformanceAssignedForm = this.ShowForm()
    this.responsePerformanceForm = this.createForm()
    this.reviewPerformanceForm = this.createReviewForm()
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.validateAccount();

      if (this.responseToPerformanceFreeProfessional.Revised == 'True') {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "The Subperformance has already been reviewed by the TD" }));
        }
        else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "La subactuacion ya se encuentra revisada por el DT" }));
        }
        this.store.dispatch(ModalActions.openAlert())
      }
    }, 0);

    var userInfo = this.authenticationService.userInfo;
    if (userInfo) {
      this.userInfo = userInfo;
    }

    this.subPerformance$.subscribe(performance => {
      if (Object.keys(performance).length > 0) {
        this.responseToPerformanceFreeProfessional = performance
        this.responsePerformanceForm = this.FillResponsePerformanceForm()
        this.isViewer = true
      }
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.store.dispatch(PerformanceActions.setSubPerformance({ subPerformance: {} as ResponseToPerformanceFreeProfessional }));
      this.store.dispatch(PerformanceActions.setPerformanceFreeProfessional({ performanceFreeProfessional: {} as PerformanceFreeProfessional }))
    }, 0);
  }

  validateAccount() {
    if (this.userInfo) {
      if (this.userInfo.AccountType === "FreeProfessional") {
        this.osdEventService.GetFreeProfessionalsDataEvent();
        this.osdEventService.getFreeProfessionalsList()
          .then(freeProfessionals => {
            if (Array.isArray(freeProfessionals)) {
              var findFreeProfessional: FreeProfessional = freeProfessionals.find(fp => fp.Userid == this.userInfo.Id)
              if (findFreeProfessional.FreeprofessionaltypeAcronym == "DT" || findFreeProfessional.FreeprofessionaltypeAcronym == "INFIT") {
                this.isAdmin = true;
                this.isViewer = false;
                if (this.responseToPerformanceFreeProfessional.Revised == 'True') {
                  this.isRevisedPerformance = false;
                }
                else {
                  this.isRevisedPerformance = true;
                }
              }
              else {
                this.isAdmin = false;
              }
            }
          })
      }
    }
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
      AcceptIncreaseInHours: [false]
    });
    return form;
  }

  private createReviewForm(): FormGroup {
    const form = this.formBuilder.group({
      TD_Date: ['', [Validators.required]],
      TD_WorkHours: ['', [Validators.required]],
      AcceptIncreaseInHours: [false]
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

  private FillResponsePerformanceForm(): FormGroup {
    let originalDate = this.responseToPerformanceFreeProfessional.TD_Date;
    let [day, month, year] = originalDate.split('/').map(Number);
    let parsedDate = new Date(year, month - 1, day);
    let formatedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');

    if (this.responseToPerformanceFreeProfessional.JustifyChangeEstimatedWorkHours != '') {
      this.isWorkMore = true
    }

    if (this.responseToPerformanceFreeProfessional.Revised == 'True') {
      this.isReviewPerformance = true;
      this.reviewPerformanceForm = this.formBuilder.group({
        TD_Date: formatedDate,
        TD_WorkHours: this.responseToPerformanceFreeProfessional.TD_WorkHours,
        AcceptIncreaseInHours: this.responseToPerformanceFreeProfessional.AcceptIncreaseInHours
      });
    }

    this.DocumentIncreaseWorkingHours = this.responseToPerformanceFreeProfessional.DocumentIncreaseWorkingHours
    const form = this.formBuilder.group({
      FP_WorkHours: this.responseToPerformanceFreeProfessional.FP_WorkHours,
      FP_TravelTime: this.responseToPerformanceFreeProfessional.FP_TravelTime,
      FP_TravelExpenses: this.responseToPerformanceFreeProfessional.FP_TravelExpenses,
      Total_FP: this.responseToPerformanceFreeProfessional.Total_FP,
      JustifyChangeEstimatedWorkHours: this.responseToPerformanceFreeProfessional.JustifyChangeEstimatedWorkHours,
      DocumentIncreaseWorkingHours: this.responseToPerformanceFreeProfessional.DocumentIncreaseWorkingHours
    });

    return form;
  }

  onSubmit(): void {
    this.checkWorkHours()
    
    if (this.responsePerformanceForm.invalid) {
      this.responsePerformanceForm.markAllAsTouched();
      return;
    }
    var performanceAssigned = {} as PerformanceFreeProfessional;
    this.performanceAssigned$.subscribe(performance => {
      performanceAssigned = performance
    })
    this.store.dispatch(UiActions.toggleConfirmationButton())
    this.osdEventService.addResponseToPerformanceAssigned(this.responsePerformanceForm.value, performanceAssigned.Id)
  }

  modifySubPerformance(): void {
    if (this.responsePerformanceForm.invalid) {
      this.responsePerformanceForm.markAllAsTouched();
      return;
    }
    var performanceAssigned = {} as PerformanceFreeProfessional;
    this.performanceAssigned$.subscribe(performance => {
      performanceAssigned = performance
    })

    this.osdEventService.modifyResponseToPerformanceAssigned(this.responseToPerformanceFreeProfessional.Id, this.responsePerformanceForm.value, performanceAssigned.Id);
  }

  validateSubPerformance(): void {
    this.isReviewPerformance = true;

    if (this.reviewPerformanceForm.invalid) {
      this.reviewPerformanceForm.markAllAsTouched();
      return;
    }

    var fillForm = {} as ResponseToPerformanceFreeProfessional;
    this.subPerformance$.subscribe(performance => {
      fillForm = performance
    })

    this.store.dispatch(UiActions.toggleConfirmationButton())
    this.osdEventService.validateResponseToPerformanceAssigned(fillForm.Id, this.reviewPerformanceForm.value);
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
      if (data == "freeProfessional") {
        this.totalExpensesOfFreeProfessional(formValues);

      }
    } else {
      if (data == "freeProfessional") {
        this.responsePerformanceForm.patchValue({ Total_FP: '' });
      } else {
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
