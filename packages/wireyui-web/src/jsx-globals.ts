import { JSXElement } from '@captainpants/wireyui-core';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            div: { id?: string | undefined; children?: JSXElement };
            cored: { banana: number };
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface ElementAlternatives {
            'wireyui-web': HTMLElement | SVGElement;
        }
    }
}
