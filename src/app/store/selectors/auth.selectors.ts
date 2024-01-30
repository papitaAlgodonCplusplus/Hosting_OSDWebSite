import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthenticationState } from "../reducers/authentication.reducer";


const authenticationState = createFeatureSelector<AuthenticationState>('authenticationState');

//TODO: Create a selector to retrieve the 'authToken' property from the authentication state.
export const authenticationToken = createSelector(
  authenticationState,
  (authenticationState) => authenticationState.authenticationToken
);
