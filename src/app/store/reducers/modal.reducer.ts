import { createReducer, on  } from "@ngrx/store";
import { ModalActions } from "../actions";

export interface ModalState {
  errorModalOpen: boolean;
  alertOpen: boolean;
  errorMessage: string;
  alertMessage: string;
  alertType: string;
  alertPosition: string;
}

const initialState: ModalState = {
  errorModalOpen: false,
  alertOpen: false,
  errorMessage: '',
  alertMessage: '',
  alertType: 'success',
  alertPosition: 'left',
}


export const modalReducers = createReducer(initialState,
  on(ModalActions.toggleErrorModal, (currentState) => ({
    ...currentState,
    errorModalOpen: !currentState.errorModalOpen
  })),
  on(ModalActions.openAlert, (currentState) => ({
    ...currentState,
    alertOpen: true
  })),
  on(ModalActions.closeAlert, (currentState) => ({
    ...currentState,
    alertOpen: false
  })),
  on(ModalActions.addErrorMessage, (currentState, { errorMessage }) => ({
    ...currentState,
    errorMessage: errorMessage
  })),
  on(ModalActions.addAlertMessage, (currentState, { alertMessage }) => ({
    ...currentState,
    alertMessage: alertMessage
  })),
  on(ModalActions.changeAlertType, (currentState, { alertType }) => ({
    ...currentState,
    alertType: alertType
  })),
  on(ModalActions.changeAlertPosition, (currentState, { alertPosition }) => ({
    ...currentState,
    alertPosition: alertPosition
  }))
);
