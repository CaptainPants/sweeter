
import { ark } from 'arktype';
import * as arktype from 'arktype';
import { BaseNode } from '@ark/schema';

import { type Annotations } from './annotations/Annotations.js';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';
import { BaseType } from 'arktype/internal/methods/base.ts';

declare module "arktype/internal/methods/base.ts" {
    /** @ts-ignore cast variance */
    interface BaseType<out t = unknown, $ = {}> {
        /** @ts-ignore */
        annotations(): Annotations<this>;
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