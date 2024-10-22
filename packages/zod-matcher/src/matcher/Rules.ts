import z from 'zod';
import { type TypeInfo } from '../models/parents.js';

import {
    type MatcherContext,
    type Selector,
    type TypeMatcherRulePart,
} from './types.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rules {
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

    export function type(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: z.ZodType,
    ): TypeMatcherRulePart {
        return {
            type: 'type',
            schema,
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
                    Rules.element(previousLevelPart);
                thisLevelPart = flatten(currentStep.$element);
            } else if ('$property' in currentStep) {
                matchingAncestorRelationshipPart = Rules.propertyOf(
                    currentStep.propertyName,
                    previousLevelPart,
                );
                thisLevelPart = flatten(currentStep.$property);
            } else if ('$descendent' in currentStep) {
                matchingAncestorRelationshipPart =
                    Rules.ancestor(previousLevelPart);
                thisLevelPart = flatten(currentStep.$descendent);
            } else {
                throw new TypeError('Unexpected');
            }

            previousLevelPart = Rules.and([
                matchingAncestorRelationshipPart,
                thisLevelPart,
            ]);
        }

        return previousLevelPart;
    }
}

function flatten(
    items: TypeMatcherRulePart | TypeMatcherRulePart[],
): TypeMatcherRulePart {
    return Array.isArray(items) ? Rules.and(items) : items;
}
