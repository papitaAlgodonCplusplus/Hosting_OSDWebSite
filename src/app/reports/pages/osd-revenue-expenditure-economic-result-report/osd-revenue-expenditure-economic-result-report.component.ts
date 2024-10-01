import { Component } from '@angular/core';
import { OSDRevenueExpenditureEconomicResultReportItems } from '../../interface/OSDRevenueExpenditureEconomicResultReportItems.interface';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { TransparencyIncomeExpenses } from '../../models/TransparencyIncomeExpenses.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { CountryService } from 'src/app/services/country.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-osd-revenue-expenditure-economic-result-report',
  templateUrl: './osd-revenue-expenditure-economic-result-report.component.html',
  styleUrls: ['./osd-revenue-expenditure-economic-result-report.component.css']
})
export class OSDRevenueExpenditureEconomicResultReportComponent {
  filterForm : FormGroup;
  transparencyIncomeExpenses!: TransparencyIncomeExpenses
  expenses: number = 0.00;
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;
  subscribers: DropDownItem[] = [];
  selectedSubscribers: string | undefined;

  constructor(
    private store : Store,
    private osdService :OSDService,
    private osdDataService: OSDDataService,
    private formBuilder : FormBuilder,
    private countryService: CountryService,
    private translate: TranslateService
  ) {this.filterForm = this.createForm() }

  ngOnInit(): void{
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.osdService.GetTransparencyReportsIncomeExpenses();
      this.osdService.GetSubscribers();

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
        this.countries.sort((a, b) => a.value.localeCompare(b.value));
      });
    }, 0);

    this.osdDataService.TotalOsdIncomeExpenses$.subscribe(item => {
      console.log(item)
      this.transparencyIncomeExpenses = item

      this.calculateExpenses();
    })

    this.osdDataService.getSubscribersSuccess$.subscribe(item =>{
      item.forEach(subscriber => {
        var itemDropdown : DropDownItem = {value: subscriber.companyName, key: subscriber.id};
        this.subscribers.push(itemDropdown)
      });
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  calculateExpenses(){
   this.expenses = this.transparencyIncomeExpenses.Income * 0.4 + this.transparencyIncomeExpenses.Income * 0.1 + this.transparencyIncomeExpenses.Income * 0.1;
  }

  createForm(): FormGroup{
    const form = this.formBuilder.group({
      country: [''],
      client: ['']
    });
    return form;
  }
}
