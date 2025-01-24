import { parse, transformNestedRules } from './index.js';

it('Nested media query implicitly adds parent selector', () => {
    const parsed = parse(`
        .banana {
            @media screen {
                color: red;
            }
        }
    `);

    const transformed = transformNestedRules(parsed);

    expect(transformed).toMatchSnapshot();
});

it('Normal @ rule nesting', () => {
    const content = `
        @media screen {
            @media (max-width: 200px) {
                a {
                    color: green;
                }

                b {
                    color: green;
                }
            }

            div {
                color: rebeccapurple;

                @media (min-width: 200px) {
                    background: grey;
                }
            }
        }
    `;

    const parsed = parse(content);

    const transformed = transformNestedRules(parsed);

    expect(transformed).toMatchSnapshot();
});
