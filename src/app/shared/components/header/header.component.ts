import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthSelectors } from 'src/app/store/selectors';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserInfo } from 'src/app/models/userInfo';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imgProfile = "/./assets/img/profile.png";
  open = false;
  userInfo: UserInfo | null = null;
  constructor(private router: Router, private store: Store,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.userInfo = this.authService.userInfo;
    }, 0)
  }

  toggleDropdown() {
    this.open = !this.open;
  }

  onClick() {
    this.router.navigateByUrl('auth/login');
    this.authService.endSession();
  }
}
