import { createAction, props } from "@ngrx/store";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";

export const setPerformance = createAction(
    '[Performance Id] Add performance Id',
    props<{ performance: PerformanceBuy }>()
  );