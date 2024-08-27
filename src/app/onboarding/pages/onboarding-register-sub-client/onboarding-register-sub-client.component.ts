import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-register-sub-client',
  templateUrl: './onboarding-register-sub-client.component.html',
  styleUrls: ['./onboarding-register-sub-client.component.css']
})
export class OnboardingRegisterSubClientComponent implements OnDestroy {
  isAcceptConditions!: boolean;
  accountForm: FormGroup;
  personalForm: FormGroup;
  selectedClientType: string | undefined;
  documentName: string = '';
  showDocument!: boolean;
  showModal: boolean = false;
  professionalFreeTrainers$ = this.osdDataService.ProfessionalFreeTrainerList$;
  professionalsFree! : FreeProfessional[];
  freeProfessionalExists! : boolean ;
  clientType: DropDownItem[] = [
    { value: this.translate.instant('Public Entity'), key: "Public Entity" }, //TODO: Implement language switching
    { value: this.translate.instant('Private Entity'), key: "Private Entity" },
  ];

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private osdDataService: OSDDataService
  ) {
    this.accountForm = this.createAccountForm();
    this.personalForm = this.createPersonalForm();
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.translate.currentLang == "en") {
        this.showDocument = true
      }
      else {
        this.showDocument = false
      }
      this.osdEventService.GetProfessionalFreeTrainers()
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
    this.professionalFreeTrainers$.subscribe(pft => {
        this.professionalsFree = pft;
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  displayFileName(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();

      if (fileExtension === 'pdf') {
        this.documentName = fileName;
      } else {
        if (this.translate.currentLang == "en") {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "You must insert only PDF files" }));
          this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
          this.store.dispatch(ModalActions.openAlert());
        } else {
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Debe Insertar Solo archivos PDF" }));
          this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }));
          this.store.dispatch(ModalActions.openAlert());
        }
        this.documentName = '';
      }
    } else {
      this.documentName = '';
    }
  }


  openVideo() {
    window.open('https://www.youtube.com/embed/I80vR3wOUqc', '_blank');
  }

  makeAPurchase() {
    window.open('https://buy.stripe.com/5kA0139lO0Od2v67ss', '_blank');
  }

  openVideoSolutionsOsd() {
    window.open('https://www.youtube.com/watch?v=2HTLx9uvvqw', '_blank');
  }

  makeAPurchaseSolutionsOsd() {
    window.open('https://buy.stripe.com/00g5ln69CeF35Hi28b', '_blank');
  }

  private createPersonalForm(): FormGroup {
    const personalForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      zipCode: ['', Validators.required],
      address: ['', [Validators.required]],
      city: [''],
      country: [''],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      web: [''],
      accountType: ['063e12fa-33db-47f3-ac96-a5bdb08ede61'],
      acceptConditions: [false]
    });
    return personalForm;
  }
  private createAccountForm(): FormGroup {
    const accountForm = this.formBuilder.group({
      clientType: ['', [Validators.required]],
      plCode: [''],
      showCodepl:['']
    });
    return accountForm;
  }

  mostrarMenu = true;

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  onSubmit(): void {
    if (this.personalForm.invalid || this.accountForm.invalid) {
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
      return
    }

    if (this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
    }

    const userEmail = this.personalForm.value.email;
    localStorage.setItem('userEmail', userEmail);
    this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, EventConstants.SUBSCRIBER_CUSTOMER);
  }

  openModal() {
    this.showModal = !this.showModal;
    this.accountForm.patchValue({
      plCode: '', showCodepl:''
    });  
    this.freeProfessionalExists = false
  }

  closeModal() {
    this.showModal = false;
  }

  verifiedProfessionalFree(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.trim(); 
  
    this.professionalsFree.forEach(pft => {
      const code = pft.Code.trim(); 
      if(code === inputValue) {
      this.freeProfessionalExists = true
      this.accountForm.patchValue({
        showCodepl: inputValue,
        plCode: pft.Id
      });      
      }
      else{
        this.freeProfessionalExists = false
      }
    });
  }
  
  eliminatedProfessionalFree(){
    this.showModal = false;
    this.freeProfessionalExists = false
    this.accountForm.patchValue({
      plCode: '', showCodepl: ''
    });  
  }
}