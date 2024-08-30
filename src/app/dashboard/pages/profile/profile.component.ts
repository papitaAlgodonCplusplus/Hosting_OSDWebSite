import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/models/userInfo';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userInfo!: UserInfo

  constructor(private store: Store,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authService.userInfo) {
        this.userInfo = this.authService.userInfo
      }

      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(UiActions.hideLeftSidebar());
    }, 0);
  }

}
