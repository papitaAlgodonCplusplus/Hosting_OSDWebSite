import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-create-performance',
  templateUrl: './create-performance.component.html',
  styleUrls: ['./create-performance.component.css']
})
export class CreatePerformanceComponent implements OnDestroy {
  claim$ : Observable<string> = this.store.select(ClaimSelectors.claimId);
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

     this.claim$.subscribe(claim =>{
      this.OSDEventService.createPerformance(this.performanceForm.value, claim);
     })   
  }
}