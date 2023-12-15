import { parse } from './parse.js';

it('Missing semicolon on last property', () => {
    const content = `
        .banana {
            color: red
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});
