import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'shared-time-input-component',
  templateUrl: './time-input-component.component.html',
  styleUrls: ['./time-input-component.component.css']
})
export class TimeInputComponentComponent {
  @Input() formGroup!: FormGroup;
  @Input() fieldName!: string;
  @Input() readOnly!: boolean;
  @Input() label!: string;

  formatTimeInput(value: string): string {
    let [hoursPart, minutesPart] = value.split(':');

    if (!minutesPart) {
      minutesPart = '00';
    }

    minutesPart = minutesPart.slice(0, 2);

    let hours = parseInt(hoursPart) || 0;
    let minutes = parseInt(minutesPart) || 0;

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  onTimeInputBlur(): void {
    const control = this.formGroup.get(this.fieldName);
    if (control?.value) {
      const formattedValue = this.formatTimeInput(control.value);
      control.setValue(formattedValue, { emitEvent: false });
    }
  }
}
