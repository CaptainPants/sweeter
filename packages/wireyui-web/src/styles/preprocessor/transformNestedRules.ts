import { assertNeverNullish } from '@captainpants/wireyui-core';
import { splitByUnparenthesizedCommas } from './internal/splitByUnparenthesizedCommas.js';
import { type AtRuleAstNode, type RuleOrAtRule } from './types.js';

export function transformNestedRules(ast: RuleOrAtRule[]): RuleOrAtRule[] {
    const result: RuleOrAtRule[] = [];

    for (const item of ast) {
        transform([], item, result);
    }

    return result;
}

export function transform(
    selectors: string[],
    item: RuleOrAtRule,
    roots: RuleOrAtRule[],
): void {
    // Note that this should only happen at the root
    if (item.$nodeType === 'at') {
        const newNode: AtRuleAstNode = {
            $nodeType: 'at',
            type: item.type,
            parameters: item.parameters,
        };

        if (item.body && item.body.length > 0) {
            const body: RuleOrAtRule[] = [];
            for (const childItem of item.body) {
                transform([], childItem, body);
            }
            item.body = body;
        }

        roots.push(newNode);
        return;
    }

    const newSelectors = [...selectors, item.selector];

    // Add a node to contain the properties in this (possibly nested) node
    if (item.properties.length > 0) {
        roots.push({
            $nodeType: 'rule',
            selector: permutations(newSelectors),
            nestedRules: [],
            properties: item.properties,
        });
    }

    if (item.nestedRules) {
        for (const nestedRule of item.nestedRules) {
            transform(newSelectors, nestedRule, roots);
        }
    }
}

function permutations(parts: string[]): string {
    const results = [...generatePermutations(undefined, parts, 0)];
    return results.join(', ');
}

function* generatePermutations(
    compiledParentSelector: string | undefined,
    parts: string[],
    offset: number,
): Generator<string> {
    if (offset >= parts.length) {
        assertNeverNullish(compiledParentSelector);
        yield compiledParentSelector;
        return;
    }

    const firstPart = parts[offset]!;
    const split = splitByUnparenthesizedCommas(firstPart);

    for (const current of split) {
        const selector = compiledParentSelector
            ? current.includes('&')
                ? current.replace('&', compiledParentSelector)
                : compiledParentSelector + ' ' + current
            : current;

        for (const next of generatePermutations(selector, parts, offset + 1)) {
            yield next;
        }
    }
}
