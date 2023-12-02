import { assertNeverNullish } from '@captainpants/sweeter-core';
import {
    type RuleAstNode,
    type AtRuleAstNode,
    type RuleOrAtRule,
} from './types.js';

export function transformNestedRules(ast: RuleOrAtRule[]): RuleOrAtRule[] {
    const result: RuleOrAtRule[] = [];

    for (const item of ast) {
        transform([], item, result);
    }

    return result;
}

export function transform(
    path: RuleAstNode[],
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

    const newSelectors = [...path, item];

    // Add a node to contain the properties in this (possibly nested) node
    if (item.properties.length > 0) {
        roots.push({
            $nodeType: 'rule',
            selectors: [expandSelectorsForPath(newSelectors)],
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

function expandSelectorsForPath(nodePath: RuleAstNode[]): string {
    const results = [
        ...expandSelectorsForPathImplementation(undefined, nodePath, 0),
    ];
    return results.join(', ');
}

function* expandSelectorsForPathImplementation(
    compiledParentSelector: string | undefined,
    nodePath: RuleAstNode[],
    nodePathIndex: number,
): Generator<string> {
    if (nodePathIndex >= nodePath.length) {
        assertNeverNullish(compiledParentSelector);
        yield compiledParentSelector;
        return;
    }

    const firstPart = nodePath[nodePathIndex]!;

    for (const current of firstPart.selectors) {
        const selector = compiledParentSelector
            ? current.includes('&')
                ? current.replace('&', compiledParentSelector)
                : compiledParentSelector + ' ' + current
            : current;

        for (const next of expandSelectorsForPathImplementation(
            selector,
            nodePath,
            nodePathIndex + 1,
        )) {
            yield next;
        }
    }
}
