import { z } from "zod";

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
    type: z.ZodTypeAny;
    parentInfo: ParentTypeInfo | null;
}
export interface ParentTypeInfo extends TypeInfo {
    relationship: ParentRelationship;
}
