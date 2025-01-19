import { type Type } from 'arktype';
import { type ObjectType } from 'arktype/internal/methods/object.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTypeConstraint = Type<any, any>;
export type UnknownType = Type<unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObjectTypeConstraint = ObjectType<object, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownObjectType = ObjectType<object, any>;

export interface PropertyInfo<TSchema = Type<unknown>> {
    type: TSchema;
    optional: boolean;
}