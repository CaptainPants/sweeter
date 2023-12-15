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
