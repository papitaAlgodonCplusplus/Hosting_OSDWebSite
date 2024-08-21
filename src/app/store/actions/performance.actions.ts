import { createAction, props } from "@ngrx/store";
import { PerformanceClaim} from "src/app/functions/models/PerformanceClaims";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";

export const setPerformanceBuy = createAction(
    '[Performance Id] Add performance Id',
    props<{ performanceBuy: PerformanceBuy }>()
  );

  export const setPerformanceClaim = createAction(
    '[Performance Id] Add performance Id',
    props<{ performanceClaim: PerformanceClaim }>()
  );

  export const setFileCode = createAction(
    '[file code] Add file Code',
    props<{ fileCode: string }>()
  );