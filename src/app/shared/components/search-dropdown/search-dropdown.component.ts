import { Component, Input, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownItem } from './search-dropdown-models';

@Component({
  selector: 'shared-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.css']
})
export class SearchDropdownComponent implements OnInit {
  @Input() dropdownItems: DropDownItem[] = [];
  @Input() fieldName!: string;
  @Input() formGroup!: FormGroup;
  @Input() bgColor: string = 'bg-white';
  @Input() label!: string;
  @Input() selectedItem: string | undefined;
  @Input() itemUpdate = false;
  isDropdownOpen = false;
  selectedItemLabel: string = '';
  dropdownError = false;
  searchTerm: string = '';
  @ViewChild('myElement', { static: false })
  myElementRef!: ElementRef;
  isDropdownUp = false;
  isDropdownVisible = false;
  filteredDropdownItems: DropDownItem[] = [];
  private previousDropdownItems: DropDownItem[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngDoCheck() {
    if (this.dropdownItems.length != this.previousDropdownItems.length || !this.dropdownItems.every((value, index) => value.value === this.previousDropdownItems[index].value)) {
      this.filteredDropdownItems = this.dropdownItems;
      const selectedDropdownItem = this.dropdownItems.find((item) => item.key === this.formGroup.get(this.fieldName)?.value);
      this.selectedItem = selectedDropdownItem?.value;
      this.selectedItemLabel = this.selectedItem ?? '';
      this.formGroup.get(this.fieldName)?.setValue(selectedDropdownItem?.key);
      this.previousDropdownItems = this.dropdownItems.slice();
      this.changeDetectorRef.detectChanges();
    }
    if (this.itemUpdate) {
      this.filterDropdownItems();
    }
  }

  onInputBlur() {
    setTimeout(() => {
      this.isDropdownOpen = false;

      if (this.selectedItem == null || this.selectedItem == undefined || this.selectedItem == '') {
        this.formGroup.get(this.fieldName)?.setErrors({ required: true });
        this.dropdownError = true;
        this.selectedItemLabel = '';
        this.changeDetectorRef.detectChanges();
      } else {
        this.formGroup.get(this.fieldName)?.setErrors(null);
        this.dropdownError = false;
        this.selectedItemLabel = " " + this.selectedItem + " ";
        this.changeDetectorRef.detectChanges();
      }
    }, 200);
  }

  ngOnInit(): void {
    this.filterDropdownItems();
    this.formGroup.get(this.fieldName)?.valueChanges.subscribe((updateFormValue: string) => {
      if (updateFormValue === undefined) {
        return;
      }
      this.selectedItem = this.dropdownItems.find((item) => item.key === updateFormValue)?.value;
      this.selectedItemLabel = this.selectedItem ?? '';
    });
  }

  filterDropdownItems() {
    this.filteredDropdownItems = this.dropdownItems;
    if (this.selectedItem != '') {
      for (const dropDownItem of this.dropdownItems) {
        if (dropDownItem.value == this.selectedItem) {
          this.formGroup.get(this.fieldName)?.setValue(dropDownItem.key);
          this.selectedItemLabel = dropDownItem.value;
          this.formGroup.get(this.fieldName)?.setErrors(null);
          this.dropdownError = false;
          break;
        }
      }
    }
  }

  toggleDropdown(dropDownItem: DropDownItem | null = null) {
    this.isDropdownVisible = false;

    if (dropDownItem != null)
      this.selectedItem = dropDownItem.value;

    this.formGroup.get(this.fieldName)?.setValue(dropDownItem?.key);
    this.isDropdownOpen = !this.isDropdownOpen;

    if (dropDownItem === null) {
      if (!this.isDropdownOpen && (this.selectedItem == null || this.selectedItem == undefined || this.selectedItem == '')) {
        this.formGroup.get(this.fieldName)?.setErrors({ required: true });
        this.dropdownError = true;
        this.selectedItemLabel = '';
      }
      else {
        this.formGroup.get(this.fieldName)?.setErrors(null);
        this.dropdownError = false;
        this.selectedItemLabel = this.selectedItem ?? '';
      }
    } else {
      this.selectedItemLabel = dropDownItem.value;
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

  onInput(textInputEvent: Event): void {
    this.toggleDropdown();
    this.searchTerm = (textInputEvent.target as HTMLInputElement).value;
    if (this.searchTerm === '') {
      this.filteredDropdownItems = this.dropdownItems;
      this.selectedItem = undefined;
      this.selectedItemLabel = '';
    } else {
      this.filteredDropdownItems = this.dropdownItems.filter((item) => {
        //update selected item if search term is exactly the same as one of the dropdown items
        if (item.value.toLowerCase() === this.searchTerm.toLowerCase()) {
          this.selectedItem = item.value;
          this.selectedItemLabel = item.value;
          this.formGroup.get(this.fieldName)?.setValue(item.key);
          this.formGroup.get(this.fieldName)?.setErrors(null);
          this.dropdownError = false;
        }
        return item.value.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
    this.toggleDropdown();
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

}