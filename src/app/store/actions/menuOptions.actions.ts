import { createAction, props } from "@ngrx/store";
import { MenuOption } from "src/app/models/menuOptions";

export const setMenuOptions = createAction(
  '[set Menu] set Menu Options',
  props<{ menuOptions: MenuOption[] }>()
);

