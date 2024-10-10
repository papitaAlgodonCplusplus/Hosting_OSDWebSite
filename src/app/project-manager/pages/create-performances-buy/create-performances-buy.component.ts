import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';
import { DatePipe } from '@angular/common';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';

@Component({
  selector: 'app-create-performances-buy',
  templateUrl: './create-performances-buy.component.html',
  styleUrls: ['./create-performances-buy.component.css']
})
export class CreatePerformancesBuyComponent implements OnDestroy {

  performanceForm: FormGroup;
  documentName: string | undefined;
  performance$: Observable<PerformanceBuy> = this.store.select(PerformanceSelectors.performanceBuy)
  performanceBuy!: PerformanceBuy;
  performance!: any;
  showButtons: boolean = true;
  selectedSummaryType: string | undefined;
  summaryTypes: DropDownItem[] = [];
 projectManagerSelectedObservable$: Observable<string> = this.store.select(PerformanceSelectors.projectManagerId)
  projectManagerSelected: string = "";
  modifiedPerformanceBuy: any;
  isCreatePerformance: boolean = false;
  isViewPerformance: boolean = true;
  documentFile: File | null = null;
  documentBytes: Uint8Array | null = null;
  documentUrl: string | null = null;

  constructor(private store: Store,
    private osdEventService: OSDService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private authService: AuthenticationService
  ) {
    this.performanceForm = this.createForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
      this.OSDEventService.GetSummaryTypes();
      this.OSDEventService.GetFreeProfessionalsDataEvent();
    }, 0);

    this.performance$.subscribe(performance => {
      this.performance = performance
      if(Object.keys(this.performance).length > 0){
        this.performanceForm = this.fillForm(performance)
      }
    })

    this.OSDDataService.SummaryTypesPerformanceBuyList$.subscribe(summaryTypes => {
      summaryTypes.forEach(items => {
        var entityDropDownItem: DropDownItem = { value: items.Summary, key: items.Id };
        this.summaryTypes.push(entityDropDownItem);
      });
    });

    this.projectManagerSelectedObservable$.subscribe(id => {
      this.projectManagerSelected = id;
    })

    this.OSDEventService.getFreeProfessionalsList().then(freeProfessionals => {
      if (this.authService.userInfo) {
        if (freeProfessionals) {
          const freeProfessional: FreeProfessional | undefined = freeProfessionals?.find(fp => fp.Userid === this.authService.userInfo?.Id);
          if (freeProfessional?.FreeprofessionaltypeAcronym == "DT" || freeProfessional?.FreeprofessionaltypeAcronym == "INFIT") {
            this.isViewPerformance = false;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: {} as PerformanceBuy }))
    }, 0);
  }

  private fillForm(performance : PerformanceBuy): FormGroup {
    this.isCreatePerformance = false;

    const fechaOriginal = performance.Date;
    const fechaFormateada = this.datePipe.transform(fechaOriginal, 'yyyy-MM-dd');
    this.documentName = this.performance.JustifyingDocument;
    const form = this.formBuilder.group({
      Date: [fechaFormateada, [Validators.required]],
      ProductServiceId: [performance.ProductServiceId, [Validators.required]],
      MinimumUnits: [performance.MinimumUnits, [Validators.required]],
      MaximumUnits: [performance.MaximumUnits, [Validators.required]],
      UnitaryCost: [performance.UnitaryCost, [Validators.required]],
      ShelfLife: [performance.ShelfLife, [Validators.required]],
      SummaryTypeId: [performance.SummaryTypeId, [Validators.required]],
      JustifyingDocument: [performance.JustifyingDocument, [Validators.required]]
    });
    return form;
  }

  private createForm(): FormGroup {
    this.isCreatePerformance = true
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      ProductServiceId: ['', []],
      MinimumUnits: ['', [Validators.required]],
      MaximumUnits: ['', [Validators.required]],
      UnitaryCost: ['', [Validators.required]],
      ShelfLife: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      SummaryTypeId: ['', [Validators.required]]
    });
    return form;
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    
    this.store.dispatch(UiActions.toggleConfirmationButton())

    if(this.documentBytes != null){
      if (this.projectManagerSelected) {
        if(this.documentBytes != null){
          const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
          this.OSDEventService.performanceBuy(this.performanceForm.value, this.projectManagerSelected, documentBase64);
        }else{
          this.OSDEventService.performanceBuy(this.performanceForm.value, this.projectManagerSelected, "");
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

  modifyPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.OSDEventService.modifyPerformanceBuy(this.performanceForm.value, this.projectManagerSelected, this.performance.Id);
  }

  displayFileName(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input?.files && input.files.length > 0) {
      this.documentFile = input.files[0];  
      this.documentName = this.documentFile.name;  
  
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        this.documentBytes = new Uint8Array(arrayBuffer); 
      };
      reader.readAsArrayBuffer(this.documentFile);  
    }
  }
}
