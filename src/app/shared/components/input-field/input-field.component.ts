import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidationsService } from 'src/app/services/validations.service';

@Component({
  selector: 'shared-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent {
  @Input() fieldName!: string;
  @Input() label!: string;
  @Input() inputType: 'text' | 'email' | 'number' | 'file' | 'date' | 'time' |'tel' = 'text';
  @Input() formGroup!: FormGroup;
  @Input() bgColor: string = 'bg-white';
  @Input() readOnly!: boolean;
  @Output() blurEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() inputChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private validationsService: ValidationsService
  ) {}

  onInputChange() {
    this.inputChange.emit()
  }

  isValidField(field: string): boolean | null {
    return this.validationsService.isValidField(this.formGroup, field);
  }

  getFieldError(field: string): string | null {
    return this.validationsService.getFieldError(this.formGroup, field);
  }

}
