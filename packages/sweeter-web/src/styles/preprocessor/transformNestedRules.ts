import {
    type AtRuleAstNode,
    type RuleAstNode,
    type RuleOrAtRule,
} from './types.js';

export function transformNestedRules(nodes: RuleOrAtRule[]): RuleOrAtRule[] {
    const result: RuleOrAtRule[] = [];

    transformMany(undefined, nodes, result, result);

    return result;
}

export function transformMany(
    parentSelectors: string[] | undefined,
    nodes: RuleOrAtRule[],
    currentRootOrAtRuleNestedNodes: RuleOrAtRule[],
    roots: RuleOrAtRule[],
): boolean {
    let anyProperties = false;

    for (const node of nodes) {
        const thisTime = transformOne(
            parentSelectors,
            node,
            currentRootOrAtRuleNestedNodes,
            roots,
        );
        anyProperties ||= thisTime;
    }

    return anyProperties;
}

export function transformOne(
    parentSelectors: string[] | undefined,
    node: RuleOrAtRule,
    currentRootOrAtRuleNestedNodes: RuleOrAtRule[],
    roots: RuleOrAtRule[],
): boolean {
    let anyProperties = false;

    if (node.$nodeType == 'at') {
        if (node.type == 'root') {
            // @root {  } basically resets & to nothing so you can write root rules within another rule for convenience
            if (node.nestedRules) {
                const thisTime = transformMany(
                    undefined,
                    node.nestedRules,
                    roots, // reset the currentRootOrAtRuleNestedNodes value for child nodes
                    roots,
                );
                anyProperties ||= thisTime;
            }

            // Properties don't make any sense here
        } else {
            // Create a new @ node
            const cloneChildren: RuleOrAtRule[] = [];
            const clone: AtRuleAstNode = {
                $nodeType: 'at',
                type: node.type,
                parameters: node.parameters,
                nestedRules: cloneChildren,
            };

            if (node.nestedRules) {
                const thisTime = transformMany(
                    parentSelectors,
                    node.nestedRules,
                    cloneChildren,
                    roots,
                );
                anyProperties ||= thisTime;
            }

            if (
                node.properties &&
                node.properties.length > 0 &&
                parentSelectors
            ) {
                cloneChildren.push({
                    $nodeType: 'rule',
                    selectors: parentSelectors,
                    properties: node.properties,
                    nestedRules: [],
                });
                anyProperties = true;
            }

            if (anyProperties) {
                currentRootOrAtRuleNestedNodes.push(clone);
            }
        }
    } else {
        const selectors = combineSelectors(parentSelectors, node.selectors);

        if (node.properties && node.properties.length > 0) {
            const newNode: RuleAstNode = {
                $nodeType: 'rule',
                selectors: selectors,
                properties: node.properties,
                nestedRules: [],
            };

            currentRootOrAtRuleNestedNodes.push(newNode);

            anyProperties = true;
        }

        if (node.nestedRules && node.nestedRules.length > 0) {
            const thisTime = transformMany(
                selectors,
                node.nestedRules,
                currentRootOrAtRuleNestedNodes,
                roots,
            );
            anyProperties ||= thisTime;
        }
    }

    return anyProperties;
}

function combineSelectors(
    parentSelectors: string[] | undefined,
    selectors: string[],
): string[] {
    if (parentSelectors) {
        const result: string[] = [];

        // if :is() is supported, we don't need to have an N^2 here, which leads
        // to N^M complexity (with M being the depth of nest). We can just do:
        // is(<parentSelector>) childSelector. This will break using & to make a
        // new selector though.
        for (const outerSelector of parentSelectors) {
            for (const innerSelector of selectors) {
                const selector = outerSelector
                    ? innerSelector.includes('&')
                        ? innerSelector.replaceAll('&', outerSelector)
                        : outerSelector + ' ' + innerSelector
                    : innerSelector;

                result.push(selector);
            }
        }

        return result;
    } else {
        return selectors;
    }
}
