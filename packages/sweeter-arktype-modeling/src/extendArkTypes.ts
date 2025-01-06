import {
    $ark,
    BaseRoot,
} from '@ark/schema';
import { type Type } from 'arktype';

import {
    type Annotations,
    type AnnotationSetter,
} from './annotations/types.js';

declare module 'arktype/internal/methods/base.ts' {
    /** @ts-expect-error cast variance */ /* eslint-disable-next-line -- Multiple issues with the signature (but we have to match the original) */
    interface BaseType<out t = unknown, $ = {}> {
        annotate(callback: AnnotationSetter): this;
        annotations(): Annotations | undefined;
        hasAnnotations(): boolean;
    }
}

interface SchemaNodeToExtend {
    annotate(this: Type<unknown>, callback: AnnotationSetter): unknown;
    annotations(this: Type<unknown>): Annotations | undefined;
    hasAnnotations(this: Type<unknown>): boolean;
}

declare module '@ark/schema' {
    export interface BaseMeta {
        annotations?: Annotations | undefined;
    }
}

let counter = 0;
let inited = false;

function extendArkTypes_Schema() {
    const id = ++counter;

    if (inited) {
        return;
    }
    inited = true;

    addFunctionsToSchemaNode(BaseRoot as never);

    for (const thing of Object.values($ark.intrinsic)) {
        addFunctionsToSchemaNode(thing as never);
    }
}

function addFunctionsToSchemaNode(
    node: SchemaNodeToExtend,
) {
    if (typeof node.annotate !== 'undefined') {
        return; // Means it's already been added
    }

    node.annotate = function (callback: AnnotationSetter): unknown {
        return dispatcher.annotate(this, callback);
    };

    node.annotations = function (): Annotations | undefined {
        return dispatcher.annotations(this);
    };

    node.hasAnnotations = function (): boolean {
        return !!dispatcher.annotations(this);
    };
}

// This needs to happen before we do a real import
extendArkTypes_Schema();

// This is dynamically imported so that that we don't load arktype fully until we are ready..
const realImplementation = await import('./extendArkTypes/RealAnnotationDispatcher.js');
let dispatcher = new realImplementation.RealAnnotationDispatcher();
