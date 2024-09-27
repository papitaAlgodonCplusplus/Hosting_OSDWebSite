import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { OSDService } from 'src/app/services/osd-event.services';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnDestroy {

  projectForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private osdEventService : OSDService
  ) {
    this.projectForm = this.createRegisterForm()
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);
  }

  ngOnDestroy(): void {
    this.store.dispatch(UiActions.showAll())
  }

  private createRegisterForm(): FormGroup {
    const form = this.formBuilder.group({
      Objective: ['', [Validators.required]],
      Expected_hours: ['', [Validators.required]],
      Economic_budget: ['', [Validators.required]],
      Start_Date: ['', [Validators.required]],
    });
    return form;
  }
  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(UiActions.toggleConfirmationButton())
    this.osdEventService.createProject(this.projectForm.value);
  }
}
