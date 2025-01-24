/**
 * Doesn't give access to the broken apart contents as we don't care
 */
export interface PropertyAstNode {
    $nodeType: 'property';
    name: string;
    value: string;
}

export interface AtRuleAstNode {
    $nodeType: 'at';
    type: string;
    parameters?: string | undefined; // E.g. @media (xxxxx) or @charset "utf-8"

    nestedRules?: RuleOrAtRule[] | undefined;
    properties?: PropertyAstNode[] | undefined;
}

export interface RuleAstNode {
    $nodeType: 'rule';
    selectors: string[];

    nestedRules: RuleOrAtRule[];
    properties: PropertyAstNode[];
}

export interface RuleBodyParts {
    nestedRules: RuleOrAtRule[];
    properties: PropertyAstNode[];
}

export type RuleOrAtRule = AtRuleAstNode | RuleAstNode;
export type AstNode = AtRuleAstNode | RuleAstNode | PropertyAstNode;
