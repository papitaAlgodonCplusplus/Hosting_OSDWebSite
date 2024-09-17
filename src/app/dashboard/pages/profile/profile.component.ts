import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userInfo!: UserInfo;
  showModal = false;
  formModifyInformation: FormGroup;
  selectedCountries: string | undefined;
  countries: DropDownItem[] = [];

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private osdEventService: OSDService,
    private store: Store,
    private translate: TranslateService,
    private countryService: CountryService
  ) {
    this.formModifyInformation = this.createModifyForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.countryService.getCountries().subscribe((data: any[]) => {
        let countriesList;
        if (this.translate.currentLang === "en") {
          countriesList = data
            .map(country => {
              if (country.name?.common && country.cca2) {
                return {
                  value: country.name.common, 
                  key: country.name.common          
                } as DropDownItem;
              }
              return undefined;
            })
            .filter(country => country !== undefined) 
            .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
        }
        else if (this.translate.currentLang === "es") {
          countriesList = data
            .filter(country => country.translations?.spa)
            .map(country => {
              if (country.translations?.spa?.common && country.cca2) {
                return {
                  value: country.translations.spa.common, 
                  key: country.name.common                    
                } as DropDownItem;
              }
              return undefined;
            })
            .filter(country => country !== undefined)
            .sort((a, b) => (a && b) ? a.value.localeCompare(b.value) : 0);
        }
        this.countries = countriesList as DropDownItem[];
      });
      
      if (this.authService.userInfo) {
        this.userInfo = this.authService.userInfo;
        this.setFormValues();
      }
      // Dispatch store actions if needed
    }, 0);
  }

  createModifyForm(): FormGroup {
    return this.fb.group({
      Name: ['',Validators.required],
      Firstname: ['',Validators.required],
      Middlesurname: ['',Validators.required],
      Country: ['',Validators.required],
      Email: ['',Validators.email]
    });
  }

  setFormValues() {
    this.formModifyInformation.patchValue({
      Name: this.userInfo.Name,
      Firstname: this.userInfo.Firstname,
      Middlesurname: this.userInfo.Middlesurname,
      Country: this.userInfo.Country,
      Email: this.userInfo.Email
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.formModifyInformation.invalid) {
      this.formModifyInformation.markAllAsTouched();
      return;
    }

    this.osdEventService.ModifyUserInformation(this.formModifyInformation.value);
    this.closeModal();
  }
}
