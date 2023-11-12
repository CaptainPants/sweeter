/**
 * Doesn't give access to the broken apart contents as we don't care
 */
export interface PropertyAstNode {
    $type: 'property';
    text: string;
}

export interface AtRuleAstNode {
    $type: 'at';
    text: string; // E.g. @media (xxxxx) or @charset "utf-8"
    body?: RuleOrAtRule[];
}

export interface RuleAstNode {
    $type: 'rule';
    selector: string;
    nestedRules: RuleAstNode[];
    properties: PropertyAstNode[];
}

export interface RuleBodyParts {
    nestedRules: RuleAstNode[];
    properties: PropertyAstNode[];
}

export type RuleOrAtRule = AtRuleAstNode | RuleAstNode;
