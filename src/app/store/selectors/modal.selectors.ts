import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ModalState } from "../reducers/modal.reducer";


const modalState = createFeatureSelector<ModalState>('modalState');

export const errorModalOpen = createSelector(
  modalState,
  (modalState) => modalState.errorModalOpen
);

export const alertOpen = createSelector(
  modalState,
  (modalState) => modalState.alertOpen
);

export const errorMessage = createSelector(
  modalState,
  (modalState) => modalState.errorMessage
);

export const alertMessage = createSelector(
  modalState,
  (modalState) => modalState.alertMessage
);

export const alertType = createSelector(
  modalState,
  (modalState) => modalState.alertType
);

export const alertPosition = createSelector(
  modalState,
  (modalState) => modalState.alertPosition
);
