import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { TypesOfPerformanceClaimsService } from '../../services/types-of-performance-claims.service';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { ClaimSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { OSDService } from 'src/app/services/osd-event.services';
import { ActivatedRoute } from '@angular/router';
import { ClaimsTrainerPerformance } from '../../models/ClaimsTrainerPerformance';
import { DatePipe } from '@angular/common';
import { FreeProfessional } from '../../models/FreeProfessional';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

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
  performanceObservable$: Observable<ClaimsTrainerPerformance> = this.store.select(PerformanceSelectors.claimsTrainerPerformance)
  performance!: ClaimsTrainerPerformance;
  isUnrevised!: boolean;
  isView!: boolean;
  isModify!: boolean;
  documentFile: File | null = null;
  documentBytes: Uint8Array | null = null;
  documentUrl: string | null = null;
  accountTypeFreeProfessional: string | null = null;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private typesOfPerformanceClaimsService: TypesOfPerformanceClaimsService,
    private OSDEventService: OSDService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private AuthenticationService: AuthenticationService,
    private translate: TranslateService,
  ) {
    this.performanceForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.reviewPerformance = params['review'];
    });
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter())
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.type = this.typesOfPerformanceClaimsService.getTypesTrainer()
    }, 0);
    this.claim$.subscribe(claim => {
      this.claimId = claim.Id;
    });

    this.performanceObservable$.subscribe(performance => {
      this.performance = performance
      if (this.performance) {
        this.performanceForm = this.fillForm(performance)
        if (this.performance.Status == "Running") {
          this.isUnrevised = false;
        } else {
          this.isUnrevised = true;
        }
      }
    })

    this.OSDEventService.getFreeProfessionalsList()
      .then(freeProfessionals => {
        if (Array.isArray(freeProfessionals)) {
          var freeProfessionalFind: FreeProfessional = freeProfessionals.find(fp => fp.Userid == this.AuthenticationService.userInfo?.Id)
          this.accountTypeFreeProfessional = freeProfessionalFind.FreeprofessionaltypeName;
          if (this.accountTypeFreeProfessional == "Trainer") {
            this.isView = false;
            this.isModify = false;
          }
        }
      })

    if (Object.keys(this.performance).length > 0) {
      this.isView = true;
    }
    else {
      this.isView = false;
    }

  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.store.dispatch(PerformanceActions.setClaimTrainerPerformance({ performanceClaim: {} as ClaimsTrainerPerformance }))
    }, 0);
  }

  private fillForm(performance: ClaimsTrainerPerformance): FormGroup {
    let originalDate = performance.Date;
    let formatedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    let originalTD_Date = performance.TechnicalDirectorDate;
    let formatedTD_Date = this.datePipe.transform(originalTD_Date, 'yyyy-MM-dd');

    this.documentName = performance.JustifyingDocument;

    const form = this.formBuilder.group({
      Date: [formatedDate, [Validators.required]],
      Type: [performance.Type, [Validators.required]],
      JustifyingDocument: [performance.JustifyingDocument],
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

    if (performance.JustifyingDocumentBytes) {
      const documentBlob = new Blob([performance.JustifyingDocumentBytes], { type: 'application/pdf' });
      this.documentUrl = URL.createObjectURL(documentBlob);
      this.documentName = performance.JustifyingDocument;
    }

    return form;
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      JustifyingDocument: ['',],
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
      if (this.documentBytes != null) {
        const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
        this.OSDEventService.createPerformanceClaimTrainer(this.performanceForm.value, this.claimId, documentBase64);
      } else {
        this.OSDEventService.createPerformanceClaimTrainer(this.performanceForm.value, this.claimId, "");
      }
    }
    this.store.dispatch(
      ModalActions.addAlertMessage({ alertMessage: "Registration successful!" })
    );
    this.store.dispatch(ModalActions.openAlert());
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

    if (this.documentBytes != null) {
      const documentBase64 = this.convertUint8ArrayToBase64(this.documentBytes);
      this.isErrorInForm = false;
      this.OSDEventService.ModifyPerformanceClaimTrainer(this.performanceForm.value, this.performance.Id, documentBase64);
    }
    else {
      this.isErrorInForm = false;
      this.OSDEventService.ModifyPerformanceClaimTrainer(this.performanceForm.value, this.performance.Id, "");
    }
  }

}

