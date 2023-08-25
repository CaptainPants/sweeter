import * as types from './types.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        type Element = types.JSXElement;
        type IntrinsicAttributes = types.IntrinsicAttributes;

        interface ElementChildrenAttribute {
            // eslint-disable-next-line @typescript-eslint/ban-types
            children: {}; // specify children name to use
        }
    }
}
