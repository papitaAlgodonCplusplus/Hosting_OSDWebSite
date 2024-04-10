import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { is, tr } from 'date-fns/locale';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { ValidationsService } from 'src/app/services/validations.service';
import { AuthenticationActions, ModalActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-register-claimant',
  templateUrl: './onboarding-register-claimant.component.html',
  styleUrls: ['./onboarding-register-claimant.component.css']
})
export class OnboardingRegisterClaimantComponent {
  items: any[] = [];
  displayedItems: any[] = [];
  isValidToken$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);
  accountForm: FormGroup;
  personalForm: FormGroup;
  showPersonalInfo!: boolean;
  selectedClaimant: string | undefined;
  claimant: DropDownItem[] = [
    { value: this.translate.instant('reclamacion_simple'), key: 'reclamacion_simple' },
    { value: this.translate.instant('reclamacion_compleja'), key: 'reclamacion_simple' },
    { value: this.translate.instant('reclamacion_sostenibilidad'), key: 'reclamacion_sostenibilidad' },
    { value: this.translate.instant('mediacion_arbitraje'), key: 'mediacion_arbitraje' }
  ];
  selectedSubscribers: string | undefined;
  subscribers: DropDownItem[] = [];
  documentNames: string[] = new Array(2);
  isAcceptConditions!: boolean;
  registration: boolean = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private translate: TranslateService,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService
  ) {

    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
  }

  ngOnInit(): void {
    this.osdEventService.GetSubscribers();

    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.isValidToken$.subscribe((validation) => {
        if (validation) {
          this.showPersonalInfo = false
        }
        else {
          this.showPersonalInfo = true
        }
      })

      this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
        osdUsersSubscribers.map(item => { 
          const subscriber: DropDownItem = { value: item.Name, key: item.Id };
          this.subscribers.push(subscriber);
        });
      });
    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createPersonalForm(): FormGroup {
    const form = this.formBuilder.group({
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      web: [''],
      registrationOption: [, [Validators.required]],
      accountType: ['7b04ef6e-b6b6-4b4c-98e5-3008512f610e'],
      acceptConditions: [false],
      city: [''],
      companyName: ['']
    });
    return form;
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 10) {
    this.displayedItems = this.items.slice(startIndex, endIndex);
  }

  private createAccountForm(): FormGroup {
    const form = this.formBuilder.group({
      claimtype: ['', [Validators.required]],
      subscriberClaimed: ['', [Validators.required]],
      serviceProvided: ['', [Validators.required]],
      amountClaimed: ['', [Validators.required]],
      facts: ['', [Validators.required]],
      supportingDocument1: ['', [Validators.required]],
      supportingDocument2: ['', [Validators.required]]
    });
    return form;
  }

  toggleForm(formType: string): void {
    if (formType === 'personalInfo') {
      this.showPersonalInfo = true;
    } else if (formType === 'claimInfo') {
      this.showPersonalInfo = false;
    }
  }

  displayFileName(): void {
    const fileNameDocument1 = document.getElementById('supportingDocument1') as HTMLInputElement;
    const fileNameDocument2 = document.getElementById('supportingDocument2') as HTMLInputElement;

    if (fileNameDocument1.value !== null || fileNameDocument2.value !== null) {
      this.documentNames[0] = fileNameDocument1.value;
      this.documentNames[1] = fileNameDocument2.value;
    }
  }

  setRegistrationTrue() {
    this.registration = true;
  }
  setRegistrationFalse() {
    this.registration = false;
  }
  onSubmit(): void {
    if (this.accountForm.invalid || this.personalForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();

      if (this.translate.currentLang == "en") {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "There are missing fields to fill out" }));
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
        this.store.dispatch(ModalActions.openAlert());
      } else {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Faltan campos por llenar" }));
        this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
        this.store.dispatch(ModalActions.openAlert());
      }

      return;
    }

    if (!this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
      console.log("Hubo error en las condiciones " + this.personalForm.value.acceptConditions)

      return;
    }

    const userEmail = this.personalForm.value.email;
    localStorage.setItem('userEmail', userEmail);
    let claimantId = "e77b5172-f726-4c1d-9f9e-d2dbd77e03c9";
    let subscriberclaimed = this.accountForm.value.subscriberClaimed
    let serviceProvided = this.accountForm.value.serviceProvided
    let amountClaimed = this.accountForm.value.amountClaimed
    let facts = this.accountForm.value.facts
    let supportingDocument1 = this.documentNames[0]
    let supportingDocument2 = this.documentNames[1]
    let claimtype = this.accountForm.value.claimtype
    if (this.registration) {
      claimantId = Guid.create().toString();
      this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, "Claimant", claimantId);
    }
    this.osdEventService.addClaim(claimantId, claimtype, subscriberclaimed, serviceProvided, facts, amountClaimed, supportingDocument1, supportingDocument2);
  }
}
