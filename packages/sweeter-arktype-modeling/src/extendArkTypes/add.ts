import { type Type } from 'arktype';
import {
    type Annotations,
    type AnnotationSetter,
} from '../annotations/types.js';

import { dispatcher } from './dispatcher.js';

export interface SchemaNodeToExtend {
    annotate(this: Type<unknown>, callback: AnnotationSetter): unknown;
    annotations(this: Type<unknown>): Annotations | undefined;
    hasAnnotations(this: Type<unknown>): boolean;

    readonly expression: string;
}

export function addFunctionsToSchemaNode(node: SchemaNodeToExtend) {
    if (typeof node.annotate !== 'undefined') {
        return; // Means it's already been added
    }

    //console.log('Extending ', node.expression);

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
