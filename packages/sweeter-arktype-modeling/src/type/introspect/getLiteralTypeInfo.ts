import { throwError } from '@captainpants/sweeter-utilities';

import { type UnknownType } from '../types.js';

import { asUnitNode } from './internal/arktypeInternals.js';

export interface LiteralTypeInfo {
    value: unknown;
}

export function tryGetLiteralTypeInfo(
    schema: UnknownType,
): LiteralTypeInfo | undefined {
    const node = asUnitNode(schema as never);
    if (!node) return undefined;

    return {
        value: node.unit,
    };
}

export function getLiteralTypeInfo(schema: UnknownType) {
    return (
        tryGetLiteralTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a literal'))
    );
}
