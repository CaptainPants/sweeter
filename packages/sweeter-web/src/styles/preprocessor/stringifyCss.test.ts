import { stringifyCss } from './stringifyCss.js';
import { parse } from './parse.js';

it('stringify 1', () => {
    const css = `
        .test { 
            color: green;
        }
    `;

    const parsed = parse(css);

    const returned = stringifyCss(parsed);

    expect(returned).toMatchSnapshot();
});

it('stringify 2', () => {
    const css = `
        @media (screen) {
            .test { 
                color: green;
            }
            #some_id { 
                background-color: green;
            }
            body { 
                background-color: green;
            }
        }
    `;

    const parsed = parse(css);

    const returned = stringifyCss(parsed);

    expect(returned).toMatchSnapshot();
});
