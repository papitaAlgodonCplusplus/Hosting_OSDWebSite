import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ModalSelectors, UiSelectors } from './store/selectors';
import { SecurityDataService } from './services/security-data.service';
import { TranslateService } from '@ngx-translate/core';
import { RestAPIService } from './services/rest-api.service';
import { EventFactoryService } from './services/event-factory.service';
import { AuthenticationService } from './services/authentication.service';
import { UiActions } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'OSDwebapp';
  showHeader: boolean;
  initialized: boolean;

  hideHeader$: Observable<boolean> = this.store.select(UiSelectors.hideHeader);
  hideFooter$: Observable<boolean> = this.store.select(UiSelectors.hideFooter);
  alertOpen$: Observable<boolean> = this.store.select(ModalSelectors.alertOpen);
  hideLeftSidebar$: Observable<boolean> = this.store.select(UiSelectors.hideLeftSidebar);

  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private restApiService: RestAPIService,
    private securityDataService: SecurityDataService,
    private translate: TranslateService,
    private eventFactoryService: EventFactoryService,
    private authenticationService: AuthenticationService
  ) {
    this.showHeader = false;
    this.initialized = false;
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'es' && lang !== 'en') {
      this.translate.setDefaultLang('es');
    } else {
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    this.initializeApp();
    this.subscriptions.add(
      this.securityDataService.userAuthenticationSuccess$.subscribe((userAuthenticationSuccess: string) => {
        if (userAuthenticationSuccess !== "") {
          this.router.navigate([userAuthenticationSuccess]);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.restApiService.disconnectAPI().subscribe({
      next: (response) => {
        this.initialized = false;
      },
      error: (error) => {
        this.initialized = false;
      }
    });
  }

  private initializeApp(): void {
    if (!this.initialized) {
      this.restApiService.connectAPI().subscribe({
        next: (jsonEventResponse) => {
          const sessionlessKey = jsonEventResponse.SessionKey;
          this.authenticationService.initialize(sessionlessKey);
          this.initialized = true;
        },
        error: (error) => {
          this.initialized = false;
        }
      });
    }
  }
}
