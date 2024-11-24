import { AnyTypeConstraint } from '../AnyTypeConstraint';
import { throwError } from '@captainpants/sweeter-utilities';
import { asUnitNode } from './internal/arktypeInternals';

export function tryGetLiteralTypeInfo(schema: AnyTypeConstraint): unknown {
    return asUnitNode(schema as never)?.unit;
}

export function getLiteralTypeInfo(schema: AnyTypeConstraint) {
    return (
        tryGetLiteralTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a literal'))
    );
}
