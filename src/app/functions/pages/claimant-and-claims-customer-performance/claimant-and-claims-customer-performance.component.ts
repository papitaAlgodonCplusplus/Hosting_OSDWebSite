import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { ClaimActions, ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventConstants } from 'src/app/models/eventConstants';
import { FreeProfessional } from '../../models/FreeProfessional';
import { ClaimantAndClaimsCustomerPerformance } from '../../models/ClaimantAndClaimsCustomerPerformance';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-claimant-and-claims-customer-performance',
  templateUrl: './claimant-and-claims-customer-performance.component.html',
  styleUrls: ['./claimant-and-claims-customer-performance.component.css']
})
export class ClaimantAndClaimsCustomerPerformanceComponent implements OnDestroy {
  performanceForm: FormGroup;
  documentName!: string;
  selectedType: string | undefined;
  type: DropDownItem[] = [];
  claimId!: string;
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  performance$: Observable<ClaimantAndClaimsCustomerPerformance> = this.store.select(PerformanceSelectors.claimantAndClaimsCustomerPerformance);
  performance!: ClaimantAndClaimsCustomerPerformance;
  isErrorInForm: boolean = false;
  isTrainer: boolean = false;
  isClaimant: boolean = false;
  isModify!: boolean;
  isUnrevised: boolean = false;
  isViewPerformance!: boolean;
  userTypePerformance: string = ''
  documentFile: File | null = null;
  documentBytes: Uint8Array | null = null;
  documentUrl: string | null = null;
  accountType: string | null = null;
  isHidden!: boolean;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService,
    private OSDEventService: OSDService,
    private AuthenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private translate: TranslateService,
  ) {
    this.performanceForm = this.createForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.claim$.subscribe(claim => {
        this.claimId = claim.Id;
      });

    }, 0);

    if (this.AuthenticationService.userInfo) {
      this.accountType = this.AuthenticationService.userInfo.AccountType;
      var accountType = this.AuthenticationService.userInfo.AccountType;
      if (accountType == EventConstants.CLAIMANT) {
        this.type = this.typesOfPerformanceClaimsService.getTypesClaimant()
        this.userTypePerformance = "CLAIMANT";
      } else if (accountType == EventConstants.SUBSCRIBER_CUSTOMER) {
        this.type = this.typesOfPerformanceClaimsService.getTypesSubscriber()
        this.userTypePerformance = "SUBSCRIBER";
      }
    }

    this.performance$.subscribe(performanceClaim => {
      if (Object.keys(performanceClaim).length > 0) {
        this.performance = performanceClaim;
        this.performanceForm = this.fillForm(performanceClaim)
        if (performanceClaim.TrainerWorkHours != null) {
          this.isUnrevised = true;
        }
      }
    })

    if (this.performance.Id != null) {
      if(this.accountType == "Claimant"){
        this.isViewPerformance = false;
        this.isModify = false;
        this.isHidden = true;
      }else{
        this.isViewPerformance = true;
      }
    } else {
      this.isViewPerformance = false;
    }
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.store.dispatch(PerformanceActions.setClaimantAndClaimsCustomerPerformance({ performanceClaim: {} as ClaimantAndClaimsCustomerPerformance }))
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      JustifyingDocument: [''],
      Summary: ['', [Validators.required]],
      Trainer_Date: [''],
      Trainer_WorkHours: [''],
      Trainer_TravelTime: [''],
      Trainer_TravelExpenses: [''],
      Trainer_Remuneration: ['']
    });
    return form;
  }

  private fillForm(performance: ClaimantAndClaimsCustomerPerformance): FormGroup {
    if (performance.UserTypePerformance == "SUBSCRIBER") {
      this.type = this.typesOfPerformanceClaimsService.getTypesSubscriber()
    } else {
      this.type = this.typesOfPerformanceClaimsService.getTypesClaimant()
    }

    let originalDate = performance.Date;
    let formatedStartDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');
    this.documentName = performance.JustifyingDocument
    const form = this.formBuilder.group({
      Date: [formatedStartDate, [Validators.required]],
      Type: [performance.Type, [Validators.required]],
      JustifyingDocument: [performance.JustifyingDocument],
      Summary: [performance.Summary, [Validators.required]],
      Trainer_Date: [''],
      Trainer_WorkHours: [''],
      Trainer_TravelTime: [''],
      Trainer_TravelExpenses: [''],
      Trainer_Remuneration: ['']
    });
    return form;
  }

  displayFileName(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input?.files && input.files.length > 0) {
      this.documentFile = input.files[0];
  
      if (this.documentFile.type !== 'application/pdf') {
        if (this.translate.currentLang == "en"){
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "The document must be in PDF format" }));
          this.store.dispatch(ModalActions.openAlert());
        }else{
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
        if (this.translate.currentLang == "en"){
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "The document exceeds 1000kb" }));
          this.store.dispatch(ModalActions.openAlert());
        }else{
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

  verifiedFormat() {
    const formValues = this.performanceForm.value;
    let travelTime, workHours, expenses;

    travelTime = formValues.Trainer_TravelTime;
    workHours = formValues.Trainer_WorkHours;
    expenses = formValues.Trainer_TravelExpenses;

    const isTravelTimeValid = this.validateTravelTime(travelTime);
    const isWorkHoursValid = this.validateWorkHours(workHours);

    if (isTravelTimeValid && isWorkHoursValid && expenses >= 0) {

      this.chargeRemunerationTrainer(formValues);
    } else {
      this.performanceForm.patchValue({ Trainer_Remuneration: '' });
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
    const WorkHours = this.convertTimeToMinutes(formValues.Trainer_WorkHours) / 60;
    const TransportHours = this.convertTimeToMinutes(formValues.Trainer_TravelTime) / 60;
    const TransportExpenses = Number(formValues.Trainer_TravelExpenses);

    const totalWorkHours = WorkHours * 60;
    const totalTransportHours = TransportHours * 30;
    const total: number = (totalWorkHours + totalTransportHours) + TransportExpenses;

    this.performanceForm.patchValue({
      Trainer_Remuneration: total
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
        this.OSDEventService.createClaimantAndClaimsCustomerPerformance(this.performanceForm.value, this.claimId, this.userTypePerformance, documentBase64);
      }else{
        this.OSDEventService.createClaimantAndClaimsCustomerPerformance(this.performanceForm.value, this.claimId, this.userTypePerformance, "");
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
      this.isErrorInForm = true;
      return;
    }
    
    this.isErrorInForm = false;
    if (this.performance) {

      if(this.documentBytes != null){
        const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
        this.OSDEventService.modifyClaimantAndClaimsCustomerPerformance(this.performanceForm.value, this.performance.Id, documentBase64);
      }else{
        this.OSDEventService.modifyClaimantAndClaimsCustomerPerformance(this.performanceForm.value, this.performance.Id, "");
      }
    }
  }
}
