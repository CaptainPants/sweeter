import { equals } from "@captainpants/sweeter-utilities";
import { ParentTypeInfo } from "../parents.js";

export function isEquivalentParentInfo(a: ParentTypeInfo | null, b: ParentTypeInfo | null): boolean {
    if (a === b) return true; // the same object or both null
    else if (!a || !b) return false; // otherwise if one of them is null 
    
    if (a.type !== b.type) return false;
    if (!equals.deep(a.parentInfo, b.parentInfo)) return false;
    
    const aRel = a.relationship;
    const bRel = b.relationship;
    if (aRel.type !== bRel.type) {
        return false;
    }

    if (aRel.type === 'property') {
        if (aRel.property !== (bRel as { property: string }).property) {
            return false;
        }
    }

    return isEquivalentParentInfo(a.parentInfo, b.parentInfo);
}