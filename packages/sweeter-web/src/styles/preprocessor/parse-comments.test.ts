import { parse } from './parse.js';

it('single line comment at top level', () => {
    const content = `
        // comment
        body {
            color: red;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('multi line comment at top level', () => {
    const content = `
        /*
        this is pretty cool
        */
        body {
            color: red;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('single line comment inside rule', () => {
    const content = `
        body {
            // comment
            color: red;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('multi line comment inside rule', () => {
    const content = `
        body {
            /*
            this is pretty cool
            */
            color: red;
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('single line comment outside @rule', () => {
    const content = `
        // comment
        @media screen {
            body {
                color: red;
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('multi line comment outside @rule', () => {
    const content = `
        /*
        this is pretty cool
        */
        @media screen {
            body {
                color: red;
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('single line comment inside @rule', () => {
    const content = `
        @media screen {
            // comment
            body {
                color: red;
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});

it('multi line comment inside @rule', () => {
    const content = `
        @media screen {
            /*
            this is pretty cool
            */
            body {
                color: red;
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});