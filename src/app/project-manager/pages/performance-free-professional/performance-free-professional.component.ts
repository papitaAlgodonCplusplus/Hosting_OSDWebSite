import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceFreeProfessional } from 'src/app/project-manager/Models/performanceFreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-performance-free-professional',
  templateUrl: './performance-free-professional.component.html',
  styleUrls: ['./performance-free-professional.component.css']
})
export class PerformanceFreeProfessionalComponent {
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  performanceFP: any;
  editOtherInformation: boolean = true;
  disable: boolean = true;
  performanceForm: FormGroup;
  Response = "";
  validationsService: any;
  selectedType: string | undefined;
  type: DropDownItem[] = [
    { value: 'Escritos', key: 'Escritos' },
    { value: 'E-mails', key: 'E-mails' },
    { value: 'Video Conferencias', key: 'Video Conferencias' },
    { value: 'Reuniones/Juzgado', key: 'Reuniones/Juzgado' }
  ];
  PL_FreeProfessional: string | undefined;
  FreeProfessional: DropDownItem[] = [];
  isDropdownOpenPL = true;
  isDropdownOpenDT = true;
  isAcceptConditions!: boolean;
  documentName!: string;
  freeProfessionalId!: string
  incorrectFormat: boolean = false

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private translate: TranslateService) {
    this.performanceForm = this.validatePerformanceOnDataService()
    this.OSDDataService.setPerformance("")
  }

  validatePerformanceOnDataService(): FormGroup {
    this.performanceFP = this.OSDDataService.getPerformance()
    if (this.performanceFP !== "" && this.performanceFP !== undefined) {

      this.documentName = this.performanceFP.JustifyingDocument;

      let originalDate = this.performanceFP.Date;
      let formatedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

      let originalDTDate = this.performanceFP.TechnicalDirectorDate;
      let formatedDTDate = this.datePipe.transform(originalDTDate, 'yyyy-MM-dd');

      const form = this.formBuilder.group({
        Date: formatedDate,
        Type: this.performanceFP.Type,
        JustifyingDocument: this.performanceFP.documentName,
        FP_WorkHours: this.performanceFP.FreeProfessionalWorkHours,
        FP_TravelTime: this.performanceFP.FreeProfessionalTravelHours,
        FP_TravelExpenses: this.performanceFP.FreeProfessionalTravelExpenses,
        FP_Remuneration: this.performanceFP.FreeProfessionalRemuneration,
        TD_Date: formatedDTDate,
        TD_WorkHours: this.performanceFP.TechnicalDirectorWorkHours,
        TD_TravelTime: this.performanceFP.TechnicalDirectorTravelHours,
        TD_TravelExpenses: this.performanceFP.TechnicalDirectorTravelExpenses,
        TD_Remuneration: this.performanceFP.TechnicalDirectorRemuneration,
        Summary: this.performanceFP.Summary,
        ForecastTravelExpenses: this.performanceFP.EstimatedTransportExpenses,
        ForecastTravelTime: this.performanceFP.EstimatedTransportHours,
        ForecastWorkHours: this.performanceFP.EstimatedWorkHours,
        JustifyChangeEstimatedWorkHours: this.performanceFP.JustifyChangeEstimatedWorkHours
      });
      return form;
    }
    else {
      return this.createRegisterForm()
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
    this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated === false) {
        this.editOtherInformation = false
      }
    });

    this.OSDDataService.freeProfessionalId$.subscribe(id => {
      this.freeProfessionalId = id;
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  displayFileName(): void {
    const justifyingDocument = document.getElementById('JustifyingDocument') as HTMLInputElement;
    if (justifyingDocument.value !== null) {
      this.documentName = justifyingDocument.value;
    }
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      JustifyingDocument: [''],
      FP_WorkHours: ['', [Validators.required]],
      FP_TravelTime: ['', [Validators.required]],
      FP_TravelExpenses: ['', [Validators.required]],
      FP_Remuneration: ['', [Validators.required]],
      TD_Date: ['', [Validators.required]],
      TD_WorkHours: ['', [Validators.required]],
      TD_TravelTime: ['', [Validators.required]],
      TD_TravelExpenses: ['', [Validators.required]],
      TD_Remuneration: ['', [Validators.required]],
      Summary: ['', [Validators.required]],
      ForecastTravelExpenses: [this.performanceFP.ForecastTravelExpenses],
      ForecastTravelTime: ['', [Validators.required]],
      ForecastWorkHours: ['', [Validators.required]],
      JustifyChangeEstimatedWorkHours: ['', [Validators.required]]
    });
    return form;
  }

  toggleDropdown(Response: string) {
    if (Response == "isDropdownOpen") {
      this.isDropdownOpenPL = !this.isDropdownOpenPL;
    }
    else {
      this.isDropdownOpenDT = !this.isDropdownOpenDT;
    }
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    let formValues = this.performanceForm.value;
    let performanceData: PerformanceFreeProfessional = new PerformanceFreeProfessional();

    performanceData.date = formValues.Date;
    performanceData.type = formValues.Type;
    performanceData.justifyingDocument = formValues.JustifyingDocument;
    performanceData.freeProfessionalWorkHours = formValues.FP_WorkHours;
    performanceData.freeProfessionalTravelHours = formValues.FP_TravelTime;
    performanceData.freeProfessionalTravelExpenses = formValues.FP_TravelExpenses;
    performanceData.freeProfessionalRemuneration = formValues.FP_Remuneration;
    performanceData.technicalDirectorDate = formValues.TD_Date;
    performanceData.technicalDirectorWorkHours = formValues.TD_WorkHours;
    performanceData.technicalDirectorTravelHours = formValues.TD_TravelTime;
    performanceData.technicalDirectorTravelExpenses = formValues.TD_TravelExpenses;
    performanceData.technicalDirectorRemuneration = formValues.TD_Remuneration;
    performanceData.summary = formValues.Summary;
    performanceData.technicalDirectorTravelExpenses = formValues.TD_TravelExpenses;
    performanceData.technicalDirectorRemuneration = formValues.TD_Remuneration;
    performanceData.summary = formValues.Summary;
    performanceData.estimatedTransportExpenses = formValues.ForecastTravelExpenses;
    performanceData.estimatedTransportHours = formValues.ForecastTravelTime;
    performanceData.estimatedWorkHours = formValues.ForecastWorkHours;
    performanceData.justifyChangeEstimatedWorkHours = formValues.JustifyChangeEstimatedWorkHours;

    performanceData.freeprofessionalId = this.freeProfessionalId
    performanceData.proyectManagerId = '065d461a-cc09-4162-b4e9-f121c11d3348'

    this.OSDEventService.addPerformanceFreeProfessional(performanceData);
  }

  verifiedFormat(data: string) {
    const formValues = this.performanceForm.value;
    let travelTime, workHours, errorMessage;

    switch (data) {
      case "forecast":
        travelTime = formValues.ForecastTravelTime;
        workHours = formValues.ForecastWorkHours;
        errorMessage = this.translate.instant('ForecastData');
        break;
      case "freeProfessional":
        travelTime = formValues.FP_TravelTime;
        workHours = formValues.FP_WorkHours;
        errorMessage = this.translate.instant('profesional_libre');
        break;
      case "technicalDirector":
        travelTime = formValues.TD_TravelTime;
        workHours = formValues.TD_WorkHours;
        errorMessage = this.translate.instant('TechnicalDirector');
        break;
      default:
        return;
    }

    const isTravelTimeValid = this.validarHora(travelTime);
    const isWorkHoursValid = this.validarHora(workHours);

    if (isTravelTimeValid && isWorkHoursValid) {
      if (data === "forecast") {
        this.chargeEstimatedTravelExpenses(formValues);
      } else if (data === "freeProfessional") {
        this.chargeRemuneration(formValues);
        this.chargeTravelExpenses(formValues);
      } else if (data === "technicalDirector") {
        this.chargeRemunerationTD(formValues);
        this.chargeTravelExpensesTD(formValues);
      }
      this.incorrectFormat = false;
    } else {
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: errorMessage + ': ' + this.translate.instant('FormatHoursIncorrect') }));
      this.store.dispatch(ModalActions.changeAlertType({ alertType: 'warning' }));
      this.store.dispatch(ModalActions.openAlert());
      this.incorrectFormat = true;
      if (data === "forecast") {
        this.performanceForm.patchValue({ ForecastTravelExpenses: '' });
      } else if (data === "freeProfessional") {
        this.performanceForm.patchValue({ FP_TravelExpenses: '' });
        this.performanceForm.patchValue({ FP_Remuneration: '' });
      } else if (data === "technicalDirector") {
        this.performanceForm.patchValue({ TD_TravelExpenses: '' });
        this.performanceForm.patchValue({ TD_Remuneration: '' });
      }
    }
  }



  validarHora(horaStr: string): boolean {
    console.log(horaStr)
    const horaRegex = /^(0?\d|1\d|2[0-3]):([0-5]\d)$/;

    if (!horaRegex.test(horaStr)) {
      return false;
    }

    const [hora, minutos] = horaStr.split(':');
    const horaNum = parseInt(hora, 10);
    const minutosNum = parseInt(minutos, 10);

    if (horaNum > 24 || horaNum < 0) {
      return false;
    }

    if (minutosNum > 59 || minutosNum < 0) {
      return false;
    }

    return true;
  }

  chargeRemuneration(formValues: any) {
    const [hours, minutes] = formValues.FP_WorkHours.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const remunerationPerMinute = 1;
    const remuneration = totalMinutes * remunerationPerMinute;

    this.performanceForm.patchValue({
      FP_Remuneration: remuneration
    });
  }

  chargeTravelExpenses(formValues: any) {
    const [hours, minutes] = formValues.FP_TravelTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const remunerationPerMinute = 1;
    const remuneration = totalMinutes * remunerationPerMinute;
    this.verifiedFormat('w')
    this.performanceForm.patchValue({
      FP_TravelExpenses: remuneration
    });
  }

  chargeRemunerationTD(formValues: any) {
    const [hours, minutes] = formValues.TD_WorkHours.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const remunerationPerMinute = 1;
    const remuneration = totalMinutes * remunerationPerMinute;

    this.performanceForm.patchValue({
      TD_Remuneration: remuneration
    });
  }

  chargeTravelExpensesTD(formValues: any) {
    const [hours, minutes] = formValues.TD_TravelTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const remunerationPerMinute = 1;
    const remuneration = totalMinutes * remunerationPerMinute;

    this.performanceForm.patchValue({
      TD_TravelExpenses: remuneration
    });
  }

  chargeEstimatedTravelExpenses(formValues: any) {
    const [hours, minutes] = formValues.ForecastTravelTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const remunerationPerMinute = 1;
    const remuneration = totalMinutes * remunerationPerMinute;
    this.verifiedFormat('d')
    this.performanceForm.patchValue({
      ForecastTravelExpenses: remuneration
    });
  }
}