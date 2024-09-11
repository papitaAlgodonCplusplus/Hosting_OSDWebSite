import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors, ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';
import { Claim } from 'src/app/models/claim';
import { PerformanceClaim } from '../../models/PerformanceClaims';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventConstants } from 'src/app/models/eventConstants';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { UserInfo } from 'src/app/models/userInfo';
import { FreeProfessional } from '../../models/FreeProfessional';

@Component({
  selector: 'app-claims-performance',
  templateUrl: './claims-performance.component.html',
  styleUrls: ['./claims-performance.component.css']
})
export class ClaimsPerformanceComponent {
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  performanceClaim$: Observable<PerformanceClaim> = this.store.select(PerformanceSelectors.performanceClaim);
  performanceForm: FormGroup;
  selectedType: string | undefined;
  user!: UserInfo;
  viewAll: boolean = false;
  type!: DropDownItem[];
  documentName!: string;
  freeProfessionalId!: string;
  incorrectFormat: boolean = false;
  performanceData: PerformanceClaim = {} as PerformanceClaim;
  claimId!: string;
  freeProfessionalData!: FreeProfessional;
  isModified: boolean = false;
  isViewTrainerPerformance: boolean = true;
  isViewProcessorPerformance: boolean = true;
  performanceId!: string;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService
  ) {
    this.performanceForm = this.createRegisterForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());

      this.performanceClaim$.subscribe(performanceClaim => {
        if (Object.keys(performanceClaim).length > 0) {
          console.log("hola")
          this.performanceId = performanceClaim.Id;
          this.performanceForm = this.fillForm(performanceClaim);
          this.isModified = true;
          if (performanceClaim.ProcessorWorkHours != "") {
            this.isViewProcessorPerformance = false;
          }
          else if (performanceClaim.TrainerWorkHours != ""){
            this.isViewTrainerPerformance = false;
          }
          else{
            this.isViewTrainerPerformance = true;
            this.isViewProcessorPerformance = true;
          }
        }
      });

      if (this.isModified == false) {
        this.isViewTrainerPerformance = false;
        this.isViewProcessorPerformance = false;
      }

      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo;
        if (this.authenticationService.userInfo.AccountType == EventConstants.CLAIMANT) {
          this.type = this.typesOfPerformanceClaimsService.getTypesClaimant();
        } else if (this.authenticationService.userInfo.AccountType == EventConstants.SUBSCRIBER_CUSTOMER) {
          this.type = this.typesOfPerformanceClaimsService.getTypesSubscriber();
        } else {
          this.type = this.typesOfPerformanceClaimsService.getTypesProcessor();
          this.OSDEventService.GetFreeProfessionalsDataEvent();
          this.OSDEventService.getFreeProfessionalsList().then(freeProfessionals => {
            var freeProfessionalFound = freeProfessionals.find(Processor => Processor.Userid == this.authenticationService.userInfo?.Id);
            if (freeProfessionalFound) {
              this.freeProfessionalData = freeProfessionalFound;
              if (this.freeProfessionalData.FreeprofessionaltypeName == 'Trainer') {
                if (this.isModified == false) {
                  this.performanceForm.get('Trainer_Date')?.setValidators(Validators.required);
                  this.performanceForm.get('Trainer_WorkHours')?.setValidators(Validators.required);
                  this.performanceForm.get('Trainer_TravelTime')?.setValidators(Validators.required);
                  this.performanceForm.get('Trainer_TravelExpenses')?.setValidators(Validators.required);
                  this.performanceForm.get('Trainer_Remuneration')?.setValidators(Validators.required);
                  this.performanceForm.get('Trainer_Date')?.updateValueAndValidity();
                  this.performanceForm.get('Trainer_WorkHours')?.updateValueAndValidity();
                  this.performanceForm.get('Trainer_TravelTime')?.updateValueAndValidity();
                  this.performanceForm.get('Trainer_TravelExpenses')?.updateValueAndValidity();
                  this.performanceForm.get('Trainer_Remuneration')?.updateValueAndValidity();
                }
              }
              else {
                if (this.isModified == false) {
                  this.performanceForm.get('Processor_WorkHours')?.setValidators(Validators.required);
                  this.performanceForm.get('Processor_TravelTime')?.setValidators(Validators.required);
                  this.performanceForm.get('Processor_TravelExpenses')?.setValidators(Validators.required);
                  this.performanceForm.get('Processor_Remuneration')?.setValidators(Validators.required);
                  this.performanceForm.get('Processor_WorkHours')?.updateValueAndValidity();
                  this.performanceForm.get('Processor_TravelTime')?.updateValueAndValidity();
                  this.performanceForm.get('Processor_TravelExpenses')?.updateValueAndValidity();
                  this.performanceForm.get('Processor_Remuneration')?.updateValueAndValidity();
                }
              }
            }
          });
        }
        this.freeProfessionalData = {} as FreeProfessional;
      }
    }, 0);

    this.claim$.subscribe(claim => {
      this.claimId = claim.Id;
    });

    this.OSDDataService.freeProfessionalId$.subscribe(id => {
      this.freeProfessionalId = id;
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(PerformanceActions.setPerformanceClaim({ performanceClaim: {} as PerformanceClaim }))
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
      JustifyingDocument: ['', [Validators.required]],
      Summary: ['', [Validators.required]],
      Processor_WorkHours: [''],
      Processor_TravelTime: [''],
      Processor_TravelExpenses: [''],
      Processor_Remuneration: [''],
      Trainer_Date: [''],
      Trainer_WorkHours: [''],
      Trainer_TravelTime: [''],
      Trainer_TravelExpenses: [''],
      Trainer_Remuneration: ['']
    });
    return form;
  }

  private fillForm(performance: PerformanceClaim): FormGroup {
    this.documentName = performance.JustifyingDocument

    let originalDate = performance.Date;
    let formatedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    let originalTrainerDate = performance.TrainerDate;
    let formatedTrainerDate = this.datePipe.transform(originalTrainerDate, 'yyyy-MM-dd');

    if (formatedTrainerDate == "0001-01-01") {
      formatedTrainerDate = ""
    }

    const form = this.formBuilder.group({
      Date: [formatedDate],
      Type: [performance.Type],
      JustifyingDocument: [performance.JustifyingDocument],
      Summary: [performance.Summary],
      Processor_WorkHours: [performance.ProcessorWorkHours],
      Processor_TravelTime: [performance.ProcessorTravelHours],
      Processor_TravelExpenses: [performance.ProcessorTravelExpenses],
      Processor_Remuneration: [performance.ProcessorRemuneration],
      Trainer_Date: [formatedTrainerDate],
      Trainer_WorkHours: [performance.TrainerWorkHours],
      Trainer_TravelTime: [performance.TrainerTravelHours],
      Trainer_TravelExpenses: [performance.TrainerTravelExpenses],
      Trainer_Remuneration: [performance.TrainerRemuneration]
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
    this.performanceData.ProcessorWorkHours = formValues.Processor_WorkHours;
    this.performanceData.ProcessorTravelHours = formValues.Processor_TravelTime;
    this.performanceData.ProcessorTravelExpenses = formValues.Processor_TravelExpenses;
    this.performanceData.ProcessorRemuneration = formValues.Processor_Remuneration;
    this.performanceData.TrainerDate = formValues.Trainer_Date;
    this.performanceData.TrainerWorkHours = formValues.Trainer_WorkHours;
    this.performanceData.TrainerTravelHours = formValues.Trainer_TravelTime;
    this.performanceData.TrainerTravelExpenses = formValues.Trainer_TravelExpenses;
    this.performanceData.TrainerRemuneration = formValues.Trainer_Remuneration;
    this.performanceData.Summary = formValues.Summary;

    if (this.claimId) {
      this.OSDEventService.createPerformanceClaim(this.performanceData, this.claimId);
    }
  }

  modifiedPerformances(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }

    let formValues = this.performanceForm.value;
    this.performanceData.Date = formValues.Date;
    this.performanceData.Type = formValues.Type;
    this.performanceData.JustifyingDocument = this.documentName
    this.performanceData.ProcessorWorkHours = formValues.Processor_WorkHours;
    this.performanceData.ProcessorTravelHours = formValues.Processor_TravelTime;
    this.performanceData.ProcessorTravelExpenses = formValues.Processor_TravelExpenses;
    this.performanceData.ProcessorRemuneration = formValues.Processor_Remuneration;
    this.performanceData.TrainerDate = formValues.Trainer_Date;
    this.performanceData.TrainerWorkHours = formValues.Trainer_WorkHours;
    this.performanceData.TrainerTravelHours = formValues.Trainer_TravelTime;
    this.performanceData.TrainerTravelExpenses = formValues.Trainer_TravelExpenses;
    this.performanceData.TrainerRemuneration = formValues.Trainer_Remuneration;
    this.performanceData.Summary = formValues.Summary;

    if (this.claimId) {
      this.OSDEventService.modifiedPerformanceClaim(this.performanceData, this.performanceId);
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
      this.incorrectFormat = false;
    } else {
      this.incorrectFormat = true;
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
    return hora > 0 && hora < 24 && minutos >= 0 && minutos < 60;
  }

  private convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
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
}
