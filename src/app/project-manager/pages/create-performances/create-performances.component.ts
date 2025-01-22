import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceFreeProfessional } from 'src/app/project-manager/Models/performanceFreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';
import { FreeProfessionalType } from '../../Models/freeprofessionalType';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-create-performances',
  templateUrl: './create-performances.component.html',
  styleUrls: ['./create-performances.component.css']
})

export class CreatePerformancesComponent {
  projectManagerSelected: string = "";
  projectManagerSelectedObservable$: Observable<string> = this.store.select(PerformanceSelectors.projectManagerId)
  performanceFreeProfessional$: Observable<PerformanceFreeProfessional> = this.store.select(PerformanceSelectors.performanceFreeProfessional);
  performanceFP!: PerformanceFreeProfessional;
  performanceForm: FormGroup;
  selectedSummaryType: string | undefined;
  summaryTypes: DropDownItem[] = [];
  justifyingDocument!: string;
  DocumentIncreaseWorkingHours!: string;
  incorrectFormat: boolean = false
  showModal: boolean = false;
  documentFile: File | null = null;
  documentBytes: Uint8Array | null = null;
  documentUrl: string | null = null;
  documentName!: string;

  professionalTypes: FreeProfessionalType[] = [{ id: '1bfc42c6-0d32-4270-99ed-99567bc7a524', name: 'Accounting Technician' },
  { id: '2fc2a06a-69ca-4832-a90e-1ff590b80d24', name: 'Processor' },
  { id: 'eea2312e-6a85-4ab6-85ff-0864547e3870', name: 'Trainer' },
  { id: '4fbeb4e3-a284-44ef-ac65-a70a0620b1c9', name: 'Marketing ' },
  { id: 'afdc95b1-271e-4788-a00a-d40081d7314f', name: 'Citizen service' }];
  selectedType: string = '';
  filteredProfessionalsFree!: FreeProfessional[];
  professionalsFree!: FreeProfessional[];
  isViewPerformance: boolean = true;
  isCreatePerformance: boolean = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private translate: TranslateService,) {
    this.performanceForm = this.createForm()
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.OSDEventService.GetSummaryTypes();
      this.OSDEventService.GetFreeProfessionalsDataEvent();
    }, 0);

    this.OSDDataService.SummaryTypesPerformanceFreeProfessionalList$.subscribe(summaryTypes => {
      summaryTypes.forEach(items => {
        var entityDropDownItem: DropDownItem = { value: items.summary, key: items.id };
        this.summaryTypes.push(entityDropDownItem);
      });
    });

    this.performanceFreeProfessional$.subscribe(performance => {
      this.performanceFP = performance;
      if (Object.keys(this.performanceFP).length > 0) {
        this.performanceForm = this.fillform(this.performanceFP)
      }
    })

    this.OSDEventService.getFreeProfessionalsList().then(freeProfessionals => {
      this.filteredProfessionalsFree = freeProfessionals;
      this.professionalsFree = freeProfessionals;
      if (this.authService.userInfo) {
        if (freeProfessionals) {
          const freeProfessional: FreeProfessional | undefined = freeProfessionals?.find(fp => fp.userid === this.authService.userInfo?.Id);
          if (freeProfessional?.FreeprofessionaltypeAcronym == "DT" || freeProfessional?.FreeprofessionaltypeAcronym == "INFIT") {
            this.isViewPerformance = false;
          }
        }
      }
    });

    this.projectManagerSelectedObservable$.subscribe(id => {
      this.projectManagerSelected = id;
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(PerformanceActions.setPerformanceFreeProfessional({ performanceFreeProfessional: {} as PerformanceFreeProfessional }))
    }, 0);
  }

  displayFileName(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files.length > 0) {
      this.documentFile = input.files[0];

      if (this.documentFile.type !== 'application/pdf') {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "The document must be in PDF format" }));
          this.store.dispatch(ModalActions.openAlert());
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "El documento debe de estar en formato PDF" }));
          this.store.dispatch(ModalActions.openAlert());
        }
        this.documentFile = null;
        this.documentName = '';
        return;
      }

      const maxSizeInKB = 1000;
      const maxSizeInBytes = maxSizeInKB * 1024;
      if (this.documentFile.size > maxSizeInBytes) {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "The document exceeds 1000kb" }));
          this.store.dispatch(ModalActions.openAlert());
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "El documento sobrepasa los 1000kb" }));
          this.store.dispatch(ModalActions.openAlert());
        }

        this.documentFile = null;
        this.documentName = '';
        return;
      }

      this.documentName = this.documentFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        this.documentBytes = new Uint8Array(arrayBuffer);
      };
      reader.readAsArrayBuffer(this.documentFile);
    }
  }

  private createForm(): FormGroup {
    this.isCreatePerformance = true
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

  fillform(performance: PerformanceFreeProfessional): FormGroup {

    this.isCreatePerformance = false;

    this.justifyingDocument = performance.justifying_document;

    let originalDate = performance.start_date;
    let formatedStartDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    let originalDTDate = performance.end_date;
    let formatedEndDate = this.datePipe.transform(originalDTDate, 'yyyy-MM-dd');

    const form = this.formBuilder.group({
      Start_Date: [formatedStartDate, [Validators.required]],
      End_Date: [formatedEndDate, [Validators.required]],
      JustifyingDocument: [performance.justifying_document, [Validators.required]],
      FreeProfessionalCode: [performance.FreeProfessionalAssignedCode, [Validators.required]],
      SummaryId: [performance.summarytypeid, [Validators.required]],
      freeProfessionalId: [performance.freeprofessionalassignedid, [Validators.required]],
      ForecastTravelExpenses: [performance.estimated_transport_expenses, [Validators.required]],
      ForecastTravelTime: [performance.estimated_transport_hours, [Validators.required]],
      ForecastWorkHours: [performance.estimated_work_hours, [Validators.required]],
      TotalForecastData: [performance.total_forecast_data, [Validators.required]]
    });
    return form;
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(UiActions.toggleConfirmationButton())

    if (this.documentBytes != null) {


      if (this.projectManagerSelected) {
        if (this.documentBytes != null) {
          const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
          this.OSDEventService.addPerformanceFreeProfessional(this.performanceForm.value, this.projectManagerSelected, documentBase64);
        } else {
          this.OSDEventService.addPerformanceFreeProfessional(this.performanceForm.value, this.projectManagerSelected, "");
        }
      }
    }

  }

  convertUint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  }

  convertBase64ToBlob(base64: string, contentType: string = 'application/pdf'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  downloadPdf(base64String: string) {

    try {
      const blob = this.convertBase64ToBlob(base64String, 'application/pdf');

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  }

  getInvalidFields(): string[] {
    const invalidFields: string[] = [];
    const formControls = this.performanceForm.controls;
    for (const key in formControls) {
      const control = formControls[key];
      if (control.invalid) {
        invalidFields.push(key);
      }
    }
    return invalidFields;
  }

  modifyPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.OSDEventService.modifyPerformanceFreeProfessional(this.performanceForm.value, this.projectManagerSelected, this.performanceFP.id);
  }

  verifiedFormat() {
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
    if (Object.keys(this.performanceFP).length <= 0) {
      this.showModal = true;
    }
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
