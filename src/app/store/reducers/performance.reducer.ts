import { createReducer, on } from "@ngrx/store";
import { PerformanceActions } from "../actions";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";
import { PerformanceClaim} from "src/app/functions/models/PerformanceClaims";
import { PerformanceFreeProfessional } from "src/app/project-manager/Models/performanceFreeProfessional";

export interface PerformanceState {  
    performanceBuy: PerformanceBuy,
    performanceClaim: PerformanceClaim,
    fileCode: string,
    projectPerformance: PerformanceFreeProfessional,
    projectManagerId: string,
}

const initialState: PerformanceState = {   
    performanceBuy: {} as PerformanceBuy,
    performanceClaim: {} as PerformanceClaim,
    fileCode: "",
    projectPerformance: {} as PerformanceFreeProfessional,
    projectManagerId: ""
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
    on(PerformanceActions.setFileCode, (currentState, { fileCode }) => ({
        ...currentState,
        fileCode: fileCode
    })),
    on(PerformanceActions.setProjectPerformance, (currentState, { performance }) => ({
        ...currentState,
        projectPerformance: performance
    })),
    on(PerformanceActions.setProjecTManagerId, (currentState, { projectManagerId }) => ({
        ...currentState,
        projectManagerId: projectManagerId
    })),
    )