import { type Annotations, type AnnotationSetter } from "../annotations/types.js";
import { type AnyTypeConstraint } from "../type/types.js";

export interface AnnotationDispatcher {
    annotate<TSchema extends AnyTypeConstraint>(
        schema: TSchema,
        callback: AnnotationSetter,
    ): TSchema;
    annotations(schema: AnyTypeConstraint): Annotations | undefined;
}