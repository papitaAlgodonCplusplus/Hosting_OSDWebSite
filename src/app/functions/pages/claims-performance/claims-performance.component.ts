import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors, ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Claim } from 'src/app/models/claim';
import { PerformanceClaim } from '../../models/PerformanceClaims';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventConstants } from 'src/app/models/eventConstants';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { UiActions } from 'src/app/store/actions';
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
  type: DropDownItem[] = [];
  PL_FreeProfessional: string | undefined;
  FreeProfessional: DropDownItem[] = [];
  documentName!: string;
  freeProfessionalId!: string;
  incorrectFormat: boolean = false;
  performanceData!: PerformanceClaim;
  claimId!: string;
  freeProfessionalData!: FreeProfessional;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService
  ) {
    this.performanceForm = this.createRegisterForm();
    this.performanceData = {} as PerformanceClaim;
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());

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
            var freeProfessionalFound = freeProfessionals.find(fp => fp.Userid == this.authenticationService.userInfo?.Id);
            if (freeProfessionalFound) {
              this.freeProfessionalData = freeProfessionalFound;
            }
          });
        }
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
      FP_TravelExpenses: [],
      FP_Remuneration: [],
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
    // if (this.performanceForm.invalid) {
    //   this.performanceForm.markAllAsTouched();
    //   return;
    // }

    let formValues = this.performanceForm.value;
    this.performanceData.Date = formValues.Date;
    this.performanceData.Type = formValues.Type;
    this.performanceData.JustifyingDocument = formValues.JustifyingDocument;
    this.performanceData.ProcessorWorkHours = formValues.FP_WorkHours;
    this.performanceData.ProcessorTravelHours = formValues.FP_TravelTime;
    this.performanceData.ProcessorTravelExpenses = formValues.FP_TravelExpenses;
    this.performanceData.ProcessorRemuneration = formValues.FP_Remuneration;
    this.performanceData.TrainerDate = formValues.TD_Date;
    this.performanceData.TrainerWorkHours = formValues.TD_WorkHours;
    this.performanceData.TrainerTravelHours = formValues.TD_TravelTime;
    this.performanceData.TrainerTravelExpenses = formValues.TD_TravelExpenses;
    this.performanceData.TrainerRemuneration = formValues.TD_Remuneration;
    this.performanceData.Summary = formValues.Summary;

    // if (this.claimId) {
     this.OSDEventService.createPerformanceClaim(this.performanceData, this.claimId);
    // }
  }

  modifiedPerformances(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }

    let formValues = this.performanceForm.value;
    this.performanceData.Date = formValues.Date;
    this.performanceData.Type = formValues.Type;
    this.performanceData.JustifyingDocument = formValues.JustifyingDocument;
    this.performanceData.ProcessorWorkHours = formValues.FP_WorkHours;
    this.performanceData.ProcessorTravelHours = formValues.FP_TravelTime;
    this.performanceData.ProcessorTravelExpenses = formValues.FP_TravelExpenses;
    this.performanceData.ProcessorRemuneration = formValues.FP_Remuneration;
    this.performanceData.TrainerDate = formValues.TD_Date;
    this.performanceData.TrainerWorkHours = formValues.TD_WorkHours;
    this.performanceData.TrainerTravelHours = formValues.TD_TravelTime;
    this.performanceData.TrainerTravelExpenses = formValues.TD_TravelExpenses;
    this.performanceData.TrainerRemuneration = formValues.TD_Remuneration;
    this.performanceData.Summary = formValues.Summary;

    if (this.claimId) {
      this.OSDEventService.modifiedPerformanceClaim(this.performanceData, this.claimId);
    }
  }

  verifiedFormat(data: string) {
    const formValues = this.performanceForm.value;
    let travelTime, workHours, expenses;
    switch (data) {
      case "freeProfessional":
        travelTime = formValues.FP_TravelTime;
        workHours = formValues.FP_WorkHours;
        expenses = formValues.FP_TravelExpenses;
        break;
      case "trainer":
        travelTime = formValues.TD_TravelTime;
        workHours = formValues.TD_WorkHours;
        expenses = formValues.TD_TravelExpenses;
        break;
      default:
        return;
    }

    const isTravelTimeValid = this.validarHora(travelTime);
    const isWorkHoursValid = this.validarHora(workHours);
    if (isTravelTimeValid && isWorkHoursValid && expenses >= 0) {
      if (data === "freeProfessional") {
        this.chargeRemuneration(formValues);
      } else if (data === "trainer") {
        this.chargeRemunerationTD(formValues);
      }
      this.incorrectFormat = false;
    } else {
      this.incorrectFormat = true;
      if (data === "freeProfessional") {
        this.performanceForm.patchValue({ FP_Remuneration: '' });
      } else if (data === "trainer") {
        this.performanceForm.patchValue({ TD_Remuneration: '' });
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

  chargeRemuneration(formValues: any) {
    const freeProfessionalWorkHours = this.convertTimeToMinutes(formValues.FP_WorkHours) / 60;
    const freeProfessionalTransportHours = this.convertTimeToMinutes(formValues.FP_TravelTime) / 60;
    const freeProfessionalTransportExpenses = Number(formValues.FP_TravelExpenses);

    const totalWorkHours = freeProfessionalWorkHours * 60;
    const totalTransportHours = freeProfessionalTransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + freeProfessionalTransportExpenses;
    this.performanceForm.patchValue({
      FP_Remuneration: total
    });
  }

  chargeRemunerationTD(formValues: any) {
    const trainerWorkHours = this.convertTimeToMinutes(formValues.TD_WorkHours) / 60;
    const trainerTransportHours = this.convertTimeToMinutes(formValues.TD_TravelTime) / 60;
    const trainerTransportExpenses = Number(formValues.TD_TravelExpenses);

    const totalWorkHours = trainerWorkHours * 60;
    const totalTransportHours = trainerTransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + trainerTransportExpenses;

    this.performanceForm.patchValue({
      TD_Remuneration: total
    });
  }

}
