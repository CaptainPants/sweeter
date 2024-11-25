import { type, Type } from 'arktype';
import { throwError } from '@captainpants/sweeter-utilities';
import { AnyTypeConstraint } from '../AnyTypeConstraint';
import { BaseRoot } from '@ark/schema';
import { asDomainNode, asIntersectionNode, asUnitNode } from './internal/arktypeInternals';

export interface ObjectTypeInfo {
    fixedProps: Map<string | symbol, Type<unknown>>;

    stringMappingType: Type<unknown> | undefined;
    symbolMappingType: Type<unknown> | undefined;
}

export function tryGetObjectTypeInfo(
    schema: AnyTypeConstraint,
): ObjectTypeInfo | undefined {
    const node = schema as never as BaseRoot;
    
    const asObject = asIntersectionNode(node);
    if (!asObject) {
        return undefined;
    }

    const fixedProps: Map<string | symbol, AnyTypeConstraint> = new Map();
    for (const prop of asObject.props) {
        fixedProps.set(prop.key, prop.value as never);
    }

    const keys = asObject.keyof();
    let stringKey: BaseRoot | undefined;
    let symbolKey: BaseRoot | undefined;

    for (const key of keys.branches) {
        const asDomain = asDomainNode(key);
        if (asDomain) {
            if (asDomain.domain === 'string') {
                stringKey = key;
                continue;
            }
            else if (asDomain.domain === 'symbol') {
                symbolKey = key;
                continue;
            }
        }
    }

    // TODO: this doesn't really cater to complex mapped keys that
    // you can get through things like [Key in `PREFIX-${string}]
    // but ... :shrug:

    return {
        fixedProps: fixedProps,
        stringMappingType: stringKey ? node.get(stringKey) as never : undefined,
        symbolMappingType: symbolKey ? node.get(symbolKey) as never : undefined
    }
}

type X = { [Key in `banana-${string}`]: string };

export function getObjectTypeInfo(schema: AnyTypeConstraint): ObjectTypeInfo {
    return (
        tryGetObjectTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a union'))
    );
}
