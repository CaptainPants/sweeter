import { stylesheet } from './stylesheet.js';
import { GlobalCssClass } from './GlobalCssClass.js';

it('Common case produces sensible result', () => {
    const class_ = new GlobalCssClass({
        className: 'test',
        content: `
            color: white;
            background: black;
        `,
    });

    expect(
        class_.getContent({
            getPrefixedClassName: (class_) => class_.className,
        }),
    ).toMatchSnapshot();
});

it('Self referential', () => {
    const class_ = new GlobalCssClass({
        className: 'test',
        content: (self) => stylesheet`.NestedOnce { ${self} { color: green; } }`,
    });

    expect(
        class_.getContent({
            getPrefixedClassName: (class_) => class_.className,
        }),
    ).toMatchSnapshot();
});
