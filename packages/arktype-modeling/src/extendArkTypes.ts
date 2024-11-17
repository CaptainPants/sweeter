import { BaseNode } from '@ark/schema';

import { type Annotations } from './annotations/Annotations.js';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';
import { Type } from 'arktype';

declare module 'arktype/internal/methods/base.ts' {
    /** @ts-ignore cast variance */
    interface BaseType<out t = unknown, $ = {}> {
        /** @ts-ignore */
        annotate(callback: (annotations: Annotations<Type<t>>) => void): this;
        /** @ts-ignore */
        annotations(): Annotations<this>;
        hasAnnotations(): boolean;
    }
}

export function extendArkTypes() {
    /** @ts-ignore */
    BaseNode.prototype.annotate = function (callback) {
        /** @ts-ignore */
        const annotations = AnnotationsImpl.get(this, true);
        callback(annotations);
        return this;
    };
    /** @ts-ignore */
    BaseNode.prototype.annotations = function () {
        /** @ts-ignore */
        return AnnotationsImpl.get(this, true);
    };

    /** @ts-ignore */
    BaseNode.prototype.hasAnnotations = function () {
        /** @ts-ignore */
        return AnnotationsImpl.tryGet(this) !== undefined;
    };
}
