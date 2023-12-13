import { parse } from './parse.js';

it('with alternatives', () => {
    const content = `
        .something1, .something2.alternative:hover {
            padding-left: var(--property);
            width: 50%;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('with alternatives in a not', () => {
    const content = `
        .something1, .something2:not(a, b) {
            padding-left: var(--property);
            width: 50%;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('quoted comma', () => {
    const content = `
        .a[test=","] {
            padding-left: var(--property);
            width: 50%;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('complex', () => {
    const content = `
        .a[test=","]:hover > test banana {
            padding-left: var(--property);
            width: 50%;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});