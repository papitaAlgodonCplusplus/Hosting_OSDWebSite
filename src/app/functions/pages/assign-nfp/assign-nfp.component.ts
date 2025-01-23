import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { FreeProfessional } from '../../models/FreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assign-nfp',
  templateUrl: './assign-nfp.component.html',
  styleUrls: ['./assign-nfp.component.css']
})
export class AssignCfhFreeprofComponent implements OnInit {

  freeProfessionals: FreeProfessional[] = [];
  pagedFreeProfessionals: FreeProfessional[] = [];

  // The new assignment form
  assignForm: FormGroup;

  // For pagination
  pageSize = 5;
  pageIndex = 0;
  totalLength = 0;

  loading = false;
  errorMessage = '';

  // We'll store the CFH Id from the logged user or however you track that
  cfhId!: string;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private translate: TranslateService,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private authService: AuthenticationService
  ) {
    // Create form with a single 'email' field
    this.assignForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Hide sidebars or footers if needed
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);

    // Suppose we get CFH Id from the logged in user
    // (Adjust logic if your user info is stored differently)
    const user = this.authService.userInfo;
    if (user) {
      this.cfhId = user.Id;
    }

    // Listen for changes in free professionals data if you have a Subject in OSDDataService
    // Alternatively, you might simply call a method to fetch them directly:
    //    this.loadFreeProfessionalsForCfh();
    // We'll show an example with a subscribe approach:
    this.osdDataService.freeProfessionalCfh$.subscribe((fps: FreeProfessional[]) => {
      this.freeProfessionals = fps;
      this.totalLength = fps.length;
      this.updatePagedData();
    });

    // Actually fetch them from the backend
    this.loadFreeProfessionalsForCfh();
  }

  ngOnDestroy(): void {
    // Cleanup or re-show UI elements
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  // --- 1) Fetch from backend
  loadFreeProfessionalsForCfh() {
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

  // --- 2) Assign a new free professional by email
  onAssignSubmit(): void {
    if (this.assignForm.invalid) {
      // Mark all as touched to show validation errors, if any
      this.assignForm.markAllAsTouched();
      return;
    }

    const email = this.assignForm.value.email;
    if (!this.cfhId || !email) return;

    this.loading = true;
    this.errorMessage = '';
    // You’d have a function in OSDService to handle this request:
    this.osdEventService.addFreeProfessionalToCfh(this.cfhId, email).subscribe({
      next: (result: any) => {
        // Possibly reload or simply push the newly assigned FP into local array
        this.loadFreeProfessionalsForCfh();
        // Reset the form
        this.assignForm.reset();
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

  // --- 3) Handle pagination
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }

  updatePagedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedFreeProfessionals = this.freeProfessionals.slice(startIndex, endIndex);
  }

}
