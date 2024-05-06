import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ClaimState } from "../reducers/claim.reducer";

const claimState = createFeatureSelector<ClaimState>('claimState');

export const claims = createSelector(
  claimState,
  (claimState) => claimState.claims
);

export const claim = createSelector(
  claimState,
  (claimState) => claimState.claim
);