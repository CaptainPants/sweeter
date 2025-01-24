import { GlobalCssClass, stylesheet } from '@serpentis/ptolemy-web';

import { createConstantMap } from '../internal/createConstantMap.js';

const keys = [
    '_1',
    '_2',
    '_3',
    '_4',
    '_5',
    '_6',
    '_7',
    '_8',
    '_9',
    '_10',
    '_11',
    '_12',
] as const;

export const box = createConstantMap(keys, (elevation, index) => {
    const percentage = Math.min(Math.max(index, 0), 11) / 12.0;
    const back = (10 + percentage * 40).toFixed(2);
    const border = (25 + percentage * 40).toFixed(2);

    return new GlobalCssClass({
        className: `box-${elevation}`,
        content: stylesheet`
                padding: 5px;
                border-radius: 2px;
                background-color: rgb(${back}, ${back}, ${back});
                border: rgb(${border}, ${border}, ${border}) solid 1px;
            `,
    });
});
