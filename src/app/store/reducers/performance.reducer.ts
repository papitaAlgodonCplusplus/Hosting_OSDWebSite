import { createReducer, on } from "@ngrx/store";
import { PerformanceActions } from "../actions";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";

export interface PerformanceState {  
    performance: PerformanceBuy
}

const initialState: PerformanceState = {   
    performance: {} as PerformanceBuy
}

export const performanceReducers = createReducer(initialState,
    on(PerformanceActions.setPerformance, (currentState, { performance }) => ({
        ...currentState,
        performance: performance
    })),
    )