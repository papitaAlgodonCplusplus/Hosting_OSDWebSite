import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceFreeProfessional } from 'src/app/project-manager/Models/performanceFreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthSelectors } from 'src/app/store/selectors';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-performance-free-professional',
  templateUrl: './performance-free-professional.component.html',
  styleUrls: ['./performance-free-professional.component.css']
})
export class PerformanceFreeProfessionalComponent {
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  performanceFP: any;
  modalStateFreeProfessionals: boolean = false;
  modalStateTechnicalDirector: boolean = false;
  editOtherInformation: boolean = true;
  editFreeProfessional: boolean = false;
  editTechnicalDirector: boolean = false;
  performanceForm: FormGroup;
  Response = "";
  validationsService: any;
  selectedType: string | undefined;
  type: DropDownItem[] = [
    { value: 'Escritos', key: 'Escritos' },
    { value: 'E-mails', key: 'E-mails' },
    { value: 'Video Conferencias', key: 'Video Conferencias' },
    { value: 'Reuniones/Juzgado', key: 'Reuniones/Juzgado' }
  ];
  PL_FreeProfessional: string | undefined;
  FreeProfessional: DropDownItem[] = [];
  isDropdownOpenPL = true;
  isDropdownOpenDT = true;
  isAcceptConditions!: boolean;
  documentName!: string;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private datePipe: DatePipe) {
    //this.performanceForm = this.createRegisterForm();
    this.performanceForm = this.validatePerformanceOnDataService()
    this.OSDDataService.setPerformance("")
  }

  validatePerformanceOnDataService(): FormGroup{
    this.performanceFP = this.OSDDataService.getPerformance()

    console.log('Los performances:',this.performanceFP)

    let originalDate = this.performanceFP.Date;
    let formatedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    let originalDTDate = this.performanceFP.TechnicalDirectorDate;
    let formatedDTDate = this.datePipe.transform(originalDTDate, 'yyyy-MM-dd');

    this.documentName = this.performanceFP.JustifyingDocument;
    if(this.performanceFP !== "" && this.performanceFP !== undefined){
      const form = this.formBuilder.group({
        Date: [formatedDate, [Validators.required]],
        Type: [this.performanceFP.Type, [Validators.required]],
        JustifyingDocument: [this.documentName, [Validators.required]],
        FP_WorkHours: [this.performanceFP.FreeProfessionalWorkHours, [Validators.required]],
        FP_TravelTime: [this.performanceFP.FreeProfessionalTravelHours, [Validators.required]],
        FP_TravelExpenses: [this.performanceFP.FreeProfessionalTravelExpenses, [Validators.required]],
        FP_Remuneration: [this.performanceFP.FreeProfessionalRemuneration, [Validators.required]],
        TD_Date: [formatedDate, [Validators.required]],
        TD_WorkHours: [this.performanceFP.TechnicalDirectorWorkHours, [Validators.required]],
        TD_TravelTime: [this.performanceFP.TechnicalDirectorTravelHours, [Validators.required]],
        TD_TravelExpenses: [this.performanceFP.TechnicalDirectorTravelExpenses, [Validators.required]],
        TD_Remuneration: [this.performanceFP.TechnicalDirectorRemuneration, [Validators.required]],
        Summary: [this.performanceFP.Summary, [Validators.required]]
      });
      console.log("El formulario:",form)
      return form;

    }
    else{
      return this.createRegisterForm()
    }

    
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
    this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated === false) {
        this.editOtherInformation = false
      }
    });
  }
  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  displayFileName(): void {
    const justifyingDocument = document.getElementById('JustifyingDocument') as HTMLInputElement;

    if (justifyingDocument.value !== null) {
      this.documentName = justifyingDocument.value;
    }
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      FP_WorkHours: ['', [Validators.required]],
      FP_TravelTime: ['', [Validators.required]],
      FP_TravelExpenses: ['', [Validators.required]],
      FP_Remuneration: ['', [Validators.required]],
      TD_Date: ['', [Validators.required]],
      TD_WorkHours: ['', [Validators.required]],
      TD_TravelTime: ['', [Validators.required]],
      TD_TravelExpenses: ['', [Validators.required]],
      TD_Remuneration: ['', [Validators.required]],
      Summary: ['', [Validators.required]]
    });
    return form;
  }
  toggleDropdown(Response: string) {
    if (Response == "isDropdownOpen") {
      this.isDropdownOpenPL = !this.isDropdownOpenPL;
    }
    else {
      this.isDropdownOpenDT = !this.isDropdownOpenDT;
    }
  }
  onSubmit(): void {
    console.log(this.performanceForm.value)
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }   
    let formValues = this.performanceForm.value;
    let performanceData: PerformanceFreeProfessional = new PerformanceFreeProfessional();

    performanceData.date = formValues.Date;
    performanceData.type = formValues.Type;
    performanceData.justifyingDocument = formValues.JustifyingDocument;
    performanceData.freeProfessionalWorkHours = formValues.FP_WorkHours;
    performanceData.freeProfessionalTravelHours = formValues.FP_TravelTime;
    performanceData.freeProfessionalTravelExpenses = formValues.FP_TravelExpenses;
    performanceData.freeProfessionalRemuneration = formValues.FP_Remuneration;
    performanceData.technicalDirectorDate = formValues.TD_Date;
    performanceData.technicalDirectorWorkHours = formValues.TD_WorkHours;
    performanceData.technicalDirectorTravelHours = formValues.TD_TravelTime;
    performanceData.technicalDirectorTravelExpenses = formValues.TD_TravelExpenses;
    performanceData.technicalDirectorRemuneration = formValues.TD_Remuneration;
    performanceData.summary = formValues.Summary;

    performanceData.proyectManagerId = '065d461a-cc09-4162-b4e9-f121c11d3348'

    console.log('Lo que tiene summary', performanceData)

    this.OSDEventService.addPerformanceFreeProfessional(performanceData);
  }

  openModalFP(): void{
    this.modalStateFreeProfessionals = true
    console.log('Se abre el modal')
  }
  closeModalFP(): void{
    this.modalStateFreeProfessionals = false
    console.log('Se cierra el modal')
  }

  openModalDT(): void{
    this.modalStateTechnicalDirector = true
    console.log('Se abre el modal')
  }
  closeModalDT(): void{
    this.modalStateTechnicalDirector = false
    console.log('Se cierra el modal')
  }
}