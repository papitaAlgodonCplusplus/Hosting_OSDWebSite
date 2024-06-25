import { createReducer, on } from "@ngrx/store";
import { PerformanceActions } from "../actions";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";
import { PerformanceClaim} from "src/app/functions/models/PerformanceClaims";

export interface PerformanceState {  
    performanceBuy: PerformanceBuy,
    performanceClaim: PerformanceClaim
}

const initialState: PerformanceState = {   
    performanceBuy: {} as PerformanceBuy,
    performanceClaim: {} as PerformanceClaim
}

export const performanceReducers = createReducer(initialState,
    on(PerformanceActions.setPerformanceBuy, (currentState, { performanceBuy }) => ({
        ...currentState,
        performanceBuy: performanceBuy
    })),
    on(PerformanceActions.setPerformanceClaim, (currentState, { performanceClaim }) => ({
        ...currentState,
        performanceClaim: performanceClaim
    })),
    )