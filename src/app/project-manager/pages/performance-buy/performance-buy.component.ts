import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-performance-buy',
  templateUrl: './performance-buy.component.html',
  styleUrls: ['./performance-buy.component.css']
})
export class PerformanceBuyComponent implements OnDestroy {
  performanceForm: FormGroup;
  documentName: string | undefined;

  constructor(private store: Store,
    private osdEventService : OSDService,
    private formBuilder: FormBuilder,
    private translate: TranslateService) {
    this.performanceForm = this.createForm();
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      date: ['', [Validators.required]],
      productServiceId: ['', [Validators.required]],
      minimumUnits: ['', [Validators.required]],
      maximumUnits: ['', [Validators.required]],
      unitaryCost: ['', [Validators.required]],
      shelfLife: ['', [Validators.required]],
      justifyingDocument: ['', [Validators.required]]
    });
    return form;
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "Faltan campos por llenar" }))
      this.store.dispatch(ModalActions.changeAlertType({ alertType: "warning" }))
      this.store.dispatch(ModalActions.openAlert())
      this.performanceForm.markAllAsTouched();
      return;
    }
      this.osdEventService.performanceBuy(this.performanceForm.value);  
  }

  displayFileName(): void {
    const fileNameDocument1 = document.getElementById('justifyingDocument') as HTMLInputElement;
    if (fileNameDocument1.value !== null) {
      this.documentName = fileNameDocument1.value;
    }
  }
}
