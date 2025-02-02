import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/models/claim';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { ClaimSelectors } from 'src/app/store/selectors';
import { ClaimActions } from 'src/app/store/actions';
import { OSDService } from 'src/app/services/osd-event.services';
import { TranslateService } from '@ngx-translate/core';
import { ModalActions } from 'src/app/store/actions';

@Component({
    selector: 'app-edit-claim-file',
    templateUrl: './edit-claim-file.component.html',
    styleUrls: ['./edit-claim-file.component.css']
})
export class EditClaimFileComponent implements OnInit {
    // The form instance that will be bound to the template.
    editClaimForm!: FormGroup;
    subscribers: any[] = [];
    filteredSubscribers: any[] = [];
    filterCountry = '';
    filterCompanyName = '';
    displayedItems: any[] = [];

    // Initialize selectedClaim$ by selecting the proper observable from the store.
    // (Adjust the selector name to match your store implementation.)
    claim$: Observable<Claim> = this.store.select(ClaimSelectors.claim);
    selectedClaim!: Claim;
    openModal = false;

    claimTypes: { value: string; key: string }[] = [
        { value: this.translate.instant('SimpleClaim'), key: 'SimpleClaim' },
        { value: this.translate.instant('ComplexClaim'), key: 'ComplexClaim' },
        { value: this.translate.instant('ExtrajudicialClaimSustainability'), key: 'ExtrajudicialClaimSustainability' },
        { value: this.translate.instant('MediationArbitration'), key: 'MediationArbitration' }
    ];
    selectedClaimType: string | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private store: Store,
        private osdDataService: OSDDataService,
        private router: Router,
        private osdEventService: OSDService,
        private translate: TranslateService
    ) { }

    onPageChange(event: any) {
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.updateDisplayedItems(startIndex, endIndex);
    }
    updateDisplayedItems(startIndex: number = 0, endIndex: number = 5) {
        this.displayedItems = this.filteredSubscribers.slice(startIndex, endIndex);
    }
    ngOnInit(): void {
        this.osdEventService.GetSubscribers();
        // Subscribe to the selected claim observable.
        // Ensure that the form is only initialized once a claim exists.
        this.claim$.subscribe(claim => {
            if (claim) {
                this.selectedClaim = claim;
                this.initializeForm(claim);
            } else {
                // If no claim was selected, navigate back to the claims list.
                this.router.navigate(['/claims']);
            }
        });

        this.osdDataService.getOsdUsersSubscribersSuccess$.subscribe(osdUsersSubscribers => {
            console.log("All subscribers", osdUsersSubscribers);
            this.subscribers = osdUsersSubscribers.filter(subscriber => {
                const match = subscriber.code.match(/.+\/([^\/]+)\/.+\/.+$/);
                return match && (match[1] === 'CL' || match[1] === 'CFH') && subscriber.can_be_claimed;
            });
            this.applyFilters();
        });
    }

    initializeForm(claim: Claim): void {
        // If your date is an ISO string, format it for an <input type="date">
        const formattedDate = claim.datecreated
            ? this.formatDate(claim.datecreated)
            : '';

        this.editClaimForm = this.formBuilder.group({
            facts: [claim.facts || ''],
            status: [claim.status || ''],
            datecreated: [formattedDate],
            subscriberclaimedid: [claim.subscriberclaimedid || ''],
            subscriberClaimedName: [claim.companyname || ''],
            serviceprovided: [claim.serviceprovided || ''],
            amountclaimed: [claim.amountclaimed || 0],
        });
        this.selectedClaimType = claim.claimtype;
    }

    // Helper: Format an ISO date string to yyyy-MM-dd for input[type="date"]
    formatDate(date: string): string {
        return date ? date.split('T')[0] : '';
    }

    onSubmit(): void {
        if (this.editClaimForm.invalid) {
            this.editClaimForm.markAllAsTouched();
            return;
        }

        // Merge the original claim data with the updated values from the form.
        const updatedClaim = {
            ...this.selectedClaim,
            ...this.editClaimForm.getRawValue()
        };

        // Call the update service method (adjust if necessary).
        this.osdEventService.updateClaim(updatedClaim).subscribe(
            (response: any) => {
                this.store.dispatch(
                    ModalActions.addAlertMessage({ alertMessage: "Success!" })
                );
                this.router.navigate(['/functions/claims-file']);
            },
            (error: any) => {
                console.error('Error updating claim:', error);
            }
        );
    }

    showModal() {
        // Show the modal
        this.openModal = true;
    }

    // Closes the modal
    closeModal() {
        this.openModal = false;
    }

    // Called when user picks a subscriber
    selectSubscriber(id: string, companyName: string) {
        const selectedSubscriber = this.subscribers.find(sub => sub.companyname === companyName);
        if (selectedSubscriber) {
            // Patch your form with the subscriber name (or ID, if you prefer)
            this.editClaimForm.patchValue({
                subscriberclaimedid: selectedSubscriber.Id,
                subscriberClaimedName: selectedSubscriber.companyname
            });
        }
        this.openModal = false;
    }

    // Example: load & filter subscribers
    applyFilters() {
        this.filteredSubscribers = this.subscribers.filter(subscriber => {
            const matchesCountry = this.filterCountry
                ? subscriber.country?.toLowerCase().includes(this.filterCountry.toLowerCase())
                : true;
            const matchesCompanyName = this.filterCompanyName
                ? subscriber.companyname?.toLowerCase().includes(this.filterCompanyName.toLowerCase())
                : true;
            return matchesCountry && matchesCompanyName;
        });
    }
}
