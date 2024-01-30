import { createAction, props } from "@ngrx/store";


export const toggleErrorModal = createAction(
  '[Error Modal] Toggle Error Modal'
);

export const openAlert = createAction(
  '[Alert] Open Alert'
);

export const closeAlert = createAction(
  '[Alert] Close Alert'
);

export const addErrorMessage = createAction(
  '[Error Modal] Add Error Message',
  props<{ errorMessage: string }>()
);

export const addAlertMessage = createAction(
  '[Alert] Add Alert Message',
  props<{ alertMessage: string }>()
);

export const changeAlertType = createAction(
  '[Alert] Change Alert Type',
  props<{ alertType: string }>()
);

export const changeAlertPosition = createAction(
  '[Alert] Change Alert Position',
  props<{ alertPosition: string }>()
);
