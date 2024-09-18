import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PerformanceState } from "../reducers/performance.reducer";

const performanceState = createFeatureSelector<PerformanceState>('performanceState');

export const performanceBuy = createSelector(
    performanceState,
    (performanceState) => performanceState.performanceBuy
);

export const performanceFreeProfessional = createSelector(
    performanceState,
    (performanceState) => performanceState.performanceFreeProfessional
);

export const claimantAndClaimsCustomerPerformance = createSelector(
    performanceState,
    (performanceState) => performanceState.claimantAndClaimsCustomerPerformance
);

export const claimsProcessorPerformance = createSelector(
    performanceState,
    (performanceState) => performanceState.claimsProcessorPerformance
);

export const fileCode = createSelector(
    performanceState,
    (performanceState) => performanceState.fileCode
);

export const projectPerformance = createSelector(
    performanceState,
    (performanceState) => performanceState.projectPerformance
);

export const projectSubPerformance = createSelector(
    performanceState,
    (performanceState) => performanceState.responseToPerformanceFreeProfessional
);

export const projectManagerId = createSelector(
    performanceState,
    (performanceState) => performanceState.projectManagerId
);