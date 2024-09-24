import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { OSDService } from 'src/app/services/osd-event.services';
import { ModalActions, PerformanceActions, UiActions } from 'src/app/store/actions';
import { AuthSelectors, PerformanceSelectors } from 'src/app/store/selectors';
import { PerformanceBuy } from '../../Models/performanceBuy';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FreeProfessional } from 'src/app/functions/models/FreeProfessional';

@Component({
  selector: 'app-performance-buy',
  templateUrl: './performance-buy.component.html',
  styleUrls: ['./performance-buy.component.css']
})
export class PerformanceBuyComponent implements OnDestroy {

  performanceForm: FormGroup;
  documentName: string | undefined;
  performance$: Observable<PerformanceBuy> = this.store.select(PerformanceSelectors.performanceBuy)
  performanceBuy!: PerformanceBuy;
  performance!: any;
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken)
  showButtons: boolean = true;
  selectedSummaryType: string | undefined;
  summaryTypes: DropDownItem[] = [];
  projectManagerSelectedObservable$: Observable<string> = this.store.select(PerformanceSelectors.projectManagerId)
  projectManagerSelected: string = "";
  modifiedPerformanceBuy: any;
  isCreatePerformance: boolean = false;
  isViewPerformance: boolean = true;

  constructor(private store: Store,
    private osdEventService: OSDService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private OSDEventService: OSDService,
    private OSDDataService: OSDDataService,
    private authService: AuthenticationService
  ) {
    this.performanceForm = this.validatePerformanceOnDataService();
  }

  validatePerformanceOnDataService(): FormGroup {
    this.performance$.subscribe(performance => {
      this.performanceBuy = performance;
    })

    if (Object.keys(this.performanceBuy).length > 0) {
      const form = this.formBuilder.group({
        Date: this.performanceBuy.Date,
        JustifyingDocument: this.performanceBuy.JustifyingDocument,
        SummaryTypeId: this.performanceBuy.SummaryTypeId,
        ProductServiceId: this.performanceBuy.ProductServiceId,
        MinimumUnits: this.performanceBuy.MinimumUnits,
        MaximumUnits: this.performanceBuy.MaximumUnits,
        UnitaryCost: this.performanceBuy.UnitaryCost,
        ShelfLife: this.performanceBuy.ShelfLife
      });
      return form;
    }
    else {
      this.isCreatePerformance = true
      return this.createForm()
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar());
      this.store.dispatch(UiActions.hideFooter());
      this.OSDEventService.GetSummaryTypes();
      this.OSDEventService.GetFreeProfessionalsDataEvent();
    }, 0);

    this.performance$.subscribe(performance => {
      this.performance = performance
    })

    this.OSDDataService.SummaryTypesPerformanceBuyList$.subscribe(summaryTypes => {
      summaryTypes.forEach(items => {
        var entityDropDownItem: DropDownItem = { value: items.Summary, key: items.Id };
        this.summaryTypes.push(entityDropDownItem);
      });
    });

    if (this.performance != null) {
      this.performanceForm = this.fillForm()
    }

    this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated === false) {
        this.showButtons = false
      }
    });

    this.projectManagerSelectedObservable$.subscribe(id => {
      this.projectManagerSelected = id;
    })

    this.OSDEventService.getFreeProfessionalsList().then(freeProfessionals => {
      if (this.authService.userInfo) {
        if (freeProfessionals) {
          const freeProfessional: FreeProfessional | undefined = freeProfessionals?.find(fp => fp.Userid === this.authService.userInfo?.Id);
          if (freeProfessional?.FreeprofessionaltypeAcronym == "DT" || freeProfessional?.FreeprofessionaltypeAcronym == "INFIT") {
            this.isViewPerformance = false;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
      this.store.dispatch(PerformanceActions.setPerformanceBuy({ performanceBuy: {} as PerformanceBuy }))
    }, 0);
  }

  private fillForm(): FormGroup {
    console.log(this.performance)
    const fechaOriginal = this.performance.Date;
    const fechaFormateada = this.datePipe.transform(fechaOriginal, 'yyyy-MM-dd');
    this.documentName = this.performance.JustifyingDocument;
    const form = this.formBuilder.group({
      Date: fechaFormateada,
      ProductServiceId: this.performance.ProductServiceId,
      MinimumUnits: this.performance.MinimumUnits,
      MaximumUnits: this.performance.MaximumUnits,
      UnitaryCost: this.performance.UnitaryCost,
      ShelfLife: this.performance.ShelfLife,
      SummaryTypeId: this.performance.SummaryTypeId,
      JustifyingDocument: [this.performance.JustifyingDocument, [Validators.required]]
    });
    return form;
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      Date: ['', [Validators.required]],
      ProductServiceId: ['', []],
      MinimumUnits: ['', [Validators.required]],
      MaximumUnits: ['', [Validators.required]],
      UnitaryCost: ['', [Validators.required]],
      ShelfLife: ['', [Validators.required]],
      JustifyingDocument: ['', [Validators.required]],
      SummaryTypeId: ['', [Validators.required]]
    });
    return form;
  }

  onSubmit(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.osdEventService.performanceBuy(this.performanceForm.value, this.projectManagerSelected);
  }

  modifyPerformance(): void {
    if (this.performanceForm.invalid) {
      this.performanceForm.markAllAsTouched();
      return;
    }
    this.OSDEventService.modifyPerformanceBuy(this.performanceForm.value, this.projectManagerSelected, this.performance.Id);
  }

  displayFileName(): void {
    const fileNameDocument1 = document.getElementById('JustifyingDocument') as HTMLInputElement;
    if (fileNameDocument1.value !== null) {
      this.documentName = fileNameDocument1.value;
    }
  }
}
