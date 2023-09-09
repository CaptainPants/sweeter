import * as types from './types.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicAttributes {
            readonly key?: types.JSXKey | undefined;
        }

        interface ElementChildrenAttribute {
            // eslint-disable-next-line @typescript-eslint/ban-types
            children: {}; // specify children name to use
        }

        /**
         * This is not standard. I am hoping that by structuring in this way we
         * can use declaration merging to extend the definition of Element.
         */
        interface ElementAlternatives { 
            "wireyui-core": number | string | boolean | null | undefined;
        }

        interface IntrinsicElements {
            core: { banana: number };
        }

        type Element = ElementAlternatives[keyof ElementAlternatives] | Element[];
    }
}
