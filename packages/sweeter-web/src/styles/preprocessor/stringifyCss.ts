import type { AstNode } from './types.js';

export function stringifyCss(ast: AstNode[]) {
    const result: string[] = [];
    stringifyImpl(ast, result, '');
    return result.join('');
}

const oneTab = '    ';

export function stringifyImpl(ast: AstNode[], result: string[], space: string) {
    for (const item of ast) {
        switch (item.$nodeType) {
            case 'at':
                result.push(space, '@', item.type);
                if (item.parameters) {
                    result.push(' ', item.parameters);
                }
                if (item.nestedRules || item.properties) {
                    result.push(' {\n');
                    if (item.nestedRules) {
                        stringifyImpl(item.nestedRules, result, space + oneTab);
                    }
                    if (item.properties) {
                        stringifyImpl(item.properties, result, space + oneTab);
                    }
                    result.push(space, '}\n');
                } else {
                    result.push(';\n');
                }
                break;

            case 'rule':
                result.push(space);
                for (let i = 0; i < item.selectors.length; ++i) {
                    if (i !== 0) {
                        result.push(', ');
                    }
                    result.push(item.selectors[i]!);
                }
                result.push(' {\n');
                stringifyImpl(item.properties, result, space + oneTab);
                result.push(space, '}\n');
                break;

            case 'property':
                result.push(space, item.name, ': ', item.value, ';\n');
                break;
        }
    }
}
