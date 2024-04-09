import { createReducer, on } from "@ngrx/store";
import { MenuOption } from "src/app/models/menuOptions";
import { MenuOptionsActions } from "../actions";

export interface MenuOptionsState {
   
    menuOptions: MenuOption[];
}

const initialState: MenuOptionsState = {
    menuOptions : []
}

export const menuOptionsReducers = createReducer(initialState,
    on(MenuOptionsActions.setMenuOptions, (currentState, { menuOptions }) => ({
        ...currentState,
        menuOptions: menuOptions
    })),
)
