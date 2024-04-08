import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MenuOptionsState } from "../reducers/MenuOptions.reducer";

const MenuOptionState = createFeatureSelector<MenuOptionsState>('menuOptionsState');

export const menuOptions = createSelector(
    MenuOptionState,
    (MenuOptionState) => MenuOptionState.menuOptions
);