import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { FreeProfessional } from '../../models/FreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CountryService } from 'src/app/services/country.service';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-assign-nfp',
  templateUrl: './assign-nfp.component.html',
  styleUrls: ['./assign-nfp.component.css']
})
export class AssignCfhFreeprofComponent implements OnInit, OnDestroy {

  freeProfessionals: FreeProfessional[] = [];
  allFreeProfessionals: FreeProfessional[] = []; // Backup for filtering
  pagedFreeProfessionals: FreeProfessional[] = [];
  freeProfessionalsBackup: FreeProfessional[] = [];

  // Use a FormGroup for filtering (country)
  myForm!: FormGroup;

  // Pagination properties
  pageSize = 5;
  pageIndex = 0;
  totalLength = 0;

  loading = false;
  errorMessage = '';

  // CFH Id from logged user
  cfhId!: string;

  // Dropdown items for countries
  countries: DropDownItem[] = [];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private translate: TranslateService,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private authService: AuthenticationService,
    private countryService: CountryService
  ) {
    // Create a form group for filtering with a selectedCountry control
    this.myForm = this.fb.group({
      selectedCountry: ['']
    });
  }

  ngOnInit(): void {
    // Hide UI elements if needed
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);

    // Get the CFH Id from the logged in user
    const user = this.authService.userInfo;
    if (user) {
      this.cfhId = user.Id;
    }

    // Subscribe to free professionals stream
    this.osdEventService.getFreeProfessionals().subscribe(fps => {
      console.log('Free Professionals:', fps);
      // Filter out professionals that already belong to this CFH.
      const filteredFps = fps.filter(fp => fp.cfhid !== this.cfhId);
    
      this.freeProfessionals = filteredFps;
      this.freeProfessionalsBackup = filteredFps; // backup for filtering
      this.allFreeProfessionals = filteredFps;    // backup for filtering
      this.totalLength = filteredFps.length;
      this.updatePagedData();
    });
    // Fetch free professionals from the backend
    this.loadFreeProfessionalsForCfh();
    this.loadCountries();
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  // Fetch free professionals based on CFH Id
  loadFreeProfessionalsForCfh(): void {
    if (!this.cfhId) return;
    this.loading = true;
    this.osdEventService.getFreeProfessionalsByCfhId(this.cfhId).subscribe({
      next: (response: FreeProfessional[]) => {
        this.osdDataService.setFreeProfessionalsCfh(response);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load CFH Free Professionals:', err);
        this.errorMessage = this.translate.instant('Error_Loading_FreeProfessionals');
        this.loading = false;
      }
    });
  }

  // Load country dropdown items from a service
  private loadCountries(): void {
    this.countryService.getCountries()
      .pipe(
        map((countries: any[]) => this.mapCountriesToDropdown(countries))
      )
      .subscribe(countries => {
        this.countries = countries;
        this.sortCountries();
      });
  }

  private mapCountriesToDropdown(countries: any[]): DropDownItem[] {
    return countries
      .map(country => this.getCountryDropdownItem(country))
      .filter(item => item !== undefined) as DropDownItem[];
  }
  private getCountryDropdownItem(country: any): DropDownItem | undefined {
    const name = this.translate.currentLang === 'en'
      ? country.name?.common
      : country.translations?.spa?.common;

    return name && country.cca2 ? { value: name, key: country.name.common } : undefined;
  }
  private sortCountries(): void {
    this.countries.sort((a, b) => a.value.localeCompare(b.value));
  }

  onCancel() {
    this.myForm.patchValue({
      selectedCountry: '',
    });
    this.freeProfessionals = this.freeProfessionalsBackup;
    this.updatePagedData();
  }

  // Filter free professionals by selected country
  filterUsers(): void {
    console.log('Filtering by country:', this.myForm.value.selectedCountry);
    const selectedCountry: string = this.myForm.value.selectedCountry.trim().toLowerCase();
    if (selectedCountry) {
      this.freeProfessionals = this.allFreeProfessionals.filter(fp =>
        fp.country.trim().toLowerCase() === selectedCountry
      );
    } else {
      this.freeProfessionals = [...this.allFreeProfessionals];
    }
    this.totalLength = this.freeProfessionals.length;
    this.pageIndex = 0; // reset to first page on filter change
    this.updatePagedData();
  }

  // Handle pagination changes
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedFreeProfessionals = this.freeProfessionals.slice(startIndex, endIndex);
  }

  // When a free professional is selected from the table, assign them to the CFH
  onSelectFreeProfessional(fp: FreeProfessional): void {
    console.log('Selected Free Professional:', fp,"CFH ID:",this.cfhId);
    if (!this.cfhId || !fp.useremail) return;
    this.loading = true;
    this.errorMessage = '';
    this.osdEventService.addFreeProfessionalToCfh(this.cfhId, fp.useremail).subscribe({
      next: (result: any) => {
        this.loadFreeProfessionalsForCfh();
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: this.translate.instant('FreeProfessional_Assigned_Successfully') }));
        this.store.dispatch(ModalActions.openAlert());
      },
      error: (err: any) => {
        console.error('Assigning free professional failed:', err);
        this.errorMessage = this.translate.instant('Error_Assigning_FreeProfessional');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
