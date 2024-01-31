import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ModalSelectors, UiSelectors } from './store/selectors';
import { WebsocketService } from './services/websocket.service';
import { SecurityDataService } from './services/security-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'OSDwebapp';
  showHeader: boolean;
  initialized: boolean;

  // Select and observe the 'hideHeader' property from the store's UI state.
  hideHeader$: Observable<boolean> = this.store.select(UiSelectors.hideHeader);
  // Select and observe the 'hideFooter' property from the store's UI state.
  hideFooter$: Observable<boolean> = this.store.select(UiSelectors.hideFooter);
  alertOpen$: Observable<boolean> = this.store.select(ModalSelectors.alertOpen);
  hideLeftSidebar$: Observable<boolean> = this.store.select(UiSelectors.hideLeftSidebar);
  
  constructor(private store: Store,
    private router: Router,
    public websocketService: WebsocketService,
    private securityDataService: SecurityDataService) {
    this.showHeader = false;
    this.initialized = false;
  }

  ngOnInit() {
    if (!this.initialized) {
      this.websocketService.startConnection(); //OJO: puede que se llame varias veces
      this.initialized = true;
    }
    this.securityDataService.userAuthenticationSuccess$.subscribe((userAuthenticationSuccess: string) => {
      if(userAuthenticationSuccess !== ""){
        this.router.navigate([userAuthenticationSuccess]);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

}
