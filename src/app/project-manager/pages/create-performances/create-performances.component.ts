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
  canAddDeveloperPerformance: boolean = false; // if true => show extra fields
  projectManagerSelectedObservable$: Observable<string> = this.store.select(PerformanceSelectors.projectManagerId);
  performanceFreeProfessional$: Observable<PerformanceFreeProfessional> = this.store.select(PerformanceSelectors.performanceFreeProfessional);
  performanceFP!: PerformanceFreeProfessional;

  performanceForm: FormGroup;
  selectedSummaryType: string | undefined;
  summaryTypes: DropDownItem[] = [];
  justifyingDocument!: string;
  DocumentIncreaseWorkingHours!: string;
  incorrectFormat: boolean = false;
  showModal: boolean = false;
  documentFile: File | null = null;
  documentBytes: Uint8Array | null = null;
  documentUrl: string | null = null;
  documentName!: string;

  professionalTypes: FreeProfessionalType[] = [
    { id: '1bfc42c6-0d32-4270-99ed-99567bc7a562', name: 'Accounting Technician', acronym: 'TC' },
    { id: '2fc2a66a-69ca-4832-a90e-1ff590b80d24', name: 'Processor', acronym: 'TR' },
    { id: '3d4a9c5e-f6d9-42a9-bef7-3e121fe622b0', name: 'IT administrators', acronym: 'INFIT' },
    { id: '4e1477bf-e13c-084b-3bff-1149f3ab3f3b', name: 'OSD Systems Engineer', acronym: 'ISOSD' },
    { id: '4fbeb4e3-a284-44ef-ac65-a70a0620b1c9', name: 'Marketing', acronym: 'TM' },
    { id: '87db7d48-ee2a-4494-8627-9cb9e377de21', name: 'Technical Director', acronym: 'DT' },
    { id: 'afdc95b1-271e-4788-a00a-d40081d7314f', name: 'Citizen service', acronym: 'TS' },
    { id: 'eea2312e-6a85-4ab6-85ff-0864547e3870', name: 'Trainer', acronym: 'FC' },
    { id: 'f7a8c9d3-6e2b-4a5f-9bcd-2e4d9f3a7b21', name: 'Kuarc Technician', acronym: 'TK' }
  ];

  selectedType: string = '';
  filteredProfessionalsFree!: FreeProfessional[];
  professionalsFree!: FreeProfessional[];
  isViewPerformance: boolean = false;
  isCreatePerformance: boolean = false;

  // NEW: Developer Category and Module options (for the 2 new dropdowns)
  developer_categoryOptions: DropDownItem[] = [
    { key: 'forms', value: 'Edición Formularios' },
    { key: 'security', value: 'Seguridad y Privacidad' },
    { key: 'functionality', value: 'Funcionalidad de aplicación' },
    { key: 'videos', value: 'Contratos y Videos' },
    { key: 'continuous', value: 'Mejora Continua' },
    { key: 'update', value: 'Actualización' },
    { key: 'development', value: 'Desarrollo' },
    { key: 'administration', value: 'Administración' },
    { key: 'maintenance', value: 'Mantenimiento' },
    { key: 'user_navigation', value: 'Navegación Usuario' },
    { key: 'Edición Formularios', value: 'Edición Formularios' },
    { key: 'Seguridad y Privacidad', value: 'Seguridad y Privacidad' },
    { key: 'Funcionalidad de aplicación', value: 'Funcionalidad de aplicación' },
    { key: 'Contratos y Videos', value: 'Contratos y Videos' },
    { key: 'Mejora Continua', value: 'Mejora Continua' },
    { key: 'Actualización', value: 'Actualización' },
    { key: 'Desarrollo', value: 'Desarrollo' },
    { key: 'Administración', value: 'Administración' },
    { key: 'Mantenimiento', value: 'Mantenimiento' },
    { key: 'Navegación Usuario', value: 'Navegación Usuario' }
  ];

  developer_moduleOptions: DropDownItem[] = [
    { key: 'formativo', value: 'Gestor Formativo' },
    { key: 'expediente', value: 'Gestor Expediente' },
    { key: 'transparencia', value: 'Gestor Transparencia' },
    { key: 'economico', value: 'Gestor Economico' },
    { key: 'osd', value: 'Gestor OSD' },
    { key: 'usuarios', value: 'Gestor Usuarios/Perfiles' },
    { key: 'Gestor Formativo', value: 'Gestor Formativo' },
    { key: 'Gestor Expediente', value: 'Gestor Expediente' },
    { key: 'Gestor Transparencia', value: 'Gestor Transparencia' },
    { key: 'Gestor Economico', value: 'Gestor Economico' },
    { key: 'Gestor OSD', value: 'Gestor OSD' },
    { key: 'Gestor Usuarios/Perfiles', value: 'Gestor Usuarios/Perfiles' }
  ];

  developer_screen_formOptions: DropDownItem[] = [
    { key: 'Administración', value: 'Administración' },
    { key: 'Seguridad y Privacidad', value: 'Seguridad y Privacidad' },
    { key: 'Edición Formularios', value: 'Edición Formularios' },
    { key: 'Contratos y Videos', value: 'Contratos y Videos' },
    { key: 'Informe mejora continua', value: 'Informe mejora continua' },
  ];

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private translate: TranslateService,
  ) {
    // Build the form once in the constructor
    this.performanceForm = this.createForm();
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
        console.log(this.performanceFP);
        this.performanceForm = this.fillform(this.performanceFP);
      }
    });

    this.OSDEventService.getFreeProfessionalsList().then(freeProfessionals => {
      this.filteredProfessionalsFree = freeProfessionals;
      this.professionalsFree = freeProfessionals;
    });

    this.projectManagerSelectedObservable$.subscribe(id => {
      this.projectManagerSelected = id;
      this.store.dispatch(PerformanceActions.setProjectSelected({ projectSelected: this.projectManagerSelected }));
    });

    // Example: If projectManagerSelected is some known ID => canAddDeveloperPerformance = true
    // You had: if (this.projectManagerSelected === '065d461a-cc09-4162-b4e9-f121c11d3348') ...
    if (this.projectManagerSelected === '065d461a-cc09-4162-b4e9-f121c11d3348') {
      this.canAddDeveloperPerformance = true;
    }
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(PerformanceActions.setPerformanceFreeProfessional({ performanceFreeProfessional: {} as PerformanceFreeProfessional }));
    }, 0);
  }

  // UPDATED: The createForm method includes the 3 new optional fields
  // but they're only used if canAddDeveloperPerformance is true in the UI logic.
  private createForm(): FormGroup {
    this.isCreatePerformance = true;
    return this.formBuilder.group({
      Start_Date: ['', [Validators.required]],
      End_Date: ['', [Validators.required]],
      FreeProfessionalAssignedId: ['', [Validators.required]],
      FreeProfessionalCode: ['', [Validators.required]],
      SummaryId: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      ForecastTravelExpenses: ['', [Validators.required]],
      ForecastTravelTime: ['', [Validators.required]],
      ForecastWorkHours: ['', [Validators.required]],
      TotalForecastData: ['', [Validators.required]],
      developer_category: [''],
      developer_module: [''],
      developer_screen_form: [''],
      developer_activity: ['']
    });
  }

  fillform(performance: PerformanceFreeProfessional): FormGroup {
    this.isCreatePerformance = false;
    this.justifyingDocument = performance.justifying_document;

    let originalDate = performance.start_date;
    let formatedStartDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    let originalDTDate = performance.end_date;
    let formatedEndDate = this.datePipe.transform(originalDTDate, 'yyyy-MM-dd');

    return this.formBuilder.group({
      Start_Date: [formatedStartDate, [Validators.required]],
      End_Date: [formatedEndDate, [Validators.required]],
      JustifyingDocument: [performance.justifying_document, [Validators.required]],
      FreeProfessionalCode: [performance.FreeProfessionalAssignedCode, [Validators.required]],
      SummaryId: [performance.summarytypeid, [Validators.required]],
      freeProfessionalId: [performance.freeprofessionalassignedid, [Validators.required]],

      ForecastTravelExpenses: [performance.estimated_transport_expenses, [Validators.required]],
      ForecastTravelTime: [performance.estimated_transport_hours, [Validators.required]],
      ForecastWorkHours: [performance.estimated_work_hours, [Validators.required]],
      TotalForecastData: [performance.total_forecast_data, [Validators.required]],
      developer_category: [performance.developer_category || ''],
      developer_module: [performance.developer_module || ''],
      developer_screen_form: [performance.developer_screen_form || ''],
      developer_activity: [performance.developer_activity || '']
    });
  }

  // CHANGED: onSubmit will only send the 3 developer fields if canAddDeveloperPerformance = true
  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(UiActions.toggleConfirmationButton());

    if (this.projectManagerSelected) {
      // Build up the data to send
      const formData = { ...this.performanceForm.value };

      // If canAddDeveloperPerformance == false, remove developer fields before sending
      if (!this.canAddDeveloperPerformance) {
        delete formData.developer_category;
        delete formData.developer_module;
        delete formData.developer_screen_form;
        delete formData.developer_activity;
      }

      if (this.documentBytes != null) {
        const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
        this.OSDEventService.addPerformanceFreeProfessional(formData, this.projectManagerSelected, documentBase64);
      } else {
        this.OSDEventService.addPerformanceFreeProfessional(formData, this.projectManagerSelected, "");
      }
    }
  }

  modifyPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    // For modifying, do something similar if you want to exclude developer fields
    // when canAddDeveloperPerformance == false:
    const formData = { ...this.performanceForm.value };
    if (!this.canAddDeveloperPerformance) {
      delete formData.developer_category;
      delete formData.developer_module;
      delete formData.developer_screen_form;
      delete formData.developer_activity;
    }

    this.OSDEventService.modifyPerformanceFreeProfessional(
      formData,
      this.projectManagerSelected,
      this.performanceFP.id
    );
  }

  convertUint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
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
      FreeProfessionalCode: professionalsFree.username, FreeProfessionalAssignedId: professionalsFree.id
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
        fp.FreeprofessionaltypeAcronym.toLowerCase() === this.selectedType.toLowerCase()
      );
    } else {
      this.filteredProfessionalsFree = this.professionalsFree;
    }
  }

}
