import { parse } from './parse.js';
import { transformNestedRules } from './transformNestedRules.js';

it('test1', () => {
    const input = `
        .outer1 {
            .inner1 {
                color: red;
            }
        }
    `;

    const parsed = parse(input);

    expect(parsed).toMatchSnapshot();

    const transformed = transformNestedRules(parsed);

    expect(transformed).toMatchSnapshot();
});

it('test2', () => {
    const input = `
        .outer1, .outer2 {
            .inner1, .inner2 {
                color: red;
            }
        }
    `;

    const parsed = parse(input);

    expect(parsed).toMatchSnapshot();

    const transformed = transformNestedRules(parsed);

    expect(transformed).toMatchSnapshot();
});

it('test3', () => {
    const input = `
        .outer1, .outer2 {
            color: blue;

            .inner1, .inner2 {
                color: red;
            }
        }
    `;

    const parsed = parse(input);

    expect(parsed).toMatchSnapshot();

    const transformed = transformNestedRules(parsed);

    expect(transformed).toMatchSnapshot();
});

it('complex selectors', () => {
    const input = `
        .outer1, .outer2 {
            color: blue;

            .inner1, .inner2 {
                color: red;
            }
        }
    `;

    const parsed = parse(input);

    expect(parsed).toMatchSnapshot();

    const transformed = transformNestedRules(parsed);

    expect(transformed).toMatchSnapshot();
});
