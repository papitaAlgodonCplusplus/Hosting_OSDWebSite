import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'shared-switch-languages',
  templateUrl: './switch-languages.component.html',
  styleUrls: ['./switch-languages.component.css']
})
export class SwitchLanguagesComponent {

  constructor(private Translate: TranslateService,
    private router: Router) { }

  onChange(lang: string) {
    this.Translate.use(lang);
  }
}
