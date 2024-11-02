
import { ark } from 'arktype';
import * as arktype from 'arktype';
import { BaseNode } from '@ark/schema';

import { type Annotations } from './annotations/Annotations.js';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';

declare module "@ark/schema" {
    /** @ts-ignore cast variance */
    interface BaseNode<out d extends BaseNodeDeclaration = BaseNodeDeclaration> {
        /** @ts-ignore */
        annotations(): Annotations<this>;
        hasAnnotations(): boolean;
    }
}
export function extendArkType() {
    /** @ts-ignore */
    BaseNode.prototype.annotations = function () {
        /** @ts-ignore */
        return AnnotationsImpl.get(this, true);
    };

    BaseNode.prototype.hasAnnotations = function () {
        /** @ts-ignore */
        return AnnotationsImpl.tryGet(this) !== undefined;
    };
}