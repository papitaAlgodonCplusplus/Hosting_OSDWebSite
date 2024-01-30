import { createReducer, on } from "@ngrx/store";
import { AuthenticationActions } from "../actions";


export interface AuthenticationState {
  authenticationToken: boolean;

}

const initialState: AuthenticationState = {
  authenticationToken: false,
}

export const authenticationReducers = createReducer(initialState,
  on(AuthenticationActions.signIn, (currentState) => ({
    ...currentState,
    authenticationToken: true,
  })),
  on(AuthenticationActions.signOut, (currentState) => ({
    ...currentState,
    authenticationToken: false
  }))
);
