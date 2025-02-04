import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';
import { DatePipe } from '@angular/common';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';
import { FreeProfessionalType } from '../../Models/freeprofessionalType';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-performances-buy',
  templateUrl: './create-performances-buy.component.html',
  styleUrls: ['./create-performances-buy.component.css']
})
export class CreatePerformancesBuyComponent implements OnDestroy {

  performanceForm: FormGroup;
  documentName: string | undefined;
  performance$: Observable<PerformanceBuy> = this.store.select(PerformanceSelectors.performanceBuy);
  performanceBuy!: PerformanceBuy;
  performance!: any;
  showButtons: boolean = true;
  selectedSummaryType: string | undefined;
  summaryTypes: DropDownItem[] = [];
  projectManagerSelectedObservable$: Observable<string> = this.store.select(PerformanceSelectors.projectManagerId);
  projectManagerSelected: string = '';
  documentFile: File | null = null;
  documentBytes: Uint8Array | null = null;
  isViewPerformance: boolean = false;
  isCreatePerformance: boolean = false;

  // FreeProfessional-related variables
  professionalTypes: FreeProfessionalType[] = [
    { id: '1bfc42c6-0d32-4270-99ed-99567bc7a562', name: 'Accounting Technician', acronym: 'TC' }, //
    { id: '2fc2a66a-69ca-4832-a90e-1ff590b80d24', name: 'Processor', acronym: 'TR' },
    { id: '3d4a9c5e-f6d9-42a9-bef7-3e121fe622b0', name: 'IT administrators', acronym: 'INFIT' },
    { id: '4e1477bf-e13c-084b-3bff-1149f3ab3f3b', name: 'OSD Systems Engineer', acronym: 'ISOSD' },
    { id: '4fbeb4e3-a284-44ef-ac65-a70a0620b1c9', name: 'Marketing', acronym: 'TM' }, 
    { id: 'afdc95b1-271e-4788-a00a-d40081d7314f', name: 'Citizen service', acronym: 'TS' },
    { id: 'eea2312e-6a85-4ab6-85ff-0864547e3870', name: 'Trainer', acronym: 'FC' }, // 
  ];
  filteredProfessionalsFree!: FreeProfessional[];
  professionalsFree!: FreeProfessional[];
  selectedType: string = '';
  showModal: boolean = false;

  constructor(
    private store: Store,
    private osdEventService: OSDService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private OSDDataService: OSDDataService,
    private authService: AuthenticationService,
    private translate: TranslateService,
  ) {
    this.performanceForm = this.createForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
      this.osdEventService.GetSummaryTypes();
      this.osdEventService.GetFreeProfessionalsDataEvent();
    }, 0);

    this.performance$.subscribe(performance => {
      this.performance = performance;
      if (Object.keys(this.performance).length > 0) {
        this.performanceForm = this.fillForm(performance);
      }
    });

    this.OSDDataService.SummaryTypesPerformanceBuyList$.subscribe(summaryTypes => {
      summaryTypes.forEach(items => {
        var entityDropDownItem: DropDownItem = { value: items.summary, key: items.id };
        this.summaryTypes.push(entityDropDownItem);
      });
    });

    this.osdEventService.getFreeProfessionalsList().then(freeProfessionals => {
      this.filteredProfessionalsFree = freeProfessionals;
      this.professionalsFree = freeProfessionals;
    });

    this.projectManagerSelectedObservable$.subscribe(id => {
      this.projectManagerSelected = id;
    });
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

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: {} as PerformanceBuy }));
    }, 0);
  }

  private createForm(): FormGroup {
    this.isCreatePerformance = true
    return this.formBuilder.group({
      Date: ['', [Validators.required]],
      MinimumUnits: ['', [Validators.required]],
      MaximumUnits: ['', [Validators.required]],
      UnitaryCost: ['', [Validators.required]],
      ShelfLife: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      SummaryTypeId: ['', [Validators.required]],
      FreeProfessionalAssignedId: ['', [Validators.required]], // New field
      FreeProfessionalCode: ['', [Validators.required]] // New field
    });
  }

  private fillForm(performance: PerformanceBuy): FormGroup {
    this.isCreatePerformance = false;
    const formattedDate = this.datePipe.transform(performance.Date, 'yyyy-MM-dd');
    this.documentName = performance.JustifyingDocument;
    return this.formBuilder.group({
      Date: [formattedDate, [Validators.required]],
      MinimumUnits: [performance.MinimumUnits, [Validators.required]],
      MaximumUnits: [performance.MaximumUnits, [Validators.required]],
      UnitaryCost: [performance.UnitaryCost, [Validators.required]],
      ShelfLife: [performance.ShelfLife, [Validators.required]],
      SummaryTypeId: [performance.SummaryTypeId, [Validators.required]],
      JustifyingDocument: [performance.JustifyingDocument, [Validators.required]],
      FreeProfessionalAssignedId: [performance.FreeProfessionalAssignedId, [Validators.required]],
      FreeProfessionalCode: [performance.FreeProfessionalCode, [Validators.required]]
    });
  }

  selectProfessionalFree(professional: FreeProfessional): void {
    this.performanceForm.patchValue({
      FreeProfessionalCode: professional.username,
      FreeProfessionalAssignedId: professional.id
    });
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.filteredProfessionalsFree.slice(startIndex, endIndex);
  }

  modifyPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.osdEventService.modifyPerformanceBuy(this.performanceForm.value, this.projectManagerSelected, this.performance.Id);
  }

  convertUint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(UiActions.toggleConfirmationButton())
    if (this.projectManagerSelected) {
      if (this.documentBytes != null) {
        const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
        this.osdEventService.performanceBuy(this.performanceForm.value, this.projectManagerSelected, documentBase64);
      } else {
        this.osdEventService.performanceBuy(this.performanceForm.value, this.projectManagerSelected, "");
      }
    }
    this.store.dispatch(
      ModalActions.addAlertMessage({ alertMessage: "Registration successful!" })
    );
    this.store.dispatch(ModalActions.openAlert());
  }

  openModal() {
    this.showModal = true;
  }

  applyFilter(): void {
    if (this.selectedType) {
      this.filteredProfessionalsFree = this.professionalsFree.filter(fp =>
        fp.FreeprofessionaltypeAcronym.toLowerCase() === this.selectedType.toLowerCase()
      );
    } else {
      this.filteredProfessionalsFree = this.professionalsFree;
    }
  }
}
