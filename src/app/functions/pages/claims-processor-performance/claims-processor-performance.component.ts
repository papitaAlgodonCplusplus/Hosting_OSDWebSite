import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceActions, UiActions } from 'src/app/store/actions';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { OSDService } from 'src/app/services/osd-event.services';
import { ClaimsProcessorPerformance } from '../../models/ClaimsProcessorPerformance';
import { DatePipe } from '@angular/common';
import { FreeProfessional } from '../../models/FreeProfessional';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-claims-processor-performance',
  templateUrl: './claims-processor-performance.component.html',
  styleUrls: ['./claims-processor-performance.component.css']
})
export class ClaimsProcessorPerformanceComponent implements OnDestroy {
  performanceForm: FormGroup;
  documentName!: string;
  selectedType: string | undefined;
  type!: DropDownItem[];
  claimId!: string;
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  isErrorInForm: boolean = false;
  performanceObservable$ : Observable<ClaimsProcessorPerformance> = this.store.select(PerformanceSelectors.claimsProcessorPerformance)
  performance! : ClaimsProcessorPerformance;
  isUnrevised! : boolean;
  isView! : boolean;
  isTrainer: boolean = false
  documentFile: File | null = null;
  documentBytes: Uint8Array | null = null;
  documentUrl: string | null = null;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService,
    private OSDEventService: OSDService,
    private datePipe: DatePipe,
    private AuthenticationService: AuthenticationService,
  ) {
    this.performanceForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.type = this.typesOfPerformanceClaimsService.getTypesProcessor()
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
      this.isView = true;
    }
    else{
      this.isView = false;
    }

    this.OSDEventService.GetFreeProfessionalsDataEvent();
        this.OSDEventService.getFreeProfessionalsList()
          .then(freeProfessionals => {
            if (Array.isArray(freeProfessionals)) {
              var freeProfessionalFind: FreeProfessional = freeProfessionals.find(fp => fp.Userid == this.AuthenticationService.userInfo?.Id)
              if (freeProfessionalFind.FreeprofessionaltypeName == "Trainer" || freeProfessionalFind.Isadmin) {
                this.isTrainer = true
                this.isView = false;
              }
            }
          })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.store.dispatch(PerformanceActions.setClaimProcessorPerformance({ performanceClaim: {} as ClaimsProcessorPerformance }))

    }, 0);
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      JustifyingDocument: [''],
      Summary: ['', [Validators.required]],
      Processor_WorkHours: ['', [Validators.required]],
      Processor_TravelTime: ['', [Validators.required]],
      Processor_TravelExpenses: [0, [Validators.required]],
      Processor_Remuneration: ['', [Validators.required]],
      Trainer_Date: [''],
      Trainer_WorkHours: [''],
      Trainer_TravelTime: [''],
      Trainer_TravelExpenses: [''],
      Trainer_Remuneration: ['']
    });
    return form;
  }

  private fillForm(performance : ClaimsProcessorPerformance): FormGroup {
    let originalDate = performance.Date;
    let formatedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    let originalTrainer_Date = performance.Date;
    let formatedTrainer_Date = this.datePipe.transform(originalTrainer_Date, 'yyyy-MM-dd');

    this.documentName = performance.JustifyingDocument;
    const form = this.formBuilder.group({
      Date: [formatedDate, [Validators.required]],
      Type: [performance.Type, [Validators.required]],
      JustifyingDocument: [performance.JustifyingDocument],
      Summary: [performance.Summary, [Validators.required]],
      Processor_WorkHours: [performance.Processor_WorkHours, [Validators.required]],
      Processor_TravelTime: [performance.Processor_TravelTime, [Validators.required]],
      Processor_TravelExpenses: [performance.Processor_TravelExpenses, [Validators.required]],
      Processor_Remuneration: [performance.Processor_Remuneration, [Validators.required]],
      Trainer_Date: [formatedTrainer_Date],
      Trainer_WorkHours: [performance.Trainer_WorkHours],
      Trainer_TravelTime: [performance.Trainer_TravelTime],
      Trainer_TravelExpenses: [performance.Trainer_TravelExpenses],
      Trainer_Remuneration: [performance.Trainer_Remuneration]
    });

    if (performance.JustifyingDocumentBytes) {
      const documentBlob = new Blob([performance.JustifyingDocumentBytes], { type: 'application/pdf' });
      this.documentUrl = URL.createObjectURL(documentBlob);
      this.documentName = performance.JustifyingDocument;
  }

    return form;
  }

  displayFileName(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input?.files && input.files.length > 0) {
      this.documentFile = input.files[0];  // Almacena el archivo en la variable
      this.documentName = this.documentFile.name;  // Muestra el nombre del archivo
  
      // Convertir el archivo a bytes
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        this.documentBytes = new Uint8Array(arrayBuffer);  // Almacena los bytes del archivo
      };
      reader.readAsArrayBuffer(this.documentFile);  // Lee el archivo como un ArrayBuffer
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
    } else {
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
    return hora >= 0 && hora < 24 && minutos >= 0 && minutos < 60;
  }

  private convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
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

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      this.isErrorInForm = true;
      return;
    }
  
    this.isErrorInForm = false;
    if (this.claimId) {
      if(this.documentBytes != null){
        const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
        this.OSDEventService.createClaimsProcessorPerformance(this.performanceForm.value, this.claimId, documentBase64);
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

  modifiedPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      this.isErrorInForm = true;
      return;
    }
    
    this.isErrorInForm = false;
    if (this.performance) {
      if(this.documentBytes != null){
        const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
        this.OSDEventService.modifiedClaimsProcessorPerformance(this.performanceForm.value, this.performance.Id, documentBase64);
      }
    }
  }
}
