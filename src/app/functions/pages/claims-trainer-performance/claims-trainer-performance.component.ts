import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { UiActions } from 'src/app/store/actions';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { OSDService } from 'src/app/services/osd-event.services';
import { ActivatedRoute } from '@angular/router';
import { ClaimsTrainerPerformance } from '../../models/ClaimsTrainerPerformance';
import { DatePipe } from '@angular/common';

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
  reviewPerformance: any;
  modifyPerformanceTrainer: any;
  performanceObservable$ : Observable<ClaimsTrainerPerformance> = this.store.select(PerformanceSelectors.claimsTrainerPerformance)
  performance! : ClaimsTrainerPerformance;
  isUnrevised! : boolean;
  isView! : boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService,
    private OSDEventService: OSDService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    this.performanceForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.reviewPerformance = params['review'];
    });
    this.route.queryParams.subscribe(params => {
      this.modifyPerformanceTrainer = params['modify'];
    });
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.type = this.typesOfPerformanceClaimsService.getTypesClaimant()
    }, 0);
    this.claim$.subscribe(claim => {
      this.claimId = claim.Id;
    });

    this.performanceObservable$.subscribe(performance =>{
      this.performance = performance
      if(this.performance){
        this.performanceForm = this.fillForm(performance)
        if(this.performance.Status == "Running"){
          this.isUnrevised = false;
        }else{
          this.isUnrevised = true;
        }
      }
    })

    if(Object.keys(this.performance).length > 0){
      console.log(this.performance)
      this.isView = true;
    }
    else{
      console.log("No hay nada ")
      this.isView = false;
    }
    
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  private fillForm(performance : ClaimsTrainerPerformance): FormGroup {
    let originalDate = performance.Date;
    let formatedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    let originalTD_Date = performance.TechnicalDirectorDate;
    let formatedTD_Date = this.datePipe.transform(originalTD_Date, 'yyyy-MM-dd');

    this.documentName = performance.JustifyingDocument;
    const form = this.formBuilder.group({
      Date: [formatedDate, [Validators.required]],
      Type: [performance.Type, [Validators.required]],
      JustifyingDocument: [performance.JustifyingDocument, [Validators.required]],
      Summary: [performance.Summary, [Validators.required]],
      TrainerWorkHours: [performance.TrainerWorkHours, [Validators.required]],
      TrainerTravelHours: [performance.TrainerTravelHours, [Validators.required]],
      TrainerTravelExpenses: [performance.TrainerTravelExpenses, [Validators.required]],
      TrainerRemuneration: [performance.TrainerRemuneration, [Validators.required]],
      TechnicalDirectorDate: [formatedTD_Date],
      TechnicalDirectorWorkHours: [performance.TechnicalDirectorWorkHours],
      TechnicalDirectorTravelExpenses: [performance.TechnicalDirectorExpenses],
      TechnicalDirectorTravelTime: [performance.TechnicalDirectorTravelHours],
      TechnicalDirectorRemuneration: [performance.TechnicalDirectorRemuneration]
    });
    return form;
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      Summary: ['', [Validators.required]],
      TrainerWorkHours: ['', [Validators.required]],
      TrainerTravelHours: ['', [Validators.required]],
      TrainerTravelExpenses: ['', [Validators.required]],
      TrainerRemuneration: ['', [Validators.required]],
      TechnicalDirectorDate: [''],
      TechnicalDirectorWorkHours: [''],
      TechnicalDirectorTravelTime: [''],
      TechnicalDirectorTravelExpenses: [''],
      TechnicalDirectorRemuneration: ['']
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
        travelTime = formValues.TrainerTravelHours;
        workHours = formValues.TrainerWorkHours;
        expenses = formValues.TrainerTravelExpenses;
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
        this.performanceForm.patchValue({ TrainerRemuneration: '' });
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
    const WorkHours = this.convertTimeToMinutes(formValues.TrainerWorkHours) / 60;
    const TransportHours = this.convertTimeToMinutes(formValues.TrainerTravelHours) / 60;
    const TransportExpenses = Number(formValues.TrainerTravelExpenses);

    const totalWorkHours = WorkHours * 60;
    const totalTransportHours = TransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + TransportExpenses;

    this.performanceForm.patchValue({
      TrainerRemuneration: total
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
      this.OSDEventService.createPerformanceClaimTrainer(this.performanceForm.value, this.claimId);
    }
  }

  modifyPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      this.isErrorInForm = true;
      return;
    }

    this.isErrorInForm = false;
      this.OSDEventService.ModifyPerformanceClaimTrainer(this.performanceForm.value, this.claimId);
  }

}

