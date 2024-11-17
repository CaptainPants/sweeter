import { Type } from "arktype";
import { ObjectType } from "arktype/internal/methods/object.ts";

export type AnyObjectTypeConstraint = ObjectType<Record<string, unknown>, any>;