import { createReducer, on } from "@ngrx/store";
import { PerformanceActions } from "../actions";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";

import { PerformanceFreeProfessional } from "src/app/project-manager/Models/performanceFreeProfessional";
import { ResponseToPerformanceFreeProfessional } from "src/app/project-manager/Models/responseToperformanceFreeProfessional";
import { ClaimantAndClaimsCustomerPerformance } from "src/app/functions/models/ClaimantAndClaimsCustomerPerformance";

export interface PerformanceState {  
    performanceBuy: PerformanceBuy,
    performanceClaim: ClaimantAndClaimsCustomerPerformance,
    performanceFreeProfessional: PerformanceFreeProfessional,
    responseToPerformanceFreeProfessional: ResponseToPerformanceFreeProfessional,
    fileCode: string,
    projectPerformance: PerformanceFreeProfessional,
    projectManagerId: string,
}

const initialState: PerformanceState = {   
    performanceBuy: {} as PerformanceBuy,
    performanceClaim: {} as ClaimantAndClaimsCustomerPerformance,
    performanceFreeProfessional: {} as PerformanceFreeProfessional,
    responseToPerformanceFreeProfessional: {} as ResponseToPerformanceFreeProfessional,
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
    on(PerformanceActions.setPerformanceFreeProfessional, (currentState, { performanceFreeProfessional }) => ({
        ...currentState,
        performanceFreeProfessional: performanceFreeProfessional
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
    on(PerformanceActions.setSubPerformance, (currentState, { subPerformance }) => ({
        ...currentState,
        responseToPerformanceFreeProfessional: subPerformance
    })),
    )