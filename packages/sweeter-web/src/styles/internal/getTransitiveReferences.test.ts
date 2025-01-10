import { GlobalCssClass } from '../GlobalCssClass.js';
import { stylesheet } from '../stylesheet.js';

import { getTransitiveReferences } from './getTransitiveReferences.js';

it('Transitive references work', () => {
    const classA = new GlobalCssClass({
        className: 'a',
        content: (_self) => {
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

    const referenced = getTransitiveReferences(classC);

    expect(referenced).toStrictEqual([classC, classB, classA]);
});
