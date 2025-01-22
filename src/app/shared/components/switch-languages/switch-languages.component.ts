import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'shared-switch-languages',
  templateUrl: './switch-languages.component.html',
  styleUrls: ['./switch-languages.component.css']
})
export class SwitchLanguagesComponent implements OnInit {

  languageCode!: string;
  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.translate.currentLang == "en") {
        this.languageCode = "en"
      }
      else {
        this.languageCode = "es"
      }
    }, 0);
  }

  onChange() {
    if (this.languageCode === "es") {
      this.languageCode = "en";
    } else {
      this.languageCode = "es";
    }
    this.languageCode);
    this.translate.use(this.languageCode);
  }    
}
