import { GlobalCssClass, stylesheet } from "@captainpants/sweeter-web";
import { createConstantMap } from '../internal/createConstantMap.js';

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const box = createConstantMap(
    keys.map(item => `_${item}` as const),
    (elevation, index) => {
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
            `
        });
    }
);
