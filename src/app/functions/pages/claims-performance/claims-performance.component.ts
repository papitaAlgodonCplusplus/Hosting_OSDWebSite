import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceFreeProfessional } from 'src/app/project-manager/Models/performanceFreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors, ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Claim } from 'src/app/models/claim';
import { PerformanceClaim } from '../../models/PerformanceClaims';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-claims-performance',
  templateUrl: './claims-performance.component.html',
  styleUrls: ['./claims-performance.component.css']
})
export class ClaimsPerformanceComponent {
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  performanceClaim$: Observable<PerformanceClaim> = this.store.select(PerformanceSelectors.performanceClaim);
  performanceFP!: PerformanceClaim;
  editOtherInformation: boolean = true;
  performanceForm: FormGroup;
  selectedType: string | undefined;
  user!: any;
  performance: PerformanceClaim | undefined;
  viewAll: boolean = false;
  type: DropDownItem[] = [
    { value: 'Escritos', key: 'Posted' },
    { value: 'E-mails', key: 'E-mails' },
    { value: 'Video Conferencias', key: 'Video Conferencing' },
    { value: 'Reuniones/Juzgado', key: 'Meetings/Court' }
  ];
  PL_FreeProfessional: string | undefined;
  FreeProfessional: DropDownItem[] = [];
  documentName!: string;
  freeProfessionalId!: string
  incorrectFormat: boolean = false
  performanceData!: PerformanceClaim;
  claimId! : string;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private translate: TranslateService) {
    this.performanceForm = this.validatePerformanceOnDataService()
    this.OSDDataService.setPerformance("")
    this.performanceData = {} as PerformanceClaim
  }

  validatePerformanceOnDataService(): FormGroup {
    if (this.authenticationService.userInfo) {
      this.user = this.authenticationService.userInfo
    }

    this.performanceClaim$.subscribe(performance => {
      this.performanceFP = performance;
    })

    if (Object.keys(this.performanceFP).length !== 0) {
      this.viewAll = true;
      this.documentName = this.performanceFP.JustifyingDocument;

      let originalDate = this.performanceFP.Date;
      let formatedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

      let originalDTDate = this.performanceFP.TechnicalDirectorDate;
      let formatedDTDate = this.datePipe.transform(originalDTDate, 'yyyy-MM-dd');
      
      const form = this.formBuilder.group({
        Date: formatedDate,
        Type: this.performanceFP.Type,
        Summary: this.performanceFP.Summary,
        JustifyingDocument: this.documentName,
        FP_WorkHours: this.performanceFP.FreeProfessionalWorkHours,
        FP_TravelTime: this.performanceFP.FreeProfessionalTravelHours,
        FP_TravelExpenses: this.performanceFP.FreeProfessionalTravelExpenses,
        FP_Remuneration: this.performanceFP.FreeProfessionalRemuneration,
        TD_Date: formatedDTDate,
        TD_WorkHours: this.performanceFP.TechnicalDirectorWorkHours,
        TD_TravelTime: this.performanceFP.TechnicalDirectorTravelHours,
        TD_TravelExpenses: this.performanceFP.TechnicalDirectorTravelExpenses,
        TD_Remuneration: this.performanceFP.TechnicalDirectorRemuneration,
      });
      return form;
    }
    else {
      return this.createRegisterForm()
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);

    this.claim$.subscribe(claim => {
      this.claimId = claim.Id;
    })
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
      FP_WorkHours: [''],
      FP_TravelTime: [''],
      FP_TravelExpenses: [''],
      FP_Remuneration: [''],
      TD_Date: [''],
      TD_WorkHours: [''],
      TD_TravelTime: [''],
      TD_TravelExpenses: [''],
      TD_Remuneration: [''],
      Summary: [''],
    });
    return form;
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }

    let formValues = this.performanceForm.value;
    this.performanceData.Date = formValues.Date;
    this.performanceData.Type = formValues.Type;
    this.performanceData.JustifyingDocument = formValues.JustifyingDocument;
    this.performanceData.FreeProfessionalWorkHours = formValues.FP_WorkHours;
    this.performanceData.FreeProfessionalTravelHours = formValues.FP_TravelTime;
    this.performanceData.FreeProfessionalTravelExpenses = formValues.FP_TravelExpenses;
    this.performanceData.FreeProfessionalRemuneration = formValues.FP_Remuneration;
    this.performanceData.TechnicalDirectorDate = formValues.TD_Date;
    this.performanceData.TechnicalDirectorWorkHours = formValues.TD_WorkHours;
    this.performanceData.TechnicalDirectorTravelHours = formValues.TD_TravelTime;
    this.performanceData.TechnicalDirectorTravelExpenses = formValues.TD_TravelExpenses;
    this.performanceData.TechnicalDirectorRemuneration = formValues.TD_Remuneration;
    this.performanceData.Summary = formValues.Summary;

    if(this.claimId){
      this.OSDEventService.createPerformanceClaim(this.performanceData, this.claimId);
    } 
  }

  verifiedFormat(data: string) {
    const formValues = this.performanceForm.value;
    let travelTime, workHours, errorMessage;
    switch (data) {
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
      if (data === "freeProfessional") {
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
      if (data === "freeProfessional") {
        this.performanceForm.patchValue({ FP_TravelExpenses: '' });
        this.performanceForm.patchValue({ FP_Remuneration: '' });
      } else if (data === "technicalDirector") {
        this.performanceForm.patchValue({ TD_TravelExpenses: '' });
        this.performanceForm.patchValue({ TD_Remuneration: '' });
      }
    }
  }

  validarHora(horaStr: string): boolean {
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