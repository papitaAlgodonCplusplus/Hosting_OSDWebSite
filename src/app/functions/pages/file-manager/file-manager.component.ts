import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { ModalActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnDestroy {

  registerForm: FormGroup;
  validationsService: any;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('reclamacion_simple'), key: 'key1' },
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

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private translate: TranslateService) {
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.translate.instant('pageInWork') }));
      this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }))
      this.store.dispatch(ModalActions.openAlert())
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      claimant: [''],
      state: [''],
      subscriber: [''],
      amountClaimed: [''],
      AAsavingsPP: [''],
      creditingDate: [''],
      OSDvaluation: [''],
      valuationClaimant: [''],
      valuationFreeOSDprofessionals: [''],
      freeProfessional: ['']
    });
    return form;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    if (this.registerForm.value.acceptConditions) {
      const userEmail = this.registerForm.value.email;
      localStorage.setItem('userEmail', userEmail);
      //  this.securityEventService.userRegister(this.registerForm.value);
    }
  }
}
