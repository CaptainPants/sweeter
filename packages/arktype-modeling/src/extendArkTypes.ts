
import { BaseNode } from '@ark/schema';

import { type Annotations } from './annotations/Annotations.js';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';

declare module "arktype/internal/methods/base.ts" {
    /** @ts-ignore cast variance */
    interface BaseType<out t = unknown, $ = {}> {
        /** @ts-ignore */
        annotations(): Annotations<Type<t>>;
        hasAnnotations(): boolean;
    }
}

export function extendArkTypes() {
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