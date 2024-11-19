import { BaseNode, BaseScope, nodeClassesByKind, NodeKind } from '@ark/schema';

import { type Annotations } from './annotations/Annotations.js';
import { type, Type, ark } from 'arktype';
import { throwError } from '@captainpants/sweeter-utilities';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';

// @ts-expect-error
type AnnotationSetter<t> = (annotations: Annotations<Type<t>>) => void;

declare module 'arktype/internal/methods/base.ts' {
    /** @ts-ignore cast variance */
    interface BaseType<out t = unknown, $ = {}> {
        annotate(callback: AnnotationSetter<t>): this;
        annotations(): Annotations<this>;
        hasAnnotations(): boolean;
    }
}

let extended = false;

type NodeClass = (typeof nodeClassesByKind)[NodeKind];

export function extendArkTypes() {
    ark.config.jitless = true;

    if (extended) {
        return;
    }

    const wrapped = new Map<NodeClass, NodeClass>();
    for (const item of Object.values(nodeClassesByKind)) {
        if (!wrapped.has(item)) {
            wrapped.set(item, wrap(item));
        }
    }

    for (const [key, value] of Object.entries(nodeClassesByKind)) {
        nodeClassesByKind[key as NodeKind] = wrapped.get(value) ?? throwError('Not found');
    }
    
    const exports = ark.export();
    for (const current of Object.values(exports)) {
        addFunctions(current);
    }
    // Do we need to do true/false/null/undefined

    const x = type({ 'test': type.unit(1) });
    const j = 0;
}

function addFunctions(thing: any) {
    thing.annotate = function (callback: AnnotationSetter<unknown>): unknown {
        const annotations = AnnotationsImpl.get(this as never, true);
        callback(annotations);
        return this;
    }

    // @ts-expect-error
    thing.annotations = function(): Annotations<this> {
        return AnnotationsImpl.get(this as never, true);
    }

    thing.hasAnnotations = function(): boolean {
        /** @ts-ignore */
        return AnnotationsImpl.tryGet(this) !== undefined;
    };
}

function wrap(Node: NodeClass): NodeClass {
    // @ts-expect-error
    const Wrapped = class Wrapped extends Node {
        constructor(...args: ConstructorParameters<NodeClass>) {
            super(...args);
            addFunctions(this);
        }
    }
    return Wrapped;

    // type.annotate = function (callback) {
    //     /** @ts-ignore */
    //     const annotations = AnnotationsImpl.get(this, true);
    //     callback(annotations);
    //     return this;
    // };

    // type.annotations = function () {
    //     /** @ts-ignore */
    //     return AnnotationsImpl.get(this, true);
    // };

    // type.hasAnnotations = function () {
    //     /** @ts-ignore */
    //     return AnnotationsImpl.tryGet(this) !== undefined;
    // };
}