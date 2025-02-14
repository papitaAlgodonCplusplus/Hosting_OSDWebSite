import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  @Input() showModal!: boolean;
  @Input() message: string = '';
  @Input() messageType: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.showModal = false;
  }

  onCancel() {
    this.cancel.emit();
    this.showModal = false;
  }
}
