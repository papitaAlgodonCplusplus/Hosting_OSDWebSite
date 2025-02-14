import { createReducer, on } from "@ngrx/store";
import { ClaimActions } from "../actions";
import { Claim } from "src/app/models/claim";

export interface ClaimState {
    claims: Claim[],
    claim: Claim
}

const initialState: ClaimState = {
    claims: [],
    claim : {} as Claim    
}

export const claimReducers = createReducer(initialState,
    on(ClaimActions.setClaims, (currentState, { claims }) => ({
        ...currentState,
        claims: claims
    })),
    on(ClaimActions.setClaim, (currentState, { claim }) => ({
        ...currentState,
        claim: claim
    })),
    )