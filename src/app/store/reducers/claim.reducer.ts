import { createReducer, on } from "@ngrx/store";
import { ClaimActions } from "../actions";
import { Claim } from "src/app/models/claim";

export interface ClaimState {
    claims: Claim[],
    claimId: string
}

const initialState: ClaimState = {
    claims: [],
    claimId: ""
}

export const claimReducers = createReducer(initialState,
    on(ClaimActions.setClaims, (currentState, { claims }) => ({
        ...currentState,
        claims: claims
    })),
    on(ClaimActions.setClaimId, (currentState, { claimId }) => ({
        ...currentState,
        claimId: claimId
    })),
    )