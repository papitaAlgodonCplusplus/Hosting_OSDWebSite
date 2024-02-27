import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-create-performance',
  templateUrl: './create-performance.component.html',
  styleUrls: ['./create-performance.component.css']
})
export class CreatePerformanceComponent implements OnDestroy{
  registerForm: FormGroup;
  Response= "";
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
  isDropdownOpen = false;
  isDropdownOpen2 = false;
  
  constructor(private store: Store,
    private formBuilder: FormBuilder,)
    {
      this.registerForm = this.createRegisterForm();
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
  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
          Type:['',[Validators.required]],
          WorkHours: ['', [Validators.required]],
          TravelTime:['',[Validators.required]],
          amountClaimed:['',[Validators.required]],
          TravelExpenses:['',[Validators.required]],
          Date:['',[Validators.required]],
          DateDT:['',[Validators.required]],
          Remuneration:['',[Validators.required]],
          WorkHoursDT: ['', [Validators.required]],
          TravelTimeDT:['',[Validators.required]],
          TravelExpensesDT:['',[Validators.required]],
          RemunerationDT:['',[Validators.required]],    
    });
    return form;
  }
  toggleDropdown(Response: string ) {
    if (Response =="isDropdownOpen") {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
    else{
      this.isDropdownOpen2 = !this.isDropdownOpen2;
    }   
  }
  onSubmit(): void {
    console.log(this.registerForm.value) 
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
      
    }
    if(this.registerForm.value.acceptConditions){
      const userEmail = this.registerForm.value.email;
      localStorage.setItem('userEmail', userEmail);  
    }
  }
}