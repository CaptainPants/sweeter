import { arkKind, type BaseNode, nodeClassesByKind, type NodeKind } from '@ark/schema';
import { type, type Type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import  { type Annotations, type AnnotationSetter } from './annotations/types.js';
import  { type UnknownType, type AnyTypeConstraint } from './type/types.js';
import { AnnotationsImpl } from './annotations/internal/AnnotationsImpl.js';
import { AnnotationsBuilderImpl } from './annotations/internal/AnnotationBuilderImpl.js';
import { WithKind } from './type/introspect/internal/arktypeInternals.js';
import { isType } from './type/introspect/is.js';

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

type NodeClass = (typeof nodeClassesByKind)[NodeKind];

const extensionMarkerSymbol: unique symbol = Symbol('arktype-modeling');

let counter = 0;

interface Marker {
    id: number;
}

export function extendArkTypes() {
    const toExtend = type as typeof type & { [extensionMarkerSymbol]: Marker };

    if (toExtend[extensionMarkerSymbol]) {
        return;
    }

    const id = ++counter;

    toExtend[extensionMarkerSymbol] = {
        id
    };

    // const baseTypes = [
    //     Unit.Node,
    //     Domain.Node,
    //     Intersection.Node,
    //     Union.Node,
    //     // Do this last
    //     BaseRoot,
    // ] as const;

    // for (const item of baseTypes) {
    //     addFunctionsToSchemaNode(item.name, item.prototype as never, id);
    // }
    // Not sure if I need to add to all base nodes

    // TODO: trying to remove usage of nodeClassesByKind in favour of just modifying the types..
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

    walkTypes(
        toExtend,
        '',
        (path, schema, id) => {
            addFunctionsToSchemaNode(path, schema as never, id);
        }, 
        id
    );
}
extendArkTypes.also = function (schema: UnknownType) {
    addFunctionsToSchemaNode(schema.expression, schema as never);
};

function walkTypes(moduleLike: object, path: string, callback: (path: string, schema: UnknownType, extensionId: number | undefined) => void, extensionId: number | undefined) {
    const items = Object.entries(moduleLike);
    console.log('Walking module', path);

    for (const [name, value] of items) {
        if (value === undefined) continue;

        const subPath = path ? path + '.' + name : name;

        if ((value as WithKind)[arkKind] === 'module') {
            walkTypes(moduleLike, subPath, callback, extensionId);
        }
        else if (isType(value)) {
            callback(subPath, value, extensionId);
        }
        else {
            // Nothing to do
        }
    }
}

function addFunctionsToSchemaNode(name: string, node: SchemaNodeToExtend, id?: number | undefined) {
    console.log('Trying to extend type', name);

    if (typeof node.annotate !== 'undefined') {
        return; // Means it's already been added
    }

    console.log('Extending type', name);

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
