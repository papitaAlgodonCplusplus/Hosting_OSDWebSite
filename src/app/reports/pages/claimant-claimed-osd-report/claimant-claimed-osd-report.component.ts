import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { claimantClaimedOsdReportItems } from '../../interface/claimantClaimedOsdReportItems.interface copy';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { CountryService } from 'src/app/services/country.service';
import { TransparencyReportsSubscriberClientList } from '../../models/TransparencyReportsSubscriberClient.model';
import { Subscriber } from 'src/app/functions/models/Subscriber';


@Component({
  selector: 'app-claimant-claimed-osd-report',
  templateUrl: './claimant-claimed-osd-report.component.html',
  styleUrls: ['./claimant-claimed-osd-report.component.css']
})
export class ClaimantClaimedOsdReportComponent implements OnDestroy {
  filterForm: FormGroup;
  countries: DropDownItem[] = [];
  selectedCountries: string | undefined;
  subscribers: DropDownItem[] = [];
  selectedSubscribers: string | undefined;
  reports!: TransparencyReportsSubscriberClientList[]
  allReports!: TransparencyReportsSubscriberClientList[];
  allSubscribers: Subscriber[] = [];

  constructor(
    private translate: TranslateService,
    private store: Store,
    private osdService: OSDService,
    private formBuilder: FormBuilder,
    private osdDataService: OSDDataService,
    private countryService: CountryService,
  ) { this.filterForm = this.createForm() }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.osdService.GetTransparencyReportsSubscriberClients();
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

    this.osdDataService.TransparencyReportsSubscriberClientList$.subscribe(item => {
      this.reports = item;
      this.allReports = item;
    })

    this.osdDataService.getSubscribersSuccess$.subscribe(items => {
      this.allSubscribers = items;
      items.forEach(subscriber => {
        var itemDropdown: DropDownItem = { value: subscriber.companyName, key: subscriber.companyName };
        this.subscribers.push(itemDropdown)
      })
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  generateStarRating(rating: number): string {
    let starsHTML = '';
    const fullStar = '<i class="fa-solid fa-star text-darkslategray"></i>';
    const regularStar = '<i class="fa-regular fa-star text-darkslategray"></i>';

    for (let i = 0; i < rating; i++) {
      starsHTML += fullStar;
    }

    for (let i = rating; i < 5; i++) {
      starsHTML += regularStar;
    }

    return starsHTML;
  }

  createForm(): FormGroup {
    const form = this.formBuilder.group({
      country: [''],
      client: ['']
    });
    return form;
  }

  filterClients() {
    var country = this.filterForm.value.country
    var foundClients = 0;

    if (country != undefined) {
      console.log(country)
      this.allSubscribers.forEach(reports => {
        if (reports.country == country) {
          foundClients++;
          var itemDropdown: DropDownItem = { value: reports.companyName, key: reports.companyName };
          this.subscribers.push(itemDropdown)
        }
      })
    }

    if (foundClients <= 0) {
      this.subscribers = [];
    }
  }

  selectClientReports() {
    if (this.filterForm.value.client != undefined) {
      var filterReport = this.reports.filter(report => report.InstitutionsNames == this.filterForm.value.client)
      if (filterReport) {
        this.reports = filterReport;
      }
    }
    else {
      this.reports = this.allReports;
    }
  }
}
