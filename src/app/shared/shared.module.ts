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
import { TimeInputComponentComponent } from './components/time-input-component/time-input-component.component';
import { ConfirmationButtonComponent } from './components/confirmation-button/confirmation-button.component';
import { UploadfileComponent } from './components/uploadfile/uploadfile.component';

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
    TimeInputComponentComponent,
    ConfirmationButtonComponent,
    UploadfileComponent
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
    TimeInputComponentComponent,
    ConfirmationButtonComponent,
    UploadfileComponent
  ],
})
export class SharedModule { }
