import { ActionReducerMap } from '@ngrx/store';
import { uiReducers, UiState } from './ui.reducer'; 
import { modalReducers, ModalState } from './modal.reducer'; 
import { authenticationReducers, AuthenticationState } from './authentication.reducer'; 
import { claimReducers, ClaimState } from './claim.reducer'; 
import { performanceReducers, PerformanceState } from './performance.reducer'; 
import { menuOptionsReducers, MenuOptionsState } from './MenuOptions.reducer'; 

export interface AppState {
    uiState: UiState;
    modalState: ModalState;
    authenticationState: AuthenticationState;
    claimState: ClaimState;  
    performanceState: PerformanceState; 
    menuOptionsState: MenuOptionsState;  
}

export const reducers: ActionReducerMap<AppState> = {
    uiState: uiReducers,
    modalState: modalReducers,
    authenticationState: authenticationReducers,
    claimState: claimReducers,
    performanceState: performanceReducers,
    menuOptionsState: menuOptionsReducers
};
