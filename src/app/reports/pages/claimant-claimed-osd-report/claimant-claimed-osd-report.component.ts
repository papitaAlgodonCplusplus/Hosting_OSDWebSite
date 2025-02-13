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
    setTimeout(() => this.initializeData(), 200);
  }

  ngOnDestroy(): void {
    setTimeout(() => this.store.dispatch(UiActions.showAll()), 0);
  }

  getReportUserNames(): DropDownItem[] {
    const uniqueClients = new Set<string>();
    return this.reports
      .filter(report => {
        if (uniqueClients.has(report.user_companyname)) {
          return false;
        } else {
          uniqueClients.add(report.user_companyname);
          return true;
        }
      })
      .map(report => ({ value: report.user_companyname, key: report.user_companyname }));
  }

  private initializeData(): void {
    this.store.dispatch(UiActions.hideAll());
    this.osdService.GetTransparencyReportsSubscriberClients();
    this.osdService.GetSubscribers();

    this.loadCountries();
    this.osdDataService.TransparencyReportsSubscriberClientList$
      .subscribe(reports => {
        console.log(reports);
        this.reports = reports;
        this.allReports = reports;
      });

    this.osdDataService.getSubscribersSuccess$
      .subscribe(subscribers => {
        console.log(subscribers);
        this.allSubscribers = subscribers;
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
        console.log(countries);
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
    const client = this.filterForm.value.client;

    this.reports = this.allReports.filter(report => {
      const matchesCountry = country ? report.user_country === country : true;
      const matchesClient = client ? report.user_companyname === client : true;
      return matchesCountry && matchesClient;
    });
  }

  generateStarRating(rating: number): string {
    const fullStar = '<i class="fa-solid fa-star text-darkslategray"></i>';
    const regularStar = '<i class="fa-regular fa-star text-darkslategray"></i>';
    return fullStar.repeat(rating) + regularStar.repeat(5 - rating);
  }
}
