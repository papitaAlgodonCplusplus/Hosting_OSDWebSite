import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'summary-type-modal',
  templateUrl: './summary-type-modal.component.html',
  styleUrls: ['./summary-type-modal.component.css']
})
export class SummaryTypeModalComponent {

  @Output() close = new EventEmitter<void>();
  name: string = '';
  isNameInvalid: boolean = false;
  selectedType: string;
  types: DropDownItem[] = [
    { key: 'PerformanceBuy', value: 'Performance Buy' },
    { key: 'PerformanceFP', value: 'Performance Free Professional' }
  ];

  constructor(private osdService: OSDService,
    private store : Store
  ) {
    this.selectedType = this.types[0].key;
  }

  closeModal() {
    this.close.emit();
  }

  save() {
    if (!this.name.trim()) {
      this.isNameInvalid = true;
    }
    else{
      this.store.dispatch(UiActions.toggleConfirmationButton())
      this.osdService.addSummaryType(this.name, this.selectedType);
      this.closeModal();  
    }
  }
}
