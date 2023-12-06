import { type StylesheetGenerator } from './types.js';
import { type GlobalCssClass } from './GlobalCssClass.js';

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
    ...params: (GlobalCssClass | StylesheetGenerator | string)[]
): StylesheetGenerator {
    return (context) => {
        const res: string[] = [];
        const last = template.length - 1;
        for (let i = 0; i < template.length; ++i) {
            res.push(template[i]!);

            if (i !== last) {
                const param = params[i]!;

                if (typeof param === 'string') {
                    res.push(param);
                } else if (typeof param === 'function') {
                    res.push(param(context));
                } else {
                    res.push('.');
                    res.push(context.getPrefixedClassName(param));
                }
            }
        }
        return res.join('');
    };
}
