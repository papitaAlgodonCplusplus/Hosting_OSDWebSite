import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiActions } from 'src/app/store/actions';
import { UiSelectors } from 'src/app/store/selectors';


@Component({
  selector: 'shared-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor() {}
}
