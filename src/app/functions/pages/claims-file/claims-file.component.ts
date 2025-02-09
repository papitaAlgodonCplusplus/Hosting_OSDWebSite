import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Claim } from 'src/app/models/claim';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ClaimActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { Router } from '@angular/router';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { CountryService } from 'src/app/services/country.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-claims-file',
  templateUrl: './claims-file.component.html',
  styleUrls: ['./claims-file.component.css']
})
export class ClaimsFileComponent implements OnInit {
  claims: any[] = [];
  filteredClaims: any[] = [];
  displayedItems: any[] = [];
  user!: UserInfo;
  isClaimant: boolean = false;
  isAdmin: boolean = false;
  countries: DropDownItem[] = [];
  allSubscribersDropdown: DropDownItem[] = [];
  processorsDropdown: DropDownItem[] = [];
  filterForm: FormGroup;
  uniqueProcessors = new Set();
  allProcessorNames: [string, string][] = []

  constructor(
    private osdEventService: OSDService,
    private store: Store,
    private router: Router,
    private authenticationService: AuthenticationService,
    private osdDataService: OSDDataService,
    private countryService: CountryService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      country: [''],
      client: [''],
      processor: [''],
      assignedclaimid: ['']
    });
  }

  ngOnInit(): void {
    this.initializeUI();
    this.setupUser();
    this.setupSubscriptions();
    this.loadInitialData();
    this.setupFilterFormSubscription();
  }

  private initializeUI(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);
  }

  private setupUser(): void {
    const userInfo = this.authenticationService.userInfo;
    if (userInfo) {
      this.user = userInfo;
      this.isClaimant = userInfo.AccountType === "Claimant";
      this.isAdmin = userInfo.Id === "e77b5172-f726-4c1d-9f9e-d2dbd77e03c9" || !!userInfo.Isadmin;
    }
  }

  private setupSubscriptions(): void {
    this.osdDataService.ClaimsList$.subscribe(claims => {
      this.claims = claims;
      this.filteredClaims = [...claims];
      this.populateClientDropdown();
      this.updateDisplayedItems();
    });
  }

  private async loadInitialData(): Promise<void> {
    if (this.user) {
      this.osdEventService.gettingClaimsData(
        this.user.Id,
        this.user.Isadmin ? "" : this.user.AccountType
      );
    }

    await Promise.all([
      this.loadCountries(),
      this.loadProcessors()
    ]);
  }

  private setupFilterFormSubscription(): void {
    // Subscribe to form value changes
    this.filterForm.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => this.filterOptions());
  }

  private async loadCountries(): Promise<void> {
    try {
      const data = await this.countryService.getCountries().toPromise();
      if (!data) return;

      const isEnglish = this.translate.currentLang === 'en';
      this.countries = data
        .map(country => {
          const name = isEnglish ?
            country.name?.common :
            country.translations?.spa?.common;

          return name ? {
            value: name,
            key: country.name.common
          } as DropDownItem : undefined;
        })
        .filter((item): item is DropDownItem => item !== undefined)
        .sort((a, b) => a.value.localeCompare(b.value));
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  }

  private async loadProcessors(): Promise<void> {
    try {
      const response = await this.osdEventService.getOperatingProcessors().toPromise();
      const processors = response?.Body?.processors || [];
      this.processorsDropdown = processors
        .filter((row: any) => {
          if (this.uniqueProcessors.has(row.name)) {
            this.allProcessorNames.push([row.name, row.assignedclaimid]);
            return false;
          } else {
            this.allProcessorNames.push([row.name, row.assignedclaimid]);
            this.uniqueProcessors.add(row.name);
            return true;
          }
        })
        .map((row: any) => ({
          key: String(row.name),     // ensure it's a string
          value: String(row.name),
          assignedclaimid: row.assignedclaimid
        }));
    } catch (error) {
      console.error('Error loading processors:', error);
    }
  }

  private populateClientDropdown(): void {
    // Get unique company names from claims
    const uniqueClients = [...new Set(this.claims.map(claim => claim.companyname))]
      .filter(name => name) // Remove any null/undefined values
      .sort();

    this.allSubscribersDropdown = uniqueClients.map(name => ({
      key: name,
      value: name
    }));
  }

  filterOptions(): void {
    const { country, client, processor } = this.filterForm.value;
    console.log('All Processor Names:', this.allProcessorNames);
    const assignedclaimids = this.allProcessorNames
      .filter(([name]) => name === processor)
      .map(([, assignedclaimid]) => assignedclaimid);

    this.filteredClaims = this.claims.filter(claim => {
      const matchesCountry = !country || claim.country === country;
      const matchesClient = !client || claim.companyname === client;
      const matchesProcessor = !processor || assignedclaimids.includes(claim.id);

      return matchesCountry && matchesClient && matchesProcessor;
    });

    this.updateDisplayedItems();
  }

  clearFilters(): void {
    this.filterForm.reset({
      country: '',
      client: '',
      processor: '',
      assignedclaimid: ''
    });
    this.filteredClaims = [...this.claims];
    this.updateDisplayedItems();
  }

  selectClaim(claim: Claim): void {
    this.store.dispatch(ClaimActions.setClaim({ claim }));
  }

  onPageChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  updateDisplayedItems(startIndex: number = 0, endIndex: number = 5): void {
    this.displayedItems = this.filteredClaims.slice(startIndex, endIndex);
  }

  deleteClaim(claimId: string): void {
    if (!claimId) return;

    this.osdEventService.deleteClaim(claimId).subscribe({
      next: () => {
        this.claims = this.claims.filter(claim => claim.id !== claimId);
        this.filteredClaims = this.filteredClaims.filter(claim => claim.id !== claimId);
        this.updateDisplayedItems();
      },
      error: (err) => {
        console.error("Error deleting claim:", err);
      }
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
}