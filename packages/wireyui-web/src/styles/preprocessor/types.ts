/**
 * Doesn't give access to the broken apart contents as we don't care
 */
export interface PropertyAstNode {
    $type: 'property';
    content: string;
}

export interface AtRuleAstNode {
    $type: 'at';
    name: string;
    parameters?: string; // E.g. (media) or "utf-8"
    body?: RuleOrAtRule[];
}

export interface RuleAstNode {
    $type: 'rule';
    selectors: string[];
    body: NestedRuleOrProperty[];
}

export type RuleOrAtRule = AtRuleAstNode | RuleAstNode;
export type NestedRuleOrProperty = PropertyAstNode | RuleAstNode;
