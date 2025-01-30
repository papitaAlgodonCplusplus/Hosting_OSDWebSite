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
  isUser: boolean = false;
  userInfo!: UserInfo;
  isUserSignIn$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);
  constructor(private router: Router, private store: Store,
    private authService: AuthService,
    private authLogic: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(UiActions.showAll())
    setTimeout(() => {
      this.isUserSignIn$.subscribe(state => {
        this.isUser = state
      })

      if (this.isUser && this.authLogic.userInfo) {
        this.userInfo = this.authLogic.userInfo
      }
    }, 0);
  }

  onClick() {
    this.router.navigateByUrl('/auth');
    this.authLogic.endSession();
    this.isUser = false
  }
}
