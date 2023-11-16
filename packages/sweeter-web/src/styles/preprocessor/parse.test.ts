import { parse } from './parse.js';

it('empty single rule', () => {
    const content = `
        .banana {
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('single rule with one property', () => {
    const content = `
        .banana {
            color: red;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('single rule with one property and nested rule', () => {
    const content = `
        .banana {
            color: red;

            .nested {
                color: green;
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('single rule with no property and nested rule with one property', () => {
    const content = `
        .banana {
            .nested {
                color: green;
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('media query', () => {
    const content = `
        @media screen and (max-width: 992px) {
            .banana {
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});
