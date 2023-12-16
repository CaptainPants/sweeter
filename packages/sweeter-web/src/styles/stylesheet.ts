import {
    type AbstractGlobalCssStylesheet,
    type GlobalStyleSheetContentGeneratorContext,
    type AbstractGlobalCssClass,
    type StylesheetGenerator,
} from './types.js';
import { GlobalCssClass } from './GlobalCssClass.js';

type ParamType =
    | AbstractGlobalCssClass
    | StylesheetGenerator
    | string
    | number
    | string
    | ParamType[];

/**
 * Template string function.
 *
 * Creates a StylesheetGenerator based on a templated string, where you can use GlobalCssClass references in style selectors.
 * @param template
 * @param params
 * @returns
 */
export function stylesheet(
    template: TemplateStringsArray,
    ...params: ParamType[]
): StylesheetGenerator {
    const result: StylesheetGenerator = (context) => {
        const res: string[] = [];
        const last = template.length - 1;
        for (let i = 0; i < template.length; ++i) {
            res.push(template[i]!);

            if (i !== last) {
                const param = params[i]!;

                processParam(param, res, context);
            }
        }
        return res.join('');
    };

    const references: AbstractGlobalCssStylesheet[] = [];
    for (const param of params) {
        if (param instanceof GlobalCssClass) {
            references.push(param);
        } else if (typeof param === 'function') {
            references.push(...param.references);
        }
    }
    result.references = references;

    return result;
}
function processParam(
    param: ParamType,
    res: string[],
    context: GlobalStyleSheetContentGeneratorContext,
): void {
    if (Array.isArray(param)) {
        for (const item of param) {
            processParam(item, res, context);
        }
    } else if (typeof param === 'number') {
        res.push(String(param));
    } else if (typeof param === 'string') {
        res.push(param);
    } else if (typeof param === 'function') {
        res.push(param(context));
    } else {
        res.push(context.getPrefixedClassName(param));
    }
}
