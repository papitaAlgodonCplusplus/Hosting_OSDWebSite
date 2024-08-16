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

  onTimeInput(event: Event) {
    if (this.inputType === 'time') {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');  
        
        if (value.length >= 3) {
            value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
        }

        const [hours, minutes] = value.split(':').map(Number);

        if ((hours > 23 || hours < 0) || (minutes > 59 || minutes < 0)) {
            value = '';
        }

        input.value = value;
        this.formGroup.get(this.fieldName)?.setValue(value, { emitEvent: true });
    }
  }

  onClickEvent() {
      if (this.inputType === 'time') {
          this.formGroup.get(this.fieldName)?.setValue('', { emitEvent: true });
      }
  }
}
