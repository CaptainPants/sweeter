import { assertNeverNullish } from '@captainpants/sweeter-core';
import {
    type RuleAstNode,
    type AtRuleAstNode,
    type RuleOrAtRule,
    type PropertyAstNode,
} from './types.js';

export function transformNestedRules(ast: RuleOrAtRule[]): RuleOrAtRule[] {
    const result: RuleOrAtRule[] = [];

    for (const item of ast) {
        transform([], [], item, result);
    }

    return result;
}

export function transform(
    atRulePath: AtRuleAstNode[],
    rulePath: RuleAstNode[],
    item: RuleOrAtRule,
    roots: RuleOrAtRule[],
): void {
    // TODO: optimise for @ rule containing regular rules - currently there is a clone of the @ rule for each

    if (item.$nodeType == 'at' && item.type == 'root') { // @root {  } basically rests & to nothing so you can write root rules within another rule for convenience
        if (item.nestedRules) {
            for (const inner of item.nestedRules) {
                transform([], [], inner, roots);
            }
        }
        return;
    }

    const newAtRulePath =
        item.$nodeType == 'at' ? [...atRulePath, item] : atRulePath;
    const newRulePath =
        item.$nodeType == 'rule' ? [...rulePath, item] : rulePath;

    // Add a node to contain the properties in this (possibly nested) node
    if (item.properties && item.properties.length > 0) {
        roots.push(createRuleFor(newAtRulePath, newRulePath, item.properties));
    }

    if (item.nestedRules) {
        for (const nestedRule of item.nestedRules) {
            transform(newAtRulePath, newRulePath, nestedRule, roots);
        }
    }
}

function createRuleFor(
    atRulePath: AtRuleAstNode[],
    rulePath: RuleAstNode[],
    properties: PropertyAstNode[] | undefined,
): RuleOrAtRule {
    let result: RuleOrAtRule = {
        $nodeType: 'rule',
        selectors: [expandSelectorsForPath(rulePath)],
        nestedRules: [],
        properties: properties ?? [],
    };

    // Wrap all @ rules around the rule
    for (let i = atRulePath.length - 1; i >= 0; --i) {
        const source = atRulePath[i]!;

        result = {
            $nodeType: 'at',
            type: source.type,
            parameters: source.parameters,
            nestedRules: [result],
        };
    }

    return result;
}

function expandSelectorsForPath(nodePath: RuleAstNode[]): string {
    const results: string[] = [];
    expandSelectorsForPathImplementation(undefined, nodePath, 0, results);
    return results.join(', ');
}

function expandSelectorsForPathImplementation(
    compiledParentSelector: string | undefined,
    nodePath: RuleAstNode[],
    nodePathIndex: number,
    output: string[],
): void {
    if (nodePathIndex >= nodePath.length) {
        assertNeverNullish(compiledParentSelector);
        output.push(compiledParentSelector);
        return;
    }

    const firstPart = nodePath[nodePathIndex]!;

    for (const current of firstPart.selectors) {
        const selector = compiledParentSelector
            ? current.includes('&')
                ? current.replace('&', compiledParentSelector)
                : compiledParentSelector + ' ' + current
            : current;

        expandSelectorsForPathImplementation(
            selector,
            nodePath,
            nodePathIndex + 1,
            output,
        );
    }
}
