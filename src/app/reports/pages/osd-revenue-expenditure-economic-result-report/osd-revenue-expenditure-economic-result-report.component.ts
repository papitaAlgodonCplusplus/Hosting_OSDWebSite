import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { ModalActions, UiActions } from 'src/app/store/actions';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { CountryService } from 'src/app/services/country.service';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { TransparencyIncomeExpenses } from '../../models/TransparencyIncomeExpenses.interface';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { Subscriber } from 'src/app/functions/models/Subscriber';
import { count } from 'console';

@Component({
  selector: 'app-osd-revenue-expenditure-economic-result-report',
  templateUrl: './osd-revenue-expenditure-economic-result-report.component.html',
  styleUrls: ['./osd-revenue-expenditure-economic-result-report.component.css']
})
export class OSDRevenueExpenditureEconomicResultReportComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;

  // This is the aggregator we display in the table
  transparencyIncomeExpenses!: TransparencyIncomeExpenses;

  expenses: number = 0.00;

  // For dropdowns
  countries: DropDownItem[] = [];
  subscribers: DropDownItem[] = [];
  allSubscribers: Subscriber[] = [];
  allSubscribersDropdown: DropDownItem[] = [];
  allIncomeExpensesData: Array<{
    subscriber: Subscriber;
    report: TransparencyIncomeExpenses;
  }> = [];

  countriesBackup: DropDownItem[] = [];
  allSubscribersDropdownBackup: DropDownItem[] = [];

  constructor(
    private store: Store,
    private osdService: OSDService,
    private osdDataService: OSDDataService,
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    private translate: TranslateService,
    private cf: ChangeDetectorRef
  ) {
    this.filterForm = this.createForm();
  }

  ngOnInit(): void {
    this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Loading data... (Takes about 5 seconds)'}));
    this.store.dispatch(UiActions.showAll());
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());

      // 1) Load Countries
      this.loadCountries();
      this.osdService.GetTransparencyReportsIncomeExpenses("", "")

      // 2) Fetch the full list of subscribers once
      this.osdService.GetSubscribers();
      const uniqueReports = new Set();
      this.osdDataService.getSubscribersSuccess$.subscribe(items => {
        const uniqueSubscribers = new Set();
        console.log("Subscribers:", items);
        items.forEach(subscriber => {
          if (!uniqueSubscribers.has(subscriber.companyname) && subscriber.userid) {
            this.osdService.GetTransparencyReportsIncomeExpenses(subscriber.userid, "").subscribe(report => {
              const dto: TransparencyIncomeExpenses = report?.Body?.economicResultReportDTO || {
                Income: 0,
                ImprovementSavings: 0,
                ClaimsAmount: 0,
                CompensationClaimant: 0,
                Numberfiles: 0
              };

              if (dto.Numberfiles === 0) {
                return;
              }

              var itemDropdown: DropDownItem = { value: subscriber.companyname, key: subscriber.companyname };
              this.subscribers.push(itemDropdown);
              this.allSubscribers.push(subscriber);
              const extendedItemDropdown = { ...itemDropdown, country: subscriber.country };
              this.allSubscribersDropdown.push(extendedItemDropdown);
              uniqueSubscribers.add(subscriber.companyname);
              this.allIncomeExpensesData.push({
                subscriber,
                report: dto
              });
              this.transparencyIncomeExpenses = {
                Income: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.Income, 0),
                ImprovementSavings: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.ImprovementSavings, 0),
                ClaimsAmount: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.ClaimsAmount, 0),
                CompensationClaimant: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.CompensationClaimant, 0),
                Numberfiles: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.Numberfiles, 0),
                Expenses: this.allIncomeExpensesData.reduce((sum, item) => sum + (item.report.Expenses || 0), 0),
                Amountpaid: this.allIncomeExpensesData.reduce((sum, item) => sum + (item.report.Amountpaid || 0), 0),
              };
            });
          }
        });
      });
    }, 2000);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  // ========== FORM & DROPDOWN ==========

  createForm(): FormGroup {
    return this.formBuilder.group({
      country: [''],
      client: ['']
    });
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe((data: any[]) => {
      let countriesList: DropDownItem[];

      if (this.translate.currentLang === 'en') {
        countriesList = data
          .map(country => {
            if (country.name?.common && country.cca2) {
              return { value: country.name.common, key: country.name.common } as DropDownItem;
            }
            return undefined;
          })
          .filter(item => item !== undefined) as DropDownItem[];
      } else {
        // Spanish or fallback
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
          .filter(item => item !== undefined) as DropDownItem[];
      }

      // Sort
      countriesList.sort((a, b) => a.value.localeCompare(b.value));
      this.countries = countriesList;
    });
  }

  // ========== FILTERING LOCALLY ==========
  filterOptions(): void {
    const country = this.filterForm.value.country;
    const client = this.filterForm.value.client;

    this.countriesBackup = this.countries;
    this.allSubscribersDropdownBackup = this.allSubscribersDropdown;
    if (country) {
      this.allSubscribersDropdown = this.allSubscribersDropdown.filter(s => s.country === country);
    }
    if (client) {
      this.countries = this.countries.filter(c => c.key === this.allSubscribers.find(s => s.companyname === client)?.country);
    }
  }

  filterReport(): void {
    const country = this.filterForm.value.country;
    const client = this.filterForm.value.client;
    console.log("Filter values:", { country, client });
    console.log("All Income Expenses Data:", this.allIncomeExpensesData);
    console.log("🎯 Local Filter: ", this.filterForm.value);

    console.log("🎯 Local Filter => Country:", country, " Client:", client);

    // 1) Start with the entire set
    let subset: Array<{ subscriber: Subscriber; report: TransparencyIncomeExpenses }> = [];

    // 2) If a country is selected, filter by that
    if (country) {
      subset = this.allIncomeExpensesData.filter(item => item.subscriber.country.trim().toLowerCase() === country.trim().toLowerCase());
      console.log("🎯 Local Filter => Country:", country, " Subset:", subset);
    } else if (client) {
      subset = this.allIncomeExpensesData.filter(item => item.subscriber.companyname.trim().toLowerCase() === client.trim().toLowerCase());
      console.log("🎯 Local Filter => Client:", client, " Subset:", subset);
    }

    this.transparencyIncomeExpenses = subset.length > 0 ? {
      Income: subset.reduce((sum, item) => sum + item.report.Income, 0),
      ImprovementSavings: subset.reduce((sum, item) => sum + item.report.ImprovementSavings, 0),
      ClaimsAmount: subset.reduce((sum, item) => sum + item.report.ClaimsAmount, 0),
      CompensationClaimant: subset.reduce((sum, item) => sum + item.report.CompensationClaimant, 0),
      Numberfiles: subset.reduce((sum, item) => sum + item.report.Numberfiles, 0),
      Expenses: subset.reduce((sum, item) => sum + (item.report.Expenses || 0), 0),
      Amountpaid: subset.reduce((sum, item) => sum + (item.report.Amountpaid || 0), 0),
    } : {
      Income: 0,
      ImprovementSavings: 0,
      ClaimsAmount: 0,
      CompensationClaimant: 0,
      Numberfiles: 0,
      Expenses: 0,
      Amountpaid: 0,
    };
  }

  handleChange(event: any): void {
  }

  filterClients(): void {
    // If you want your "Clients" dropdown to reduce based on selected country:
    const country = this.filterForm.value.country;
    if (!country) {
      return;
    }
    // Only show subscribers from that country
    const filteredSubs = this.allSubscribers.filter(s => s.country === country);
    const filteredSubsDropdown = this.allSubscribersDropdown.filter(s => s.key === country);
    this.subscribers = filteredSubs.map(s => ({
      value: s.companyname,
      key: s.companyname
    }));
    this.allSubscribersDropdown = filteredSubsDropdown;
  }

  deleteFilter(): void {
    setTimeout(() => {
      // Clear the form
      this.countries = this.countriesBackup;
      this.allSubscribersDropdown = this.allSubscribersDropdownBackup;
      console.log("🎯 Clear Filter => Countries:", this.countries, " Subscribers:", this.allSubscribersDropdown);
      this.filterForm.reset({
      country: [''],
      client: ['']
      });
      this.transparencyIncomeExpenses = {
      Income: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.Income, 0),
      ImprovementSavings: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.ImprovementSavings, 0),
      ClaimsAmount: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.ClaimsAmount, 0),
      CompensationClaimant: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.CompensationClaimant, 0),
      Numberfiles: this.allIncomeExpensesData.reduce((sum, item) => sum + item.report.Numberfiles, 0),
      Expenses: this.allIncomeExpensesData.reduce((sum, item) => sum + (item.report.Expenses || 0), 0),
      Amountpaid: this.allIncomeExpensesData.reduce((sum, item) => sum + (item.report.Amountpaid || 0), 0),
      };
    }, 500);
    this.cf.detectChanges();
  }


  // ========== OTHER ==========

  calculateExpenses(): void {
    const inc = this.transparencyIncomeExpenses?.Income || 0;
    this.expenses = inc * 0.4 + inc * 0.1 + inc * 0.1;
  }

  compareFn(c1: DropDownItem, c2: DropDownItem): boolean {
    return c1 && c2 ? c1.key === c2.key : c1 === c2;
  }

}
