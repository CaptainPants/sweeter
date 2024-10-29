import z from 'zod';
import { type TypeInfo } from '../models/parents.js';

import {
    type MatcherContext,
    type Selector,
    type TypeMatcherRulePart,
} from './types.js';

function createTypeCheck(schema: new (...args: any[]) => any): () => TypeMatcherRulePart {
    return () => ({
        type: 'instanceOf',
        constructor: schema
    });
}

export const string = createTypeCheck(z.ZodString);
export const number = createTypeCheck(z.ZodNumber);
export const boolean = createTypeCheck(z.ZodBoolean);
export const object = createTypeCheck(z.ZodObject);
export const array = createTypeCheck(z.ZodArray);
export const union = createTypeCheck(z.ZodUnion);

export function label(label: string): TypeMatcherRulePart {
    return {
        type: 'label',
        label,
    };
}

export function attr(name: string, value: unknown): TypeMatcherRulePart {
    return {
        type: 'attr',
        name,
        value,
    };
}

export function setting(name: string, value: unknown): TypeMatcherRulePart {
    return {
        type: 'setting',
        name,
        value,
    };
}

export function element(
    match: TypeMatcherRulePart = { type: 'any' },
): TypeMatcherRulePart {
    return {
        type: 'element',
        match,
    };
}

export function propertyOf(
    propertyName?: string,
    match: TypeMatcherRulePart = { type: 'any' },
): TypeMatcherRulePart {
    return {
        type: 'propertyOf',
        propertyName,
        match,
    };
}

export function ancestor(
    match: TypeMatcherRulePart = { type: 'any' },
): TypeMatcherRulePart {
    return {
        type: 'ancestor',
        match,
    };
}

export function not(operand: TypeMatcherRulePart): TypeMatcherRulePart {
    return {
        type: 'not',
        operand,
    };
}

export function and(rules: TypeMatcherRulePart[]): TypeMatcherRulePart {
    return {
        type: 'and',
        rules,
    };
}

export function or(rules: TypeMatcherRulePart[]): TypeMatcherRulePart {
    return {
        type: 'or',
        rules,
    };
}

export function callback(
    callback: (type: TypeInfo, context: MatcherContext) => boolean,
): TypeMatcherRulePart {
    return {
        type: 'callback',
        callback,
    };
}

export function selector(
    ...[top, ...steps]: Selector
): TypeMatcherRulePart {
    let previousLevelPart = top;

    for (const currentStep of steps) {
        let matchingAncestorRelationshipPart: TypeMatcherRulePart;
        let thisLevelPart: TypeMatcherRulePart;

        if ('$element' in currentStep) {
            matchingAncestorRelationshipPart =
                element(previousLevelPart);
            thisLevelPart = flatten(currentStep.$element);
        } else if ('$property' in currentStep) {
            matchingAncestorRelationshipPart = propertyOf(
                currentStep.propertyName,
                previousLevelPart,
            );
            thisLevelPart = flatten(currentStep.$property);
        } else if ('$descendent' in currentStep) {
            matchingAncestorRelationshipPart =
                ancestor(previousLevelPart);
            thisLevelPart = flatten(currentStep.$descendent);
        } else {
            throw new TypeError('Unexpected');
        }

        previousLevelPart = and([
            matchingAncestorRelationshipPart,
            thisLevelPart,
        ]);
    }

    return previousLevelPart;
}

function flatten(
    items: TypeMatcherRulePart | TypeMatcherRulePart[],
): TypeMatcherRulePart {
    return Array.isArray(items) ? and(items) : items;
}
