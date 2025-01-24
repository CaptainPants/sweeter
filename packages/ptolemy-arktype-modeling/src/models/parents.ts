import { UnknownType } from '../type/index.js';

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
    type: UnknownType;
    parentInfo: ParentTypeInfo | null;
}
export interface ParentTypeInfo extends TypeInfo {
    relationship: ParentRelationship;
}
