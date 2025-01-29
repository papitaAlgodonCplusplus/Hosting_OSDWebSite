import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { OSDService } from 'src/app/services/osd-event.services';
import { ValidationsService } from 'src/app/services/validations.service';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { EventConstants } from 'src/app/models/eventConstants';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { Observable } from 'rxjs';
import { Subscriber } from 'src/app/functions/models/Subscriber';
import { UserInfo } from 'src/app/models/userInfo';
import { CountryService } from 'src/app/services/country.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register-free-professional',
  templateUrl: './onboarding-register-free-professional.component.html',
  styleUrls: ['./onboarding-register-free-professional.component.css']
})
export class OnboardingRegisterFreeProfessionalComponent implements OnDestroy {
  private apiUrl = environment.restAPIUrl;
  accountForm: FormGroup;
  personalForm: FormGroup;
  selectedSubscriberCustomer: string | undefined;
  isDropdownOpen = true;
  showDocument!: boolean;
  subscriberCustomers: DropDownItem[] = [];
  osdUsersSubscribersObservable$: Observable<UserInfo[]> = this.osdDataService.getOsdUsersSubscribersSuccess$
  subscribersObservable$: Observable<Subscriber[]> = this.osdDataService.getSubscribersSuccess$
  subscribers: Subscriber[] = [];
  workspace: DropDownItem[] = [
    { value: this.translate.instant('DT'), key: '87db7d48-ee2a-4494-8627-9cb9e377de21' },
    { value: this.translate.instant('FC'), key: 'eea2312e-6a85-4ab6-85ff-0864547e3870' },
    { value: this.translate.instant('TR'), key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
    { value: this.translate.instant('TK'), key: 'f7a8c9d3-6e2b-4a5f-9bcd-2e4d9f3a7b21' },
    { value: this.translate.instant('TC'), key: '1bfc42c6-0d32-4270-99ed-99567bc7a562' },
    { value: this.translate.instant('TM'), key: '4fbeb4e3-a284-44ef-ac65-a70a0620b1c9' },
    { value: this.translate.instant('TS'), key: 'afdc95b1-271e-4788-a00a-d40081d7314f' },
    { value: this.translate.instant('OSDSystemsEngineer'), key: '4e1477bf-e13c-084b-3bff-1149f3ab3f3b' },
  ];
  selectedWorkspace: string | undefined;
  selectedpayTPV: string | undefined;
  payTPV: DropDownItem[] = [
    { value: 'PL Code 1', key: 'KeyplCode1' }
  ];
  selectedservicerates!: string;
  servicerates: DropDownItem[] = [
    { value: this.translate.instant('tramitador_reclamaciones_ORD'), key: 'Key1' },
    { value: this.translate.instant('formador_consultor'), key: 'Key2' }
  ];
  subcribersList: DropDownItem[] = [];
  isAcceptConditions!: boolean;
  isProcessor: boolean = false;
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;
  uploadFile: boolean = true;
  courses: DropDownItem[] = [];
  selectedCourse: string | undefined;
  showCourseDropdown: boolean = false;
  showCourseCheckbox: boolean = false;

  constructor(private store: Store,
    private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
    private osdEventService: OSDService,
    private translate: TranslateService,
    private osdDataService: OSDDataService,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
  ) {
    this.accountForm = this.createAccountForm();
    this.personalForm = this.createPersonalForm();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCheckBoxChange() {
    if (this.accountForm.value.courseCheckbox) {
      this.showCourseDropdown = true;
      this.fetchCourses();
    }
    else {
      this.showCourseDropdown = false;
    }
  }

  onWorkspaceChange() {
    this.selectedWorkspace = this.accountForm.get('workspace')?.value;
    this.cdr.detectChanges();
    this.showCourseCheckbox = true;
    this.selectedWorkspace = this.accountForm.value.workspace;
    if (this.selectedWorkspace === 'eea2312e-6a85-4ab6-85ff-0864547e3870' || this.accountForm.value.courseCheckbox) {
      this.fetchCourses();
      this.showCourseDropdown = true;
    } else {
      this.showCourseDropdown = false;
    }
  }

  onCourseChange = () => {
    this.selectedCourse = this.accountForm.value.course;
  }

  fetchCourses() {
    this.http.get<any>(`${this.apiUrl}/courses`).subscribe(
      (response) => {
        if (response.success && response.courses.length) {
          this.courses = response.courses.map((course: any) => ({
            value: course.title,
            key: course.id,
            mode: course.mode
          }));
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  get cfhOptions() {
    // First, map the original courses array into an array of { display, value }
    const mapped = this.courses.map((c) => {
      // Example c.value: "course_name (some_content) (some_other_part)"
      // Suppose you want the piece inside the first parentheses:
      let extracted = '';
      if (c.value) {
        const parts = c.value.split('(');
        // e.g. ["course_name ", "some_content) ", "some_other_part)"]
        if (parts.length >= 2) {
          extracted = parts[1].replace(')', '').trim();
        }
      }
      return {
        display: extracted, // The label to show (e.g. "AlexCFH")
        value: c.key        // The actual key or ID behind the scenes
      };
    });

    // 2) Filter out duplicates in 'display' using a Set
    const unique: { display: string; value: string }[] = [];
    const seen = new Set<string>(); // track distinct display values

    mapped.forEach((item) => {
      if (!seen.has(item.display)) {
        seen.add(item.display);
        unique.push(item);
      }
    });

    return unique; // Only distinct labels remain
  }

  trackByKey(index: number, item: any): string {
    return item.key;
  }

  ngOnInit(): void {
    this.accountForm.get('workspace')?.valueChanges.subscribe((value) => {
      this.selectedWorkspace = value;
    });
    setTimeout(() => {
      this.translate.get([
        'DT', 'FC', 'TR', 'TK', 'TC', 'TM', 'TS', 'OSDSystemsEngineer'
      ]).subscribe(translations => {
        this.workspace = [
          { value: translations['DT'], key: '87db7d48-ee2a-4494-8627-9cb9e377de21' },
          { value: translations['FC'], key: 'eea2312e-6a85-4ab6-85ff-0864547e3870' },
          { value: translations['TR'], key: '2fc2a66a-69ca-4832-a90e-1ff590b80d24' },
          { value: translations['TK'], key: 'f7a8c9d3-6e2b-4a5f-9bcd-2e4d9f3a7b21' },
          { value: translations['TC'], key: '1bfc42c6-0d32-4270-99ed-99567bc7a562' },
          { value: translations['TM'], key: '4fbeb4e3-a284-44ef-ac65-a70a0620b1c9' },
          { value: translations['TS'], key: 'afdc95b1-271e-4788-a00a-d40081d7314f' },
          { value: translations['OSDSystemsEngineer'], key: '4e1477bf-e13c-084b-3bff-1149f3ab3f3b' },
        ];
      });
      this.onWorkspaceChange();
      this.onCourseChange();
      this.countryService.getCountries().subscribe((data: any[]) => {
        let countriesList;
        if (this.translate.currentLang === "en") {
          countriesList = data
            .map(country => {
              if (country.name?.common && country.cca2) {
                return {
                  value: country.name.common,
                  key: country.name.common
                } as DropDownItem;
              }
              return undefined;
            })
            .filter(country => country !== undefined)
            .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
        }
        else if (this.translate.currentLang === "es") {
          countriesList = data
            .filter(country => country.translations?.spa)
            .map(country => {
              if (country.translations?.spa?.common && country.cca2) {
                return {
                  value: country.translations.spa.common,
                  key: country.name.common
                } as DropDownItem;
              }
              return undefined;
            })
            .filter(country => country !== undefined)
            .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
        }
        this.countries = countriesList as DropDownItem[];
        this.countries.sort((a, b) => a.value.localeCompare(b.value));
      });

      this.osdEventService.GetSubscribers();
      this.showDocument = this.translate.currentLang === "en"
      this.store.dispatch(UiActions.hideFooter());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);

    this.osdUsersSubscribersObservable$.subscribe(osdUsersSubscribers => {
      this.subscribersObservable$.subscribe(subscribers => {
        osdUsersSubscribers.forEach(userSub => {
          var subscriberFound = subscribers.find(sub => sub.userId == userSub.Id)
          if (subscriberFound) {
            var dropDownItem: DropDownItem = { value: subscriberFound.companyName, key: subscriberFound.id }
            this.subscriberCustomers.push(dropDownItem)
          }
        })
      });
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  openVideoTrainerConsultant() {
    window.open('https://youtu.be/fZ0duSXXrs8', '_blank');
  }

  makeAPurchaseTrainerConsultant() {
    window.open('https://buy.stripe.com/00g9BD55y54t0mYcMR', '_blank');
  }

  openVideoTecnicOSD() {
    window.open('https://youtu.be/M_WhgGimbL8', '_blank');
  }

  makeAPurchaseTecnicOSDLink() {
    window.open('https://buy.stripe.com/28o9BDgOgcwV2v67sz', '_blank');
  }

  private createAccountForm(): FormGroup {
    return this.formBuilder.group({
      workspace: ['', [Validators.required]],
      pricePerHour: ['60'],
      IdentificationFileName: ['', [Validators.required]],
      IdentificationFileId: [''],
      CurriculumVitaeFileName: ['', [Validators.required]],
      CurriculumVitaeFileId: [''],
      CivilLiabilityInsuranceFileName: [''],
      CivilLiabilityInsuranceFileId: [''],
      servicerates: [''],
      payTPV: [''],
      courseTitle: [''],
      courseMode: [''],
      courseCFH: [''],
      course: [''],
      courseCheckbox: [false],
    });
  }

  get distinctModes(): string[] {
    if (!this.courses) return [];

    // Gather modes into a Set to remove duplicates
    const modeSet = new Set<string>();

    // Each course has a 'mode' property
    this.courses.forEach(course => {
      if (course.mode) {
        modeSet.add(course.mode);
      }
    });

    // Return as an array
    return Array.from(modeSet);
  }


  get distinctTitles(): string[] {
    if (!this.courses) return [];
    return Array.from(new Set(this.courses.map(c => {
      const parts = c.value.split('(');
      return parts[0].trim();
    })));
  }

  updateCourseString() {
    const { courseTitle, courseMode, courseCFH } = this.accountForm.value;
    const combined_string = `${courseTitle} (${courseCFH})`;
    for (let course of this.courses) {
      if (course.value === combined_string && course.mode === courseMode) {
        console.log('Found course:', course);
        break;
      }
    }
  }

  private createPersonalForm(): FormGroup {
    const personalForm = this.formBuilder.group({
      identity: ['', [Validators.required]],
      name: ['', [Validators.required]],
      companyName: [''],
      firstSurname: ['', [Validators.required]],
      middleSurname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      landline: [''],
      mobilePhone: ['', [Validators.required]],
      email: ['', [Validators.required, this.validationsService.isValidEmail]],
      web: [''],
      password: ['', [Validators.required, this.validationsService.isValidPassword, Validators.minLength(6)], []],
      accountType: ['0c61160c-d087-42b6-9fa0-1fc8673a00b2'],
      acceptConditions: [false]
    });
    return personalForm;
  }
  

  onSubmit(): void {
    const workspace = this.accountForm.value.workspace;
    const userEmail = this.personalForm.value.email;
    const selectedCourse = this.accountForm.value.course;

    // Validate forms
    if (!this.personalForm.value.country) {
      this.personalForm.get('country')?.setErrors({ required: true });
      return;
    }
    if (this.accountForm.invalid || this.personalForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.personalForm.markAllAsTouched();
      const alertMsg = this.translate.currentLang === "en"
        ? "There are missing fields to fill out"
        : "Faltan campos por llenar";

      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: alertMsg }));
      this.store.dispatch(ModalActions.openAlert());
      return;
    }

    // Validate acceptance of terms
    if (!this.personalForm.value.acceptConditions) {
      this.isAcceptConditions = true;
      return;
    }

    this.uploadFile = true;
    this.store.dispatch(UiActions.toggleConfirmationButton());
    localStorage.setItem('userEmail', userEmail);

    if (workspace === 'eea2312e-6a85-4ab6-85ff-0864547e3870') {
      this.http.post(`${this.apiUrl}/check-approval`, { email: userEmail, course_id: selectedCourse })
        .subscribe((response: any) => {
          if (response.approved) {
            this.osdEventService.professorRegister(this.accountForm.value, this.personalForm.value, EventConstants.FREE_PROFESSIONAL)
              .subscribe({
                next: (res: any) => {
                  this.router.navigate(['/auth']);
                },
                error: (err: any) => {
                  console.error("Professor registration failed:", err);
                  this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Professor registration failed. Please try again." }));
                  this.store.dispatch(ModalActions.openAlert());
                }
              });
          } else {
            // Show error if not approved
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Course not yet approved' }));
            this.store.dispatch(ModalActions.openAlert());
          }
        }, (error) => {
          console.error("Approval check failed:", error);
          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Approval check failed. Please try again." }));
          this.store.dispatch(ModalActions.openAlert());
        });
    } else {
      this.osdEventService.userRegister(this.accountForm.value, this.personalForm.value, EventConstants.FREE_PROFESSIONAL)
        .subscribe({
          next: (response: any) => {
            this.router.navigate(['/auth']);
          },
          error: (error: any) => {
            console.error("Registration failed:", error);
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Registration failed. Please try again." }));
            this.store.dispatch(ModalActions.openAlert());
          }
        });
    }
  }

  CheckIfIsTr() {
    this.selectedWorkspace = this.accountForm.value.workspace;
    if (this.selectedWorkspace === "2fc2a66a-69ca-4832-a90e-1ff590b80d24") {
      this.isProcessor = false

    } else {
      this.isProcessor = true
    }
  }

  handleFileUploaded(event: { typeFile: string, fileId: string }): void {
    console.log('File uploaded:', event);
    if (event.typeFile === "Identification") {
      this.accountForm.patchValue({
        IdentificationFileId: event.fileId
      })
    }
    else if (event.typeFile === "CurriculumVitae") {
      this.accountForm.patchValue({
        CurriculumVitaeFileId: event.fileId
      })
    }
    else {
      this.accountForm.patchValue({
        CivilLiabilityInsuranceFileId: event.fileId
      })
    }
  }
}
