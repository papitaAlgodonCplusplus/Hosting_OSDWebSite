import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthSelectors } from 'src/app/store/selectors';
import { Router } from '@angular/router';
import { UiActions } from 'src/app/store/actions';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isUser: boolean = false;
  imgLogo = '';
  imgStyle = {}; // Object for your inline styles

  isUserSignIn$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);

  constructor(
    private router: Router,
    private store: Store,
    private authLogic: AuthenticationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UiActions.showAll());
    
    setTimeout(() => {
      // Check if user is logged in
      this.isUserSignIn$.subscribe((state: boolean) => {
        this.isUser = state;
      });

      // Set the logo source and style depending on language
      if (this.translate.currentLang === 'en') {
        // If English -> OSD_3.png (80px max height)
        this.imgLogo = '/assets/img/OSD_3.png';
        this.imgStyle = { 'max-height': '80px', width: 'auto' };
      } else {
        // If not English -> OSD_2.png (50px max height)
        this.imgLogo = '/assets/img/OSD_2.png';
        this.imgStyle = { 'max-height': '50px', width: 'auto' };
      }
    }, 0);
  }

  onClick() {
    this.router.navigateByUrl('/auth');
    this.authLogic.endSession();
    this.isUser = false;
  }
}
