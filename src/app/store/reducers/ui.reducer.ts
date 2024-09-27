import { createReducer, on } from '@ngrx/store';
import { UiActions } from '../actions';

export interface UiState {
  headerOpen: boolean;
  footerOpen: boolean;
  leftSidebarOpen: boolean;
  hideHeader: boolean;
  hideFooter: boolean;
  hideLeftSidebar: boolean;
  reportName: string;
  toggleConfirmationButton: boolean;
}

const initialState: UiState = {
  headerOpen: true,
  footerOpen: true,
  leftSidebarOpen: true,
  hideHeader: false,
  hideFooter: false,
  hideLeftSidebar: false,
  reportName: '',
  toggleConfirmationButton: false
};

export const uiReducers = createReducer(
  initialState,
  on(UiActions.hideHeader, (currentState) => ({
    ...currentState,
    hideHeader: true
  })),
  on(UiActions.hideFooter, (currentState) => ({
    ...currentState,
    hideFooter: true
  })),
  on(UiActions.toggleLeftSidebar, (currentState) => ({
    ...currentState,
    leftSidebarOpen: !currentState.leftSidebarOpen
  })),
  on(UiActions.hideLeftSidebar, (currentState) => ({
    ...currentState,
    hideLeftSidebar: true
  })),
  on(UiActions.hideAll, (currentState) => ({
    ...currentState,
    hideHeader: true,
    hideFooter: true,
    hideLeftSidebar: true
  })),
  on(UiActions.showAll, (currentState) => ({
    ...currentState,
    hideHeader: false,
    hideFooter: false,
    hideLeftSidebar: false
  })),
  on(UiActions.switchReport, (currentState, { reportName }) => ({
    ...currentState,
    reportName: reportName
  })),
  on(UiActions.toggleConfirmationButton, (currentState) => ({
    ...currentState,
    toggleConfirmationButton: !currentState.toggleConfirmationButton
  }))
);
