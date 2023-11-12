import { splitByUnparenthesizedCommas } from './internal/splitByUnparenthesizedCommas.js';
import { type AtRuleAstNode, type RuleOrAtRule } from './types.js';

export function transformNestedRules(ast: RuleOrAtRule[]): RuleOrAtRule[] {
    const result: RuleOrAtRule[] = [];

    for (const item of ast) {
        transform(undefined, item, result);
    }

    return result;
}

export function transform(
    selector: string | undefined,
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
                transform(undefined, childItem, body);
            }
            item.body = body;
        }

        roots.push(newNode);
        return;
    }

    const selectorParts = splitByUnparenthesizedCommas(item.selector);

    // Add a node to contain the properties in this (possibly nested) node
    if (item.properties.length > 0) {
        if (!selector) {
            throw new Error('This is probably a bug');
        }

        for (const part of selectorParts) {
            roots.push({
                $type: 'rule',
                selector: combineSelector(selector, part),
                nestedRules: [],
                properties: item.properties,
            });
        }
    }

    if (item.nestedRules) {
        for (const part of selectorParts) {
            for (const nestedRule of item.nestedRules) {
                // E.g. .class1, .class2, :not(.class3) will have 3 elements
                transform(combineSelector(selector, part), nestedRule, roots);
            }
        }
    }
}

function combineSelector(
    parentSelector: string | undefined,
    selector: string,
): string {
    if (parentSelector) return `${parentSelector} ${selector}`;
    return selector;
}
