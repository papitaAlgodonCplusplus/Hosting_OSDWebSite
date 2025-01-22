import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ModalSelectors, UiSelectors } from './store/selectors';
import { SecurityDataService } from './services/security-data.service';
import { TranslateService } from '@ngx-translate/core';
import { RestAPIService } from './services/rest-api.service';
import { AuthenticationService } from './services/authentication.service';
import { UiActions } from './store/actions';
import { LoggingService } from './logger/LoggingService';

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
  buttonStateObservable$: Observable<boolean> = this.store.select(UiSelectors.toggleConfirmationButton);
  confirmationButtonState!: boolean;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private restApiService: RestAPIService,
    private securityDataService: SecurityDataService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private loggingService: LoggingService
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
    this.buttonStateObservable$.subscribe(buttonState => {
      this.confirmationButtonState = buttonState;
    });

    if (this.confirmationButtonState == true) {
      this.store.dispatch(UiActions.toggleConfirmationButton());
    }

    // Log page load
    this.initializeApp();
    const userId = this.authenticationService.userInfo?.Id ?? '';
    const additionalInfo = { 'pageLoadTime': new Date().toLocaleString() };
    this.loggingService.logAction(userId, 'Page Load', window.location.href);
    this.subscriptions.add(
      this.securityDataService.userAuthenticationSuccess$.subscribe((userAuthenticationSuccess: string) => {
        if (userAuthenticationSuccess !== "") {
          const userId = this.authenticationService.userInfo?.Id ?? '';
          this.loggingService.logAction(userId, 'Page Navigation', userAuthenticationSuccess);
        }
      })
    );

    // Log button clicks globally
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementClicked = target.textContent?.trim() || target.tagName;
      const userId = this.authenticationService.userInfo?.Id ?? '';
      this.loggingService.logAction(userId, 'Element Clicked', window.location.href, elementClicked, additionalInfo);
    });
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
      if(!this.initialized) {
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
