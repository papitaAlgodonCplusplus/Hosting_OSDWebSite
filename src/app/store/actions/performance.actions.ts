import { createAction, props } from "@ngrx/store";
import { PerformanceClaim } from "src/app/functions/models/PerformanceClaims";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";
import { PerformanceFreeProfessional } from "src/app/project-manager/Models/performanceFreeProfessional";

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

export const setProjectPerformance = createAction(
  '[Performance] set performance',
  props<{ performance: PerformanceFreeProfessional }>()
);

export const setProjecTManagerId = createAction(
  '[ProjectManagerId] set project manager id',
  props<{projectManagerId: string}>()
);