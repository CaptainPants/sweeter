import { GlobalCssClass, } from "./GlobalCssClass.js";
import { GlobalCssStylesheet } from "./GlobalCssStylesheet.js";
import { StylesheetDependencyProvider } from "./StylesheetDependencyProvider.js";
import { stylesheet } from "./stylesheet.js";

it('Circular dependency works', () => {
    const dependencies = new StylesheetDependencyProvider();

    const sheet = new GlobalCssStylesheet({
        id: 'sheet',
        content: `
            cls {
                color: blue;
            }
        `,
        extraDependencies: dependencies
    });

    const a = new GlobalCssClass({
        className: 'a',
        content: () => stylesheet`
            .check {
                color: green;
            }
        `
    });

    dependencies.addDependency(a);

    expect(sheet.getReferencedStylesheets()).toStrictEqual([a]);
});