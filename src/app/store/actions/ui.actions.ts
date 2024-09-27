import { createAction, props } from "@ngrx/store";
// Action to hide the visibility of the header component
export const hideHeader = createAction(
  '[Header Component] Hide Header'
);
// Action to hide the visibility of the footer component
export const hideFooter = createAction(
  '[Footer Component] Hide Footer'
);
// Action to hide the visibility of the Left Sidebar component
export const hideLeftSidebar = createAction(
  '[Left Sidebar Component] Hide Left Sidebar '
);
// Action to toggle the visibility of the left sidebar component
export const toggleLeftSidebar = createAction(
  '[Left Sidebar Component] Toggle Left Sidebar'
);
// Action to hide all navigation components in the Auth Module
export const hideAll = createAction(
  '[Nav Components] Hide All nav components'
);
// Action to show all navigation components in the Auth Module
export const showAll = createAction(
  '[Nav Components] Show All nav components'
);
export const switchReport = createAction(
  '[Reports] Switch Report',
  props<{ reportName: string }>()
);

export const toggleConfirmationButton = createAction(
  '[Confirmation Button Component] Toggle Confirmation Button'
);

