import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { ValidationsService } from 'src/app/services/validations.service';

@Component({
  selector: 'shared-simple-dropdown',
  templateUrl: './simple-dropdown.component.html',
  styleUrls: ['./simple-dropdown.component.css']
})
export class SimpleDropdownComponent {
  @Input() dropdownItems: DropDownItem[] = [];
  oldDropdownItems!: DropDownItem[];
  @Input() fieldName!: string;
  @Input() formGroup!: FormGroup;
  @Input() bgColor: string = 'bg-white';
  @Input() label!: string;
  @Input() selectedItem: string | undefined;
  @Input() readOnly: boolean = false;
  isDropdownOpen = false;
  dropdownError = false;
  @ViewChild('myElement', { static: false })
  myElementRef!: ElementRef;
  isDropdownUp = false;
  isDropdownVisible = false;
  private previousDropdownItems: DropDownItem[] = [];
  @Output() change = new EventEmitter<void>();
  
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private validationsService: ValidationsService) {}

  ngDoCheck() {
    if (this.dropdownItems !== this.previousDropdownItems) {
      this.selectedItem = this.dropdownItems.find((item) => item.key === this.formGroup.get(this.fieldName)?.value)?.value;
      this.previousDropdownItems = this.dropdownItems.slice(); // Make a copy for comparison
      this.changeDetectorRef.detectChanges(); // This is needed to update the view
    }
  }

  toggleDropdown(item: DropDownItem | null = null) {
    this.isDropdownVisible = false;
    this.selectedItem = item?.value;
    this.formGroup.get(this.fieldName)?.setValue(item?.key);
    this.isDropdownOpen = !this.isDropdownOpen;
  
    if (item) {
      this.change.emit(); // Emitir el cambio
    }
  
    if (item === null) {
      this.formGroup.get(this.fieldName)?.setErrors({ required: true });
      this.dropdownError = true;
    } else {
      this.formGroup.get(this.fieldName)?.setErrors(null);
      this.dropdownError = false;
    }
  
    setTimeout(() => {
      if (this.isDropdownOpen) {
        this.setDropdownPosition();
        this.isDropdownVisible = true;
      } else {
        this.isDropdownUp = false;
        this.isDropdownVisible = true;
      }
    });
  }

  private setDropdownPosition() {
    if (this.isDropdownOpen && this.myElementRef) {
      const dropdownRect = this.myElementRef.nativeElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (dropdownRect.bottom > windowHeight) {
        this.isDropdownUp = true;
      } else {
        this.isDropdownUp = false;
      }
    }
  }

  isValidField(field: string): boolean | null {
    return this.validationsService.isValidField(this.formGroup, field);
  }

  getFieldError(field: string): string | null {
    return this.validationsService.getFieldError(this.formGroup, field);
  }

  filter(event: Event) {
    if (!this.oldDropdownItems) {
      this.oldDropdownItems = this.dropdownItems;
    }

    const input = event.target as HTMLInputElement;
    const inputValue = input.value.toLowerCase();

    if (inputValue === '') {
      this.dropdownItems = this.oldDropdownItems;
    } else {

      var filteredItems: DropDownItem[] = this.oldDropdownItems.filter(item =>
        item.value.toLowerCase().includes(inputValue)
      );

      this.dropdownItems = filteredItems;
    }
  }

}