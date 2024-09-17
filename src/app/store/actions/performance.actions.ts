import { createAction, props } from "@ngrx/store";
import { ClaimantAndClaimsCustomerPerformance } from "src/app/functions/models/ClaimantAndClaimsCustomerPerformance";
import { ClaimsProcessorPerformance } from "src/app/functions/models/ClaimsProcessorPerformance";
import { PerformanceBuy } from "src/app/project-manager/Models/performanceBuy";
import { PerformanceFreeProfessional } from "src/app/project-manager/Models/performanceFreeProfessional";
import { ResponseToPerformanceFreeProfessional } from "src/app/project-manager/Models/responseToperformanceFreeProfessional";

export const setPerformanceBuy = createAction(
  '[Performance Id] Add performance Id',
  props<{ performanceBuy: PerformanceBuy }>()
);

export const setClaimantAndClaimsCustomerPerformance = createAction(
  '[Performance] Add claimant and claims customer performance',
  props<{ performanceClaim: ClaimantAndClaimsCustomerPerformance }>()
);

export const setClaimProcessorPerformance = createAction(
  '[Performance] Add claim processor performance',
  props<{ performanceClaim: ClaimsProcessorPerformance }>()
);

export const setPerformanceClaim = createAction(
  '[Performance] Add performance Id',
  props<{ performanceClaim: ClaimantAndClaimsCustomerPerformance }>()
);

export const setPerformanceFreeProfessional = createAction(
  '[Performance Id] Add performance Id',
  props<{ performanceFreeProfessional: PerformanceFreeProfessional }>()
);

export const setSubPerformance = createAction(
  '[SubPerformance Id] Add subPerformance Id',
  props<{ subPerformance: ResponseToPerformanceFreeProfessional }>()
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