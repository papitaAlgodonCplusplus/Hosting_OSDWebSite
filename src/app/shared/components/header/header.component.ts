import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { UiSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  imgProfile = "/./assets/img/profile.png";
  open = false;

  constructor() {}
  
  toggleDropdown() {
    this.open = !this.open;
  }
}
