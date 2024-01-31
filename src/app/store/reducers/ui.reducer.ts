import { createReducer, on } from "@ngrx/store";
import { UiActions } from "../actions";

export interface UiState {
  headerOpen: boolean;
  footerOpen: boolean;
  leftSidebarOpen: boolean;
  hideHeader: boolean;
  hideFooter: boolean;
  hideLeftSidebar: boolean;
}

const initialState: UiState = {
  headerOpen: true,
  footerOpen: true,
  leftSidebarOpen: true,
  hideHeader: false,
  hideFooter: false,
  hideLeftSidebar: false
}

// Reducer for toggling the visibility of the header, footer and left sidebar components
export const uiReducers = createReducer(initialState,
  on(UiActions.hideHeader, (currentState) => ({
    ...currentState,
    hideHeader: !currentState.hideHeader
  })),
  on(UiActions.hideFooter, (currentState) => ({
    ...currentState,
    hideFooter: !currentState.hideFooter
  })),
  on(UiActions.toggleLeftSidebar, (currentState) => ({
    ...currentState,
    leftSidebarOpen: !currentState.leftSidebarOpen
  })),
  on(UiActions.hideLeftSidebar, (currentState) => ({
    ...currentState,
    hideLeftSidebar: !currentState.hideLeftSidebar
  })),
  on(UiActions.hideAll, (currentState) => ({
    ...currentState,
    hideHeader: true,
    hideFooter: true,
    hideLeftSidebar:true
  })),
  on(UiActions.showAll, (currentState) => ({
    ...currentState,
    hideHeader: false,
    hideFooter: false,
    hideLeftSidebar: false
  }))


);
