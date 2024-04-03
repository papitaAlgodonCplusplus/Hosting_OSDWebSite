import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { PerformanceFreeProfessional } from 'src/app/models/performanceFreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-performance-free-professional',
  templateUrl: './performance-free-professional.component.html',
  styleUrls: ['./performance-free-professional.component.css']
})
export class PerformanceFreeProfessionalComponent {
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
    { value: 'Escritos', key: 'key1' },
    { value: 'E-mails', key: 'Key2' },
    { value: 'Video Conferencias', key: 'key3' },
    { value: 'Reuniones/Juzgado', key: 'Key4' }
  ];
  PL_FreeProfessional: string | undefined;
  FreeProfessional: DropDownItem[] = [];
  isDropdownOpenPL = true;
  isDropdownOpenDT = true;
  isAcceptConditions!: boolean;
  documentName!: string;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private OSDEventService: OSDService) {
    this.performanceForm = this.createRegisterForm();
  }
  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
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
      TD_Remuneration: ['', [Validators.required]]
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

    performanceData.proyectManagerId = '065d461a-cc09-4162-b4e9-f121c11d3348'

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