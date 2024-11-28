import { type BaseNode, BaseRoot, nodeClassesByKind, type NodeKind } from '@ark/schema';
import { type, type Type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import  { type Annotations, type AnnotationSetter } from './annotations/types.js';
import  { type UnknownType, type AnyTypeConstraint } from './type/types.js';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';
import { AnnotationsBuilderImpl } from './annotations/internal/AnnotationBuilderImpl.js';


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

const extended = false;

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
            addFunctionsToSchemaNode(name, node as never);
        }
    }
}
extendArkTypes.also = function (type: UnknownType) {
    addFunctionsToSchemaNode(type.expression, type as never);
};

function addFunctionsToSchemaNode(name: string, node: SchemaNodeToExtend) {
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
    // @ts-expect-error -- Wrapped doesn't correctly implement Node
    const Wrapped = class Wrapped extends Node {
        constructor(...args: ConstructorParameters<NodeClass>) {
            super(...args);
            addFunctionsToSchemaNode(Node.name, this as never);
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
        const result = (schema as unknown as BaseNode).withMeta({
            annotations: annotations,
        });
        return result as never;
    },
    annotations(schema: AnyTypeConstraint): Annotations | undefined {
        return schema.meta.annotations;
    },
};
