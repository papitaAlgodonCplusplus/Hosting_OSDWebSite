import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserInfo } from 'src/app/models/userInfo';

@Component({
  selector: 'shared-authorized-modal',
  templateUrl: './authorized-modal.component.html',
  styleUrls: ['./authorized-modal.component.css']
})
export class AuthorizedModalComponent {
  @Input() showModal!: boolean;
  @Input() message: string = '';
  @Input() isAuthorized! : boolean;
  @Input() personalDataObject!: UserInfo;
  @Input() accountDataObject!: any;
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

  personalAccountDataAttributes(): string[] {
    return Object.keys(this.personalDataObject);
  }

  personalAccountValueForAttribute(attr: string): string | undefined {
    return this.personalDataObject[attr as keyof UserInfo];
  }

  professionalAccountDataAttributes(): string[] {
    return Object.keys(this.accountDataObject);
  }

  professionalAccountValueForAttribute(attr: string): string | undefined {
    return this.accountDataObject[attr];
  }
}
