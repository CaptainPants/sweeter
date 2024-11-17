import { AnyTypeConstraint } from "../type";

export type ParentRelationship =
    | {
          type: 'element';
      }
    | {
          type: 'property';
          property: string;
      }
    | {
          type: 'self';
      };

export interface TypeInfo {
    type: AnyTypeConstraint;
    parentInfo: ParentTypeInfo | null;
}
export interface ParentTypeInfo extends TypeInfo {
    relationship: ParentRelationship;
}
