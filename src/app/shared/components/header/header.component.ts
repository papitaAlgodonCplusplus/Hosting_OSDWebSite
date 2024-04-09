import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthSelectors } from 'src/app/store/selectors';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserInfo } from 'src/app/models/userInfo';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imgProfile = "/./assets/img/profile.png";
  open = false;
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  showButton: boolean = false;
  userInfo: UserInfo | null = null;
  constructor(private router: Router, private store: Store,
    private authDataService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated === true) {
          this.showButton = true
        }
      });
      this.userInfo = this.authDataService.userInfo;
    }, 0)
  }

  toggleDropdown() {
    this.open = !this.open;
  }

  onClick() {
    this.router.navigateByUrl('auth/login').then(() => {
      window.location.reload()
    })
  }
}
