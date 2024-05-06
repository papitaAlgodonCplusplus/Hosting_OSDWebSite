import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UiActions } from 'src/app/store/actions';
import { ClaimSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnDestroy {

  registerForm!: FormGroup;
  claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private authenticationService: AuthenticationService) {
    this.registerForm = this.createForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.claim$.subscribe(claim => {
        this.registerForm = this.fillForm(claim);
      })
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createForm(): FormGroup {
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

  private fillForm(claim: Claim): FormGroup {
    const fecha = this.convertDate(claim.Date);

    const form = this.formBuilder.group({
      claimant: [this.translate.instant(claim.Claimtype)],
      state: [this.translate.instant(claim.Status)],
      subscriber: [this.authenticationService.userInfo?.CompanyName],
      amountClaimed: [claim.Amountclaimed],
      AAsavingsPP: [''],
      creditingDate: [''],
      OSDvaluation: [''],
      valuationClaimant: [''],
      valuationFreeOSDprofessionals: [''],
      freeProfessional: ['']
    });
    return form;
  }

  convertDate(dateAndHour: string): string {
    const [datePart, timePart] = dateAndHour.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');

    const fechaConHora = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    const soloFecha = fechaConHora.toISOString().split('T')[0];

    return soloFecha;
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
