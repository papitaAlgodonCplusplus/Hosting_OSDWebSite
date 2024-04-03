import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PerformanceState } from "../reducers/performance.reducer";

const performanceState = createFeatureSelector<PerformanceState>('performanceState');

export const performance = createSelector(
    performanceState,
    (performanceState) => performanceState.performance
);