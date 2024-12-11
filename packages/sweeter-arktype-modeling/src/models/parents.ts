import { type AnyTypeConstraint } from '../type/index.js';

export type ParentRelationship =
    | {
          type: 'element';
      }
    | {
          type: 'property';
          property: string | symbol;
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
