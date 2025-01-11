import { BaseNode } from '@ark/schema';

import { AnnotationsBuilderImpl } from '../annotations/internal/AnnotationBuilderImpl.js';
// Concrete classes here will cause arktype to be imported in full
import { AnnotationsImpl } from '../annotations/internal/AnnotationsImpl.js';
import {
    type Annotations,
    type AnnotationSetter,
} from '../annotations/types.js';
import { type AnyTypeConstraint } from '../type/types.js';

import { type AnnotationDispatcher } from './types.js';

export class AnnotationDispatcherImpl implements AnnotationDispatcher {
    annotate<TSchema extends AnyTypeConstraint>(
        schema: TSchema,
        callback: AnnotationSetter,
    ): TSchema {
        const prior = this.annotations(schema) as AnnotationsImpl<TSchema>;
        const builder =
            prior?.createBuilder() ?? AnnotationsBuilderImpl.empty();
        callback(builder);
        const annotations = new AnnotationsImpl(
            schema,
            builder.attributes,
            builder.labels,
            builder.associatedValues,
            builder.ambientValues,
        );
        const result = (schema as unknown as BaseNode).withMeta({
            annotations: annotations,
        });
        return result as never;
    }
    annotations(schema: AnyTypeConstraint): Annotations | undefined {
        return schema.meta.annotations;
    }
}
