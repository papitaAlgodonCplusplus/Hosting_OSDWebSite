import { createAction, props } from "@ngrx/store";


// Define an action to trigger the sign-in process when used in the Login Page component.
export const signIn = createAction(
  '[Login Page] Sign In'
);

// Define an action to trigger the sign-out process when used in the Right Sidebar Component.
export const signOut = createAction(
  '[Right Sidebar Component] Sign Out'
);
