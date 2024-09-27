import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiActions } from 'src/app/store/actions';
import { UiSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'shared-confirmation-button',
  templateUrl: './confirmation-button.component.html',
  styleUrls: ['./confirmation-button.component.css']
})
export class ConfirmationButtonComponent {
  @Input() ButtonName!: string;
  @Input() Disabled!: boolean;
  buttonStateObservable$ : Observable<boolean> = this.store.select(UiSelectors.toggleConfirmationButton);
  buttonState! : boolean;

  constructor(private store: Store) { }
}
