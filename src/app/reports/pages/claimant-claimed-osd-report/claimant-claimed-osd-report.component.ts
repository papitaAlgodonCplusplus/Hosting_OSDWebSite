import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { CountryService } from 'src/app/services/country.service';
import { TransparencyReportsSubscriberClientList } from '../../models/TransparencyReportsSubscriberClient.model';
import { Subscriber } from 'src/app/functions/models/Subscriber';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-claimant-claimed-osd-report',
  templateUrl: './claimant-claimed-osd-report.component.html',
  styleUrls: ['./claimant-claimed-osd-report.component.css']
})
export class ClaimantClaimedOsdReportComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  countries: DropDownItem[] = [];
  selectedCountries?: string;
  subscribers: DropDownItem[] = [];
  selectedSubscribers?: string;
  reports: TransparencyReportsSubscriberClientList[] = [];
  allReports: TransparencyReportsSubscriberClientList[] = [];
  allSubscribers: Subscriber[] = [];

  constructor(
    private translate: TranslateService,
    private store: Store,
    private osdService: OSDService,
    private formBuilder: FormBuilder,
    private osdDataService: OSDDataService,
    private countryService: CountryService
  ) {
    this.filterForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    setTimeout(() => this.store.dispatch(UiActions.showAll()), 0);
  }

  getReportUserNames(): DropDownItem[] {
    return this.reports.map(report => ({ value: report.user_name, key: report.user_name }));
  }

  private initializeData(): void {
    this.store.dispatch(UiActions.hideAll());
    this.osdService.GetTransparencyReportsSubscriberClients();
    this.osdService.GetSubscribers();

    this.loadCountries();
    this.osdDataService.TransparencyReportsSubscriberClientList$
      .subscribe(reports => {
        this.reports = reports;
        this.allReports = reports;
      });

    this.osdDataService.getSubscribersSuccess$
      .subscribe(subscribers => {
        this.allSubscribers = subscribers;
        console.log(subscribers);
        this.subscribers = subscribers.map(subscriber => ({
          value: subscriber.name,
          key: subscriber.name
        }));
      });
  }

  private loadCountries(): void {
    this.countryService.getCountries()
      .pipe(
        map((countries: any[]) => this.mapCountriesToDropdown(countries))
      )
      .subscribe(countries => {
        this.countries = countries;
        this.sortCountries();
      });
  }

  private mapCountriesToDropdown(countries: any[]): DropDownItem[] {
    return countries
      .map(country => this.getCountryDropdownItem(country))
      .filter(item => item !== undefined) as DropDownItem[];
  }

  private getCountryDropdownItem(country: any): DropDownItem | undefined {
    const name = this.translate.currentLang === 'en'
      ? country.name?.common
      : country.translations?.spa?.common;

    return name && country.cca2 ? { value: name, key: country.name.common } : undefined;
  }

  private sortCountries(): void {
    this.countries.sort((a, b) => a.value.localeCompare(b.value));
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      country: [''],
      client: ['']
    });
  }

  filterClients(): void {
    const country = this.filterForm.value.country;

    if (country) {
      this.reports = this.allReports.filter(report => report.Country === country);
      this.subscribers = this.allSubscribers
        .filter(subscriber => subscriber.country === country)
        .map(subscriber => ({ value: subscriber.name, key: subscriber.name }));

      if (this.subscribers.length === 0) {
        this.subscribers = [];
      }
    } else {
      this.reports = this.allReports;
      this.subscribers = [];
      this.subscribers = this.allSubscribers
        .map(subscriber => ({ value: subscriber.name, key: subscriber.name }));
    }
  }

  selectClientReports(): void {
    const client = this.filterForm.value.client;
    const country = this.filterForm.value.country;

    let filteredReports = this.allReports;

    if (country) {
      filteredReports = filteredReports.filter(report => report.Country === country);
    }

    if (client) {
      filteredReports = filteredReports.filter(report => report.user_name === client);
    }

    this.reports = filteredReports;
  }


  generateStarRating(rating: number): string {
    const fullStar = '<i class="fa-solid fa-star text-darkslategray"></i>';
    const regularStar = '<i class="fa-regular fa-star text-darkslategray"></i>';
    return fullStar.repeat(rating) + regularStar.repeat(5 - rating);
  }
}
