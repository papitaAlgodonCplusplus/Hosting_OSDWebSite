import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ModalActions } from 'src/app/store/actions';
import { ModalSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'shared-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {

  errorMessage$: Observable<string> = this.store.select(ModalSelectors.errorMessage);

  constructor(private store: Store) {}

  toggleErrorModal(): void {
    this.store.dispatch(ModalActions.toggleErrorModal());
    this.store.dispatch(ModalActions.addErrorMessage({errorMessage: ''}));
  }


}
