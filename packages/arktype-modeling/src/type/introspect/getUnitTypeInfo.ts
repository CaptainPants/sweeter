import { UnknownType } from "../types";
import { asUnitNode } from "./internal/arktypeInternals";

export interface UnitTypeInfo {
    value: unknown;
}

export function getUnitTypeInfo(type: UnknownType): UnitTypeInfo | undefined {
    const value = asUnitNode(type as never);
    if (value) {
        return { value: value.unit };
    }
    return undefined;
}