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
    if (item.$type === 'at') {
        const newNode: AtRuleAstNode = {
            $type: 'at',
            text: item.text,
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
            $type: 'rule',
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
    const results = [...generatePermutations(parts)];
    return results.join(', ');
}

function* generatePermutations(parts: string[]): Generator<string> {
    if (parts.length === 0) {
        return;
    }

    const firstPart = parts[0]!;

    const split = splitByUnparenthesizedCommas(firstPart);
    if (parts.length === 1) {
        for (const current of split) {
            yield current;
        }
    }

    for (const current of split) {
        for (const next of generatePermutations(parts.slice(1))) {
            yield current + ' ' + next;
        }
    }
}
