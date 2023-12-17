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

it('Normal @ rule nesting', () => {
    const content = `
        @media screen {
            @media (max-width: 200px) and screen {
                a {
                    color: green;
                }

                b {
                    color: green;
                }
            }

            div {
                color: rebeccapurple;
            }
        }
    `;

    const ast = parse(content);

    expect(ast).toMatchSnapshot();
});
