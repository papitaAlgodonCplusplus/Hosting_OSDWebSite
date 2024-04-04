import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-performance-buy',
  templateUrl: './performance-buy.component.html',
  styleUrls: ['./performance-buy.component.css']
})
export class PerformanceBuyComponent implements OnDestroy {

  performanceForm: FormGroup;
  documentName: string | undefined;
  performance$: Observable<PerformanceBuy> = this.store.select(PerformanceSelectors.performance)
  performance!: any;
  isView: boolean = false;
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  showButtons: boolean = true;

  constructor(private store: Store,
    private osdEventService: OSDService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.performanceForm = this.createForm()
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
      this.performance$.subscribe(performance => {
        this.performance = performance
      })

      if (this.performance) {
        this.performanceForm = this.fillForm()
      }

      this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated === false) {
          this.showButtons = false
        }
      });
    }, 0);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  private fillForm(): FormGroup {
    const fechaOriginal = this.performance.Date;
    const fechaFormateada = this.datePipe.transform(fechaOriginal, 'dd/MM/yyyy');
    this.documentName = this.performance.JustifyingDocument;
    const form = this.formBuilder.group({
      date: [fechaFormateada || '', [Validators.required]],
      productServiceId: [this.performance.ProductServiceId || '', [Validators.required]],
      minimumUnits: [this.performance.MinimumUnits || '', [Validators.required]],
      maximumUnits: [this.performance.MaximumUnits || '', [Validators.required]],
      unitaryCost: [this.performance.UnitaryCost || '', [Validators.required]],
      shelfLife: [this.performance.ShelfLife || '', [Validators.required]],
      summary: [this.performance.Summary || '', [Validators.required]]
    });
    return form;
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      date: ['', [Validators.required]],
      productServiceId: ['', [Validators.required]],
      minimumUnits: ['', [Validators.required]],
      maximumUnits: ['', [Validators.required]],
      unitaryCost: ['', [Validators.required]],
      shelfLife: ['', [Validators.required]],
      justifyingDocument: ['', [Validators.required]],
      summary: ['', [Validators.required]]
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
