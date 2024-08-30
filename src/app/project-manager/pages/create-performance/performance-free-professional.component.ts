import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceFreeProfessional } from 'src/app/project-manager/Models/performanceFreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';
import { FreeProfessionalType } from '../../Models/freeprofessionalType';

@Component({
  selector: 'app-performance-free-professional',
  templateUrl: './performance-free-professional.component.html',
  styleUrls: ['./performance-free-professional.component.css']
})
export class PerformanceFreeProfessionalComponent {
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
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
  { id: '3d49a5ce-f6d9-42a9-bef7-3e121fe622b0', name: 'IT Administrators' },
  { id: 'eea2312e-6a85-4ab6-85ff-0864547e3870', name: 'Trainer' }];
  selectedType: string = '';
  filteredProfessionalsFree!: FreeProfessional[];

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private translate: TranslateService) {
    this.performanceForm = this.validatePerformanceOnDataService()
    
    this.OSDDataService.setPerformance({} as PerformanceFreeProfessional)
  }

  validatePerformanceOnDataService(): FormGroup {
    this.performanceFP = this.OSDDataService.getPerformance()

    if (this.performanceFP) {

      this.justifyingDocument = this.performanceFP.JustifyingDocument;

      let originalDate = this.performanceFP.Start_Date;
      let formatedStartDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

      let originalDTDate = this.performanceFP.End_Date;
      let formatedEndDate = this.datePipe.transform(originalDTDate, 'yyyy-MM-dd');

      console.log(this.performanceFP)

      const form = this.formBuilder.group({
        start_date: formatedStartDate,
        end_date: formatedEndDate,
        JustifyingDocument: this.performanceFP.JustifyingDocument,
        Summary: this.performanceFP.SummaryId,
        freeProfessionalId: this.performanceFP.FreeProfessionalId,
        freeProfessionalCode:this.performanceFP.CodeFreeProfessional,
        ForecastTravelExpenses:this.performanceFP.ForecastTravelExpenses,
        ForecastTravelTime: this.performanceFP.ForecastTravelTime,
        ForecastWorkHours: this.performanceFP.ForecastWorkHours,
        Totalforecastdata: this.performanceFP.TotalForecastData
      });
      return form;
    }
    else {
      return this.createForm()
    }
  }

  async ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.OSDEventService.GetSummaryTypes();
      this.OSDEventService.GetFreeProfessionalsDataEvent();
    }, 0);

    this.OSDDataService.SummaryTypesList$.subscribe(summaryTypes => {
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
      ProjectManagerId: ['065d461a-cc09-4162-b4e9-f121c11d3348', [Validators.required]],
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
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    console.log(this.performanceForm.value)
    this.OSDEventService.addPerformanceFreeProfessional(this.performanceForm.value);
  }

  verifiedFormat(data: string) {
    const formValues = this.performanceForm.value;
    let travelTime,workHours,transportExpenses;

     travelTime = formValues.ForecastTravelTime;
     workHours = formValues.ForecastWorkHours;
     transportExpenses = formValues.ForecastTravelExpenses;

    const isTravelTimeValid = this.validarHora(travelTime);
    const isWorkHoursValid = this.validarHora(workHours);

    if (isTravelTimeValid && isWorkHoursValid && transportExpenses > 0  ) {
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

    const totalWorkHours = estimatedWorkHours * 60;
    const totalTransportHours = estimatedTransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + estimatedTransportExpenses;

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