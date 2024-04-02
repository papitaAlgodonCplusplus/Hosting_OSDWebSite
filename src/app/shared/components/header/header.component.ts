import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { UiSelectors } from 'src/app/store/selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  imgProfile = "/./assets/img/profile.png";
  open = false;

  constructor(private router: Router) {}
  
  toggleDropdown() {
    this.open = !this.open;
  }
  onClick(){
    this.router.navigateByUrl('auth/login').then(()=> {
      window.location.reload()
    })
  }
}
