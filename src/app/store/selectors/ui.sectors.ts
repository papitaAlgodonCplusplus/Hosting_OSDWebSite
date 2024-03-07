import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UiState } from "../reducers/ui.reducer";


const uiState = createFeatureSelector<UiState>('uiState');

// Selector to get the current state of the header component's visibility
export const headerOpen = createSelector(
  uiState,
  (uiState) => uiState.headerOpen
);
// Selector to get the current state of the footer component's visibility
export const footerOpen = createSelector(
  uiState,
  (uiState) => uiState.footerOpen
);
// Selector to get the current state of the left sidebar component's visibility
export const leftSidebarOpen = createSelector(
  uiState,
  (uiState) => uiState.leftSidebarOpen
);
// Selector to get the current state (disabled/enabled) of the header component
export const hideHeader = createSelector(
  uiState,
  (uiState) => uiState.hideHeader
);

// Selector to get the current state (disabled/enabled) of the footer component
export const hideFooter = createSelector(
  uiState,
  (uiState) => uiState.hideFooter
);

// Selector to get the current state (disabled/enabled) of the footer component
export const hideLeftSidebar = createSelector(
  uiState,
  (uiState) => uiState.hideLeftSidebar
);

export const selectSwitchReport = createSelector(
  uiState,
  (uiState) => uiState.reportName
);