import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions, ClaimActions } from 'src/app/store/actions';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { TranslateService } from '@ngx-translate/core';
import { Claim } from 'src/app/models/claim';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FreeProfessional } from '../../models/FreeProfessional';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';

@Component({
  selector: 'app-assign-pltr-claims',
  templateUrl: './assign-pltr-claims.component.html',
  styleUrls: ['./assign-pltr-claims.component.css']
})
export class AssignPLTRClaimsComponent implements OnInit, OnDestroy {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  displayedItems: Claim[] = [];
  users: UserInfo[] = [];
  user!: UserInfo;
  isAdmin: boolean = true;
  isClaimant: boolean = false;
  showModal: boolean = false;
  claim: Claim | null = null;
  assignCount: number = 0;

  // Dropdown arrays for the shared-simple-dropdown
  allSubscribersDropdown: DropDownItem[] = [];
  processorsDropdown: DropDownItem[] = [];

  // Extended filter form including assignment controls
  filterForm: FormGroup;

  constructor(
    private store: Store,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      country: [''], // if needed
      client: [''],
      processor: [''],
      selectedProcessor: ['']
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());

      // Setup user properties
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo;
        this.isClaimant = this.user.AccountType === "Claimant";
        if (this.user.Id === "e77b5172-f726-4c1d-9f9e-d2dbd77e03c9" || this.user.Isadmin) {
          this.isAdmin = true;
          this.osdEventService.gettingClaimsData(this.user.Id, "");
        } else {
          this.osdEventService.gettingClaimsData(this.user.Id, this.user.AccountType);
        }
      }

      // Subscribe to claim list updates
      this.osdDataService.ClaimsList$.subscribe(claims => {
        this.claims = claims;
        this.filteredClaims = [...claims];
        this.updateDisplayedItems();
        this.populateClientDropdown();

        for (let i = 0; i < this.claims.length; i++) {
          this.osdEventService.gettingFreeProfessionalsTRData(this.claims[i].subscriberclaimedid);
          const tempArray: UserInfo[] = [];
          console.log("Subscribing to free professionals TR data...");
          this.osdDataService.usersFreeProfessionalTR$.subscribe(item => {
            item.forEach(user => {
              if (!tempArray.some(tempUser => tempUser.code === user.code)) {
                tempArray.push(user);
              }
            });
            this.users = tempArray;
            console.log("Free professionals TR data received:", this.users);
            this.processorsDropdown = this.users.map(u => ({
              key: u.name,        // Change as needed (could also be u.code)
              value: u.name         // The processor's id is used for assignment
            }));
          });
        }
      });
    }, 200);
  }

  populateClientDropdown(): void {
    const uniqueClients = [...new Set(this.claims.map(claim => claim.companyname))]
      .filter(name => name)
      .sort();
    this.allSubscribersDropdown = uniqueClients.map(name => ({
      key: name,
      value: name
    }));
  }

  changeCount(event: any): void {
    const value = event.target.valueAsNumber; // Get number from input
    console.log("Assign count changed:", value);

    // Ensure value is always 0 or greater
    this.assignCount = isNaN(value) || value < 0 ? 0 : value;
  }

  // Called when the "Assign" button in the filter section is clicked
  assignClaimsToProcessor(): void {
    const selectedClient = this.filterForm.value.client;
    const assignCount = +this.assignCount;
    const selectedProcessor = this.filterForm.value.selectedProcessor;
    const selectedProcessorId = this.users.find(u => u.name === selectedProcessor)?.id;
    console.log("Assigning claims to processor:", selectedProcessorId, selectedProcessor, assignCount, selectedClient);

    if (!selectedClient || !selectedProcessor || assignCount <= 0) {
      console.error("Please select a client, a processor and enter a positive number of claims to assign.");
      return;
    }

    // Filter claims by client (claim.companyname)
    const filtered = this.claims.filter(claim => claim.companyname === selectedClient);
    const claimsToAssign = filtered.slice(0, assignCount);

    claimsToAssign.forEach(claim => {
      if (selectedProcessorId) {
        this.osdEventService.assignFreeProfessionalsTRToClaim(claim.id, selectedProcessorId);
      } else {
        console.error("Selected processor ID is undefined.");
      }
    });

    this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Claims assigned successfully!" }));
    this.store.dispatch(ModalActions.openAlert());
  }

  onPageChangeClaims(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedItems(startIndex, endIndex);
  }

  onPageChangeUsers(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.users.slice(startIndex, endIndex);
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

  openModal(claim: Claim): void {
    this.osdEventService.gettingFreeProfessionalsTRData(claim.subscriberclaimedid);
    this.claim = claim;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // Called from within the modal to assign the selected processor to this claim
  assignFreeProfessionalToClaim(idClaim: string, idTR: string): void {
    this.osdEventService.cleanClaimList();
    const freeProfessional = this.users.find(fp => fp.id === idTR);
    if (freeProfessional) {
      this.osdEventService.assignFreeProfessionalsTRToClaim(idClaim, freeProfessional.id);
    }
    this.showModal = false;
    this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Claims assigned successfully!" }));
    this.store.dispatch(ModalActions.openAlert());
  }

  clearFilters(): void {
    this.filterForm.reset({
      country: '',
      client: '',
      processor: '',
      selectedProcessor: ''
    });
    this.osdEventService.gettingClaimsData(this.user.Id, this.user.AccountType);
  }

  filterOptions(): void {
    const { country, client, processor } = this.filterForm.value;
    this.filteredClaims = this.claims.filter(claim => {
      const matchesCountry = !country || claim.country === country;
      const matchesClient = !client || claim.companyname === client;
      const matchesProcessor = !processor || claim.id === processor;
      return matchesCountry && matchesClient && matchesProcessor;
    });
    this.updateDisplayedItems();
  }

  selectClaim(claim: Claim): void {
    this.store.dispatch(ClaimActions.setClaim({ claim }));
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
    this.osdEventService.cleanClaimList();
  }
}
