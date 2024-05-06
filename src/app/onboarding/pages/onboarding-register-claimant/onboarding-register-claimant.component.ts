import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { EventConstants } from 'src/app/models/eventConstants';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';
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
    { value: this.translate.instant('SimpleClaim'), key: 'SimpleClaim' },
    { value: this.translate.instant('ComplexClaim'), key: 'ComplexClaim' },
    { value: this.translate.instant('ExtrajudicialClaimSustainability'), key: 'ExtrajudicialClaimSustainability' },
    { value: this.translate.instant('MediationArbitration'), key: 'MediationArbitration' }
  ];
  selectedSubscribers: string | undefined;
  subscribers: any[] = [];
  documentNames: string[] = new Array(2);
  isAcceptConditions!: boolean;
  registration: boolean = false;
  openModal: boolean = false;

  filteredSubscribers: any[] = [];
  filterCountry = '';
  filterCompanyName = '';

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private translate: TranslateService,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private authenticationService: AuthenticationService
  ) {
    this.personalForm = this.createPersonalForm();
    this.accountForm = this.createAccountForm();
  }

  ngOnInit(): void {
    this.osdEventService.GetSubscribers();

    setTimeout(() => {
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());

      this.isValidToken$.subscribe((validation) => {
        if (validation) {
          this.showPersonalInfo = false
          this.personalForm.patchValue({
            registrationOption: 'unregistered'
          });
          this.personalForm.patchValue({
            acceptConditions: true
          });
        }
        else {
          this.showPersonalInfo = true
        }
      })

      this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
        this.subscribers = osdUsersSubscribers;
        console.log(osdUsersSubscribers)
        this.applyFilters()
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

  onSubmit(): void {
    this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
    if (this.accountForm.invalid && this.personalForm.invalid && this.personalForm.value.registrationOption == "register" || this.personalForm.value.registrationOption == null) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.translate.instant('incompleteData') }))
      this.store.dispatch(ModalActions.openAlert());
      return;
    }
    else if (this.accountForm.invalid && this.personalForm.value.registrationOption == "unregistered") {
      this.accountForm.markAllAsTouched();
      this.toggleForm("claimInfo")
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.translate.instant('incompleteClaim') }))
      this.store.dispatch(ModalActions.openAlert());
      return;
    }

    if (!this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
      return;
    }

    this.accountForm.patchValue({
      subscriberClaimed:  this.selectedSubscribers 
    });

    if (this.personalForm.value.registrationOption === "register") {
      this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, "Claimant");
    } else {
      if (this.authenticationService.userInfo?.Id) {
        const claimantIdControl = new FormControl(this.authenticationService.userInfo.Id);
        this.accountForm.addControl(EventConstants.CLAIMANT_ID, claimantIdControl);
      }
      this.osdEventService.addClaim(this.accountForm.value);
    }
  }

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  applyFilters() {
    this.filteredSubscribers = this.subscribers.filter(subscriber =>
      (this.filterCountry ? subscriber.Country.toLowerCase().includes(this.filterCountry.toLowerCase()) : true) &&
      (this.filterCompanyName ? subscriber.CompanyName.toLowerCase().includes(this.filterCompanyName.toLowerCase()) : true)
    );
  }

  selectSubscriber(id: string, name: string) {
    this.accountForm.patchValue({
      subscriberClaimed: name
    });
    this.selectedSubscribers = id;
    this.openModal = false;
  }
}
