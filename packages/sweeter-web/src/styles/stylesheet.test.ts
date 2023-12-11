import type { StylesheetGenerator } from './types.js';
import { GlobalCssClass } from './GlobalCssClass.js';
import { stylesheet } from './stylesheet.js';
import { GlobalCssMarkerClass } from './GlobalCssMarkerClass.js';

function evaluate(thing: StylesheetGenerator) {
    return thing({ getPrefixedClassName: (class_) => class_.className });
}

it('General', () => {
    expect(
        evaluate(
            stylesheet`.${new GlobalCssMarkerClass({
                className: 'Test',
            })} { color: blue; }`,
        ),
    ).toStrictEqual('.Test { color: blue; }');
    expect(
        evaluate(
            stylesheet`.${new GlobalCssClass({
                className: 'WithContent',
                content: 'nothing important',
            })} { color: blue; }`,
        ),
    ).toStrictEqual('.WithContent { color: blue; }');
    expect(
        evaluate(
            stylesheet`.${new GlobalCssMarkerClass({
                className: 'Hovered',
            })}:hover { color: blue; }`,
        ),
    ).toStrictEqual('.Hovered:hover { color: blue; }');
    expect(
        evaluate(
            stylesheet`.A {} .${new GlobalCssMarkerClass({
                className: 'NotAtStart',
            })} { color: blue; }`,
        ),
    ).toStrictEqual('.A {} .NotAtStart { color: blue; }');
});
