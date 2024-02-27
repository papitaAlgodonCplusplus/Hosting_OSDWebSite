import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-create-performance',
  templateUrl: './create-performance.component.html',
  styleUrls: ['./create-performance.component.css']
})
export class CreatePerformanceComponent implements OnDestroy{
  registerForm: FormGroup;
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
          claimant: ['', [Validators.required]],
          subscriber:['',[Validators.required]],
          amountClaimed:['',[Validators.required]],
          AAsavingsPP:['',[Validators.required]],
          creditingDate:['',[Validators.required]],
          OSDvaluation:['',[Validators.required]],
          valuationClaimant:['',[Validators.required]],
          valuationFreeOSDprofessionals:['',[Validators.required]]
    });
    return form;
  }
  // Declara variables para controlar la visibilidad de los campos de entrada
  showDropdownInput1: boolean = false;
  showDropdownInput2: boolean = false;

  // Método para cambiar la visibilidad de los campos de entrada según el dropdown seleccionado
  toggleDropdownInput(dropdown: string) {
   
      if (dropdown === 'dropdown1') {
          this.showDropdownInput1 = !this.showDropdownInput1;
      } else if (dropdown === 'dropdown2') {
          this.showDropdownInput2 = !this.showDropdownInput2;
      }
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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
      //  this.securityEventService.userRegister(this.registerForm.value);
    }

  }

}