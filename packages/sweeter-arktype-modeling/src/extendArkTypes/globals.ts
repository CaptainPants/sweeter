import {
    type Annotations,
    type AnnotationSetter,
} from '../annotations/types.js';

declare module 'arktype/internal/methods/base.ts' {
    /** @ts-expect-error cast variance */ /* eslint-disable-next-line -- Multiple issues with the signature (but we have to match the original) */
    interface BaseType<out t = unknown, $ = {}> {
        annotate(callback: AnnotationSetter): this;
        annotations(): Annotations | undefined;
        hasAnnotations(): boolean;
    }
}
declare module '@ark/schema' {
    export interface BaseMeta {
        annotations?: Annotations | undefined;
    }
}
