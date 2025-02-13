import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MenuOptionsSelectors, ModalSelectors } from 'src/app/store/selectors';
import { AuthenticationActions, ModalActions, UiActions } from 'src/app/store/actions';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  imgSrc: string = '/./assets/img/OSD.png';
  errorModalOpen$: Observable<boolean> = this.store.select(ModalSelectors.errorModalOpen);
  errorMessage$: Observable<string> = this.store.select(ModalSelectors.errorMessage);
  langChangeSub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    public eventFactoryService: EventFactoryService,
    private osdEventService: OSDService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
      this.authenticationService.endSession();

      // Set the initial logo based on the current language
      this.setLogoSource();

      // Subscribe to language changes to update the logo dynamically
      this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.setLogoSource();
      });
    }, 0);
  }

  // Helper method to set the logo source based on the current language
  private setLogoSource(): void {
    if (this.translate.currentLang === 'en') {
      this.imgSrc = '/./assets/img/OSD2.png';
    } else {
      this.imgSrc = '/./assets/img/OSD.png';
    }
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.osdEventService.userLogin(this.loginForm.value).subscribe({
      next: (response: any) => {
        const userInfo = response?.Body?.USER_INFO;
        this.authenticationService.userInfo = userInfo;
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Login error:', error);
      }
    });
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  redirectLink() {
    if (this.translate.currentLang === 'en') {
      window.open('https://www.canva.com/design/DAGS4Ehqdhc/JCnX9GAwuWRyk0s3R_0TIA/edit', '_blank');
    } else {
      window.open('https://www.canva.com/design/DAGSj7FuRjM/N8O1JuATCUXV8pyD7IM6iw/view', '_blank');
    }
  }
}
