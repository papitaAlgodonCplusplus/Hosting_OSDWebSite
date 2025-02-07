import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OSDService } from 'src/app/services/osd-event.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-claims-management',
  templateUrl: './claims-management.component.html'
})
export class ClaimsManagementComponent implements OnInit {
  claimForm: FormGroup;
  isErrorInForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private OSDEventService: OSDService,
    private snackBar: MatSnackBar
  ) {
    this.claimForm = this.fb.group({
      claims: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchClaims();
  }

  get claims(): FormArray {
    return this.claimForm.get('claims') as FormArray;
  }

  /**
   * Fetches all claim records via the OSDEventService.
   * Assumes the response has a Body with a "claims" property.
   */
  fetchClaims(): void {
    this.OSDEventService.getClaims().subscribe({
      next: (response: any) => {
        let claimsData = response.Body?.claims || [];
        if (!Array.isArray(claimsData)) {
          console.warn('⚠️ Warning: claims is not an array, converting to an array');
          claimsData = [claimsData];
        }
        claimsData.forEach((claim: any) => {
          // Create a form group for each claim record using key fields.
          const claimGroup = this.fb.group({
            id: [claim.id], // hidden field for deletion reference
            code: [claim.code || '', Validators.required],
            datecreated: [{ value: this.formatDate(claim.datecreated) || '', disabled: true }],
            status: [{ value: claim.status || '', disabled: true }],
            claimtype: [{ value: claim.claimtype || '', disabled: true }],
            amountclaimed: [{ value: claim.amountclaimed || '', disabled: true }],
            savingsimprovement: [{ value: claim.improvementsavings || '', disabled: true }],
            amountpaid: [{ value: claim.amountpaid || '', disabled: true }],
          });
          this.claims.push(claimGroup);
        });
      },
      error: (error) => {
        console.error('❌ Error fetching claims:', error);
        this.snackBar.open('❌ Error fetching claim records.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');
  }

  /**
   * Deletes the claim record from the form array and calls the backend deletion API.
   * @param index The index of the claim to delete.
   */
  removeClaim(index: number): void {
    const claimControl = this.claims.at(index);
    const claimId = claimControl.get('id')?.value;
    // Remove from the form array immediately.
    this.claims.removeAt(index);
    // Call the deletion API (assuming deleteClaim accepts a claim id).
    this.OSDEventService.deleteClaim(claimId).subscribe({
      next: () => {
        this.snackBar.open('Claim record deleted successfully.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error: any) => {
        console.error('❌ Error deleting claim record:', error);
        this.snackBar.open('❌ Error deleting claim record.', 'Close', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
