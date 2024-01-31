import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidationsService } from 'src/app/services/validations.service';


@Component({
  selector: 'shared-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent {
  @Input() fieldName!: string;
  @Input() label!: string;
  @Input() inputType: 'text' | 'email' | 'number' | 'tel' = 'text';
  @Input() formGroup!: FormGroup;
  @Input() bgColor: string = 'bg-white';

  constructor(
    private validationsService: ValidationsService
  ) {}

  isValidField(field: string): boolean | null {
    return this.validationsService.isValidField(this.formGroup, field);
  }

  getFieldError(field: string): string | null {
    return this.validationsService.getFieldError(this.formGroup, field);
  }


}
