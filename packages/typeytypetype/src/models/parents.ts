import { type Type } from '../types/Type.js';

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
    type: Type<unknown>;
    parentInfo: ParentTypeInfo | null;
}
export interface ParentTypeInfo extends TypeInfo {
    relationship: ParentRelationship;
}
