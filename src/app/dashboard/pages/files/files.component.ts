import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnDestroy {
  
  registerForm: FormGroup;
  validationsService: any;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('reclamacion_simple'), key: 'key1' }, //'Reclamación Simple - 75€ /10€ /7,5€ '
    { value: this.translate.instant('reclamacion_compleja'), key: 'Key2' },
    { value: this.translate.instant('reclamacion_sostenibilidad'), key: 'key3' },
    { value: this.translate.instant('mediacion_arbitraje'), key: 'Key4' }
  ];
  selectedSubscriber: string | undefined;
  subscriber: DropDownItem[] = [
    { value: 'PL', key: 'key1' }
  ];
  selectedfreeProfessionals: string | undefined;
  freeProfessionals: DropDownItem[] = [
    { value: this.translate.instant('DT'), key: 'key1' },
    { value: this.translate.instant('FC'), key: 'Key2' },
    { value: this.translate.instant('TR'), key: 'key3' },
    { value: this.translate.instant('TC'), key: 'Key4' },
    { value: this.translate.instant('TM'), key: 'key5' },
    { value: this.translate.instant('TS'), key: 'Key6' }
  ];
  selectedStatus: string | undefined;
  Status: DropDownItem[] = [
    { value: this.translate.instant('earring'), key: 'key1' },
    { value: this.translate.instant('running'), key: 'Key2' },
    { value: this.translate.instant('finalized'), key: 'Key2' }
  ];
  isDropdownOpen = true;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private translate : TranslateService)
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
          state:['',[Validators.required]],
          subscriber:['',[Validators.required]],
          amountClaimed:['',[Validators.required]],
          AAsavingsPP:['',[Validators.required]],
          creditingDate:['',[Validators.required]],
          OSDvaluation:['',[Validators.required]],
          valuationClaimant:['',[Validators.required]],
          valuationFreeOSDprofessionals:['',[Validators.required]],
          freeProfessional:['']
    });
    return form;
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
