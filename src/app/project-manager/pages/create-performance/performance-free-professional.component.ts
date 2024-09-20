import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceFreeProfessional } from 'src/app/project-manager/Models/performanceFreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';
import { FreeProfessionalType } from '../../Models/freeprofessionalType';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-performance-free-professional',
  templateUrl: './performance-free-professional.component.html',
  styleUrls: ['./performance-free-professional.component.css']
})
export class PerformanceFreeProfessionalComponent {
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  performanceFreeProfessional$: Observable<PerformanceFreeProfessional> = this.store.select(PerformanceSelectors.performanceFreeProfessional);
  modifiedPerformanceFP: any;
  performanceFP!: PerformanceFreeProfessional;
  editOtherInformation: boolean = true;
  performanceForm: FormGroup;
  professionalsFree!: FreeProfessional[];
  selectedSummaryType: string | undefined;
  summaryTypes: DropDownItem[] = [];
  justifyingDocument!: string;
  DocumentIncreaseWorkingHours!: string;
  freeProfessionalId!: string
  incorrectFormat: boolean = false
  showModal: boolean = false;
  professionalTypes: FreeProfessionalType[] = [{ id: '1bfc42c6-0d32-4270-99ed-99567bc7a524', name: 'Accounting Technician' },
  { id: '2fc2a06a-69ca-4832-a90e-1ff590b80d24', name: 'Processor' },
  { id: 'eea2312e-6a85-4ab6-85ff-0864547e3870', name: 'Trainer' },
  { id: '4fbeb4e3-a284-44ef-ac65-a70a0620b1c9', name: 'Marketing ' },
  { id: 'afdc95b1-271e-4788-a00a-d40081d7314f', name: 'Citizen service' }];
  selectedType: string = '';
  filteredProfessionalsFree!: FreeProfessional[];
  projectManagerSelected: string = "";
  projectManagerSelectedObservable$: Observable<string> = this.store.select(PerformanceSelectors.projectManagerId)

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,) {
    this.performanceForm = this.validatePerformanceOnDataService()
  }

  validatePerformanceOnDataService(): FormGroup {
    this.performanceFreeProfessional$.subscribe(performance => {
      this.performanceFP = performance;
    })

    if (this.performanceFP != undefined) {
      this.justifyingDocument = this.performanceFP.JustifyingDocument;

      let originalDate = this.performanceFP.Start_Date;
      let formatedStartDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

      let originalDTDate = this.performanceFP.End_Date;
      let formatedEndDate = this.datePipe.transform(originalDTDate, 'yyyy-MM-dd');

      const form = this.formBuilder.group({
        Start_Date: formatedStartDate,
        End_Date: formatedEndDate,
        JustifyingDocument: this.performanceFP.JustifyingDocument,
        FreeProfessionalCode: this.performanceFP.FreeProfessionalAssignedCode,
        SummaryId: this.performanceFP.SummaryId,
        freeProfessionalId: this.performanceFP.FreeProfessionalId,
        ForecastTravelExpenses: this.performanceFP.ForecastTravelExpenses,
        ForecastTravelTime: this.performanceFP.ForecastTravelTime,
        ForecastWorkHours: this.performanceFP.ForecastWorkHours,
        TotalForecastData: this.performanceFP.TotalForecastData
      });
      return form;
    }
    else {
      return this.createForm()
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.modifiedPerformanceFP = params['modified'];
    });
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.OSDEventService.GetSummaryTypes();
      this.OSDEventService.GetFreeProfessionalsDataEvent();
    }, 0);

    this.OSDDataService.SummaryTypesPerformanceFreeProfessionalList$.subscribe(summaryTypes => {
      summaryTypes.forEach(items => {
        var entityDropDownItem: DropDownItem = { value: items.Summary, key: items.Id };
        this.summaryTypes.push(entityDropDownItem);
      });
    });

    this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated === false) {
        this.editOtherInformation = false
      }
    });

    this.OSDDataService.freeProfessionalId$.subscribe(id => {
      this.freeProfessionalId = id;
    });

    this.OSDEventService.getFreeProfessionalsList().then(freeProfessionals => {
      this.professionalsFree = freeProfessionals;
      this.filteredProfessionalsFree = freeProfessionals;
    });

    this.projectManagerSelectedObservable$.subscribe(id => {
      this.projectManagerSelected = id;
    })
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  displayFileName(): void {
    const justifyingDocument = document.getElementById('JustifyingDocument') as HTMLInputElement;
    const DocumentIncreaseWorkingHours = document.getElementById('DocumentIncreaseWorkingHours') as HTMLInputElement;
    if (justifyingDocument.value !== null) {
      this.justifyingDocument = justifyingDocument.value;
    }

    if (DocumentIncreaseWorkingHours.value !== null) {
      this.DocumentIncreaseWorkingHours = DocumentIncreaseWorkingHours.value;
    }
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      Start_Date: ['', [Validators.required]],
      End_Date: ['', [Validators.required]],
      FreeProfessionalAssignedId: ['', [Validators.required]],
      FreeProfessionalCode: ['', [Validators.required]],
      SummaryId: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      ForecastTravelExpenses: ['', [Validators.required]],
      ForecastTravelTime: ['', [Validators.required]],
      ForecastWorkHours: ['', [Validators.required]],
      TotalForecastData: ['', [Validators.required]]
    });
    return form;
  }

  onSubmit(): void {
    console.log(this.performanceForm.value)
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.OSDEventService.addPerformanceFreeProfessional(this.performanceForm.value, this.projectManagerSelected);
  }

  modifyPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.OSDEventService.modifyPerformanceFreeProfessional(this.performanceForm.value, this.projectManagerSelected, this.performanceFP.Id);
  }

  verifiedFormat(data: string) {
    const formValues = this.performanceForm.value;
    let travelTime, workHours, transportExpenses;

    travelTime = formValues.ForecastTravelTime;
    workHours = formValues.ForecastWorkHours;
    transportExpenses = formValues.ForecastTravelExpenses;

    const isTravelTimeValid = this.validarHora(travelTime);
    const isWorkHoursValid = this.validarHora(workHours);

    if (isTravelTimeValid && isWorkHoursValid && transportExpenses >= 0) {
      this.totalExpectedDataExpenses(formValues);
      this.incorrectFormat = false;
    } else {
      this.incorrectFormat = true;
      this.performanceForm.patchValue({ TotalForecastData: '' });
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

  totalExpectedDataExpenses(formValues: any) {
    const estimatedWorkHours = this.convertTimeToMinutes(formValues.ForecastWorkHours) / 60;
    const estimatedTransportHours = this.convertTimeToMinutes(formValues.ForecastTravelTime) / 60;
    const estimatedTransportExpenses = Number(formValues.ForecastTravelExpenses);

    let totalWorkHours = 0;
    let totalTransportHours = 0;
    let total: number = 0;

    if (estimatedTransportExpenses != 0) {
      totalWorkHours = estimatedWorkHours * 60;
      totalTransportHours = estimatedTransportHours * 30;
      total = (totalWorkHours + totalTransportHours) + estimatedTransportExpenses;
    } else {
      totalWorkHours = estimatedWorkHours * 60;
      totalTransportHours = estimatedTransportHours * 30;
      total = (totalWorkHours + totalTransportHours);
    }

    this.performanceForm.patchValue({
      TotalForecastData: total
    });
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

    this.performanceForm.patchValue({
      FP_total: total
    });
  }

  closeModal() {
    this.showModal = false;
  }

  openModal() {
    this.showModal = true;
  }

  selectProfessionalFree(professionalsFree: FreeProfessional) {
    this.performanceForm.patchValue({
      FreeProfessionalCode: professionalsFree.Code, FreeProfessionalAssignedId: professionalsFree.Id
    })
    this.showModal = false;
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.filteredProfessionalsFree.slice(startIndex, endIndex);
  }

  applyFilter() {
    if (this.selectedType) {
      this.filteredProfessionalsFree = this.professionalsFree.filter(fp =>
        fp.FreeprofessionaltypeName.toLowerCase() === this.selectedType.toLowerCase()
      );
    } else {
      this.filteredProfessionalsFree = this.professionalsFree;
    }
  }

}