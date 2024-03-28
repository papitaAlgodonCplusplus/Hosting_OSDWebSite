import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { SharedRoutingModule } from './shared-routing.module';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { SimpleDropdownComponent } from './components/simple-dropdown/simple-dropdown.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { SearchDropdownComponent } from './components/search-dropdown/search-dropdown.component';

import { SwitchLanguagesComponent } from './components/switch-languages/switch-languages.component';
import { TranslateModule } from '@ngx-translate/core';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthorizedModalComponent } from './components/authorized-modal/authorized-modal.component';
 
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    Error404PageComponent,
    InputFieldComponent,
    TextAreaComponent,
    ErrorModalComponent,
    AlertComponent,
    SimpleDropdownComponent,
    SearchDropdownComponent,
    ConfirmationModalComponent,
    AlertComponent,
    SearchDropdownComponent,
    LeftSidebarComponent,
    SwitchLanguagesComponent,
    AuthorizedModalComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ErrorModalComponent,
    AlertComponent,
    SimpleDropdownComponent,
    SearchDropdownComponent,
    InputFieldComponent,
    TextAreaComponent,
    ConfirmationModalComponent,
    SearchDropdownComponent,
    LeftSidebarComponent,
    SwitchLanguagesComponent,
    AuthorizedModalComponent
  ]
})
export class SharedModule { }
