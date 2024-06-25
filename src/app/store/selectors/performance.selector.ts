import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PerformanceState } from "../reducers/performance.reducer";

const performanceState = createFeatureSelector<PerformanceState>('performanceState');

export const performanceBuy = createSelector(
    performanceState,
    (performanceState) => performanceState.performanceBuy
);

export const performanceClaim = createSelector(
    performanceState,
    (performanceState) => performanceState.performanceClaim
);