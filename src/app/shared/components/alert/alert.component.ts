import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ModalActions } from 'src/app/store/actions';
import { ModalSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'shared-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  message$: Observable<string> = this.store.select(ModalSelectors.alertMessage);
  alertOpen$: Observable<boolean> = this.store.select(ModalSelectors.alertOpen);
  alertType$: Observable<string> = this.store.select(ModalSelectors.alertType);
  alertPosition$: Observable<string> = this.store.select(ModalSelectors.alertPosition);

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(ModalActions.addAlertMessage({
      alertMessage:  'Processing...'
    }));
    setTimeout(() => {
      this.toggleSuccessAlert();
    }, 5000);
  }

  toggleSuccessAlert(): void {
    this.store.dispatch(ModalActions.closeAlert());
    this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: '' }));
    this.store.dispatch(ModalActions.changeAlertType({ alertType: 'success' }));
    this.store.dispatch(ModalActions.changeAlertPosition({ alertPosition: 'left' }));
  }

}
