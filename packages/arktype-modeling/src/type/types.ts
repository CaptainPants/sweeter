import { Type } from 'arktype';
import { ObjectType } from 'arktype/internal/methods/object.ts';

export type AnyTypeConstraint = Type<any, any>;
export type UnknownType = Type<unknown>;

export type AnyObjectTypeConstraint = ObjectType<object, any>;
export type UnknownObjectType = ObjectType<object, any>;
