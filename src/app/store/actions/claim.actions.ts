import { createAction, props } from "@ngrx/store";
import { Claim } from "src/app/models/claim";

export const setClaims = createAction(
    '[Claims] Add Claims',
    props<{ claims: Claim[] }>()
  );

  export const setClaimId = createAction(
    '[Claim Id] Add Claim Id',
    props<{ claimId: string }>()
  );