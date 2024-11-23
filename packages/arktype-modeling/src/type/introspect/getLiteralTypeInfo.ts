import { AnyTypeConstraint } from '../AnyTypeConstraint';
import { throwError } from '@captainpants/sweeter-utilities';
import { InterrogableNode } from './types';

export function tryGetLiteralTypeInfo(schema: AnyTypeConstraint): unknown {
    const typed = schema as never as InterrogableNode;
    if (typed.inner.unit) {
        return typed.inner.unit.compiledValue;
    }
    return undefined;
}

export function getLiteralTypeInfo(schema: AnyTypeConstraint) {
    return (
        tryGetLiteralTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a literal'))
    );
}
