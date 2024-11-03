import { Type } from "arktype";
import { arkTypeUtilityTypes } from "../utility";

export type UnionType<TUnderlyingUnion> = Type<TUnderlyingUnion> & { 
    readonly branchGroups: readonly arkTypeUtilityTypes.AnyTypeConstraint[];
}