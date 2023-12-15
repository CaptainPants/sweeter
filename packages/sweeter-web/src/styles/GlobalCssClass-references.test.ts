import { GlobalCssClass } from './GlobalCssClass.js';
import { getTransitiveReferences } from './internal/getTransitiveReferences.js';
import { stylesheet } from './stylesheet.js';

it('Self reference', () => {
    const classA = new GlobalCssClass({
        className: 'test',
        content: (self) => {
            return stylesheet`
                color: green;

                .root .${self} {
                    color: red;
                }

                & .root & {
                    color: blue;
                }

                & .root & .${self} {
                    color: orange;
                }

                .inner {
                    .${self} {
                        color: rebeccapurple;
                    }
                }
            `;
        },
    });

    const content = classA.getContent({
        getPrefixedClassName: (class_) => class_.className,
    });

    expect(content).toMatchSnapshot();
});

it('Reference to another class', () => {
    const classA = new GlobalCssClass({
        className: 'a',
        content: (self) => {
            return stylesheet`
                color: red;
            `;
        },
    });

    const classB = new GlobalCssClass({
        className: 'b',
        content: () => {
            return stylesheet`
                color: green;

                .${classA} {
                    color: blue;
                }
            `;
        },
    });

    const content = classB.getContent({
        getPrefixedClassName: (class_) => class_.className,
    });

    expect(content).toMatchSnapshot();

    expect(getTransitiveReferences(classB)).toStrictEqual([classB, classA]);
});

it('Transitive reference to a 3rd class', () => {
    const classA = new GlobalCssClass({
        className: 'a',
        content: (self) => {
            return stylesheet`
                color: red;
            `;
        },
    });

    const classB = new GlobalCssClass({
        className: 'b',
        content: () => {
            return stylesheet`
                color: green;

                .${classA} {
                    color: blue;
                }
            `;
        },
    });

    const classC = new GlobalCssClass({
        className: 'b',
        content: () => {
            return stylesheet`
                color: yellow;

                .${classB} {
                    color: rebeccapurple;
                }
            `;
        },
    });

    const content = classC.getContent({
        getPrefixedClassName: (class_) => class_.className,
    });

    expect(content).toMatchSnapshot();

    expect(getTransitiveReferences(classC)).toStrictEqual([
        classC,
        classB,
        classA,
    ]);
});
