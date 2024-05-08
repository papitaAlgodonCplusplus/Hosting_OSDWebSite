import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-selector-registry-claimant',
  templateUrl: './selector-registry-claimant.component.html',
  styleUrls: ['./selector-registry-claimant.component.css']
})
export class SelectorRegistryClaimantComponent implements OnDestroy {

  constructor(private store: Store,
    private router: Router
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
  
  sendValue(valor: boolean) {
    this.router.navigate(['/onboarding/onboarding-register-claimant', valor]);
  }
}
