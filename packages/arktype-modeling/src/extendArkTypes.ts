import { BaseNode, BaseRoot, nodeClassesByKind, NodeKind } from '@ark/schema';
import { type, type Type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import type { Annotations, AnnotationSetter } from './annotations/types.js';
import type { AnyTypeConstraint } from './type/types.js';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';
import { AnnotationsBuilderImpl } from './annotations/internal/AnnotationBuilderImpl.js';

declare module 'arktype/internal/methods/base.ts' {
    /** @ts-ignore cast variance */
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

let extended = false;

type NodeClass = (typeof nodeClassesByKind)[NodeKind];

export function extendArkTypes() {
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
        nodeClassesByKind[key as NodeKind] =
            wrapped.get(value) ?? throwError('Not found');
    }

    const intrinsicTypes = type;
    for (const [name, node] of Object.entries(intrinsicTypes)) {
        if (node instanceof BaseRoot) {
            addFunctionsToSchemaNode(name, node);
        }
    }
}
extendArkTypes.also = function (type: Type<any>) {
    addFunctionsToSchemaNode(type.expression, type as never);
};

function addFunctionsToSchemaNode(name: string, node: any) {
    node.annotate = function (callback: AnnotationSetter): unknown {
        return funcs.annotate(this, callback);
    };

    node.annotations = function (): Annotations | undefined {
        return funcs.annotations(this);
    };

    node.hasAnnotations = function (): boolean {
        return !!funcs.annotations(this);
    };
}

function wrap(Node: NodeClass): NodeClass {
    // @ts-expect-error
    const Wrapped = class Wrapped extends Node {
        constructor(...args: ConstructorParameters<NodeClass>) {
            super(...args);
            addFunctionsToSchemaNode(Node.name, this);
        }
    };
    return Wrapped;
}

const funcs = {
    annotate<TSchema extends AnyTypeConstraint>(
        schema: TSchema,
        callback: AnnotationSetter,
    ): TSchema {
        const prior = funcs.annotations(schema) as AnnotationsImpl<TSchema>;
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
        const result = (schema as any as BaseNode).withMeta({
            annotations: annotations,
        });
        return result as never;
    },
    annotations(schema: AnyTypeConstraint): Annotations | undefined {
        return schema.meta.annotations;
    },
};
