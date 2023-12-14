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
        content: (self) =>
            stylesheet`.NestedOnce { .${self} { color: green; } }`,
    });

    expect(
        class_.getContent({
            getPrefixedClassName: (class_) => class_.className,
        }),
    ).toMatchSnapshot();
});

it('Nested media query', () => {
    const class_ = new GlobalCssClass({
        className: 'test',
        content: () =>
            stylesheet`
                @media screen and (min-width: 200px) {
                    padding-left: var(--property);
                    width: 50%;
                }
            `,
    });

    const output = class_.getContent({
        getPrefixedClassName: (class_) => class_.className,
    });

    expect(output).toMatchSnapshot();
});

it('Nested media query - complex', () => {
    const class_ = new GlobalCssClass({
        className: 'test',
        content: () =>
            stylesheet`
                @media screen and (min-width: 200px) {
                    div {
                        @supports(& .banana) {
                            padding-left: var(--property);
                            width: 50%;
                        }
                    }
                }
            `,
    });

    const output = class_.getContent({
        getPrefixedClassName: (class_) => class_.className,
    });

    expect(output).toMatchSnapshot();
});

it('Complex', () => {
    const class_ = new GlobalCssClass({
        className: 'test',
        content: () =>
            stylesheet`
                @media screen and (min-width: 200px) {
                    .banana .cheese {
                        @supports(& .banana) {
                            .something1, .something2.alternative:hover {
                                padding-left: var(--property);
                                width: 50%;
                            }
                        }
                    }

                    &-also {
                        color: red;
                    }
                }
            `,
    });

    const output = class_.getContent({
        getPrefixedClassName: (class_) => class_.className,
    });

    expect(output).toMatchSnapshot();
});

it('@root', () => {
    const class_ = new GlobalCssClass({
        className: 'test',
        content: () =>
            stylesheet`
                div {
                    color: green;

                    span.cheese {
                        color: blue;
                    }

                    @root {
                        span.cheese {
                            color: red;
                        }
                    }
                }
            `,
    });

    const output = class_.getContent({
        getPrefixedClassName: (class_) => class_.className,
    });

    expect(output).toMatchSnapshot();
});
