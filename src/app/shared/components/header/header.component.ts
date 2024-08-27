import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AuthSelectors } from 'src/app/store/selectors';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserInfo } from 'src/app/models/userInfo';
import { UiActions } from 'src/app/store/actions';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imgProfile = "/./assets/img/profile.png";
  open = false;
  isUser: boolean = false;
  userInfo!: UserInfo;
  isUserSignIn$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);
  constructor(private router: Router, private store: Store,
    private authService: AuthService,
    private authLogic: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isUserSignIn$.subscribe(state => {
        this.isUser = state
      })

      if (this.isUser && this.authLogic.userInfo) {
        this.userInfo = this.authLogic.userInfo
      }
    }, 0);
  }

  toggleDropdown() {
    this.open = !this.open;
  }

  onClick() {
    this.router.navigateByUrl('auth/login');
    this.authLogic.endSession();
    this.isUser = false
  }
}
