import { parse, parseClassContent } from './parse.js';
import { stringifyCss } from './stringifyCss.js';
import { transformNestedRules } from './transformNestedRules.js';
import { type RuleAstNode } from './types.js';

export function preprocess(css: string) {
    const parsed = parse(css);
    const transformed = transformNestedRules(parsed);
    const result = stringifyCss(transformed);
    return result;
}

export function preprocessClassContent(className: string, css: string) {
    const parsed = parseClassContent(css);

    // virtual root node
    const cssClass: RuleAstNode = {
        $nodeType: 'rule',
        nestedRules: parsed.nestedRules,
        properties: parsed.properties,
        selectors: ['.' + className],
    };

    const transformed = transformNestedRules([cssClass]);
    const result = stringifyCss(transformed);
    return result;
}
