import type * as types from './types.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        /**
         * Props that apply to all elements.
         */
        type IntrinsicAttributes = types.JSXIntrinsicAttributes;

        /**
         * This tells typescript what property to use for children.
         */
        interface ElementChildrenAttribute {
            // eslint-disable-next-line  @typescript-eslint/no-empty-object-type -- This is the structure required for JSX.ElementChildrenAttribute
            children: {}; // specify children name to use
        }

        /**
         * Extended by declaration merging into IntrinsicElementNames.
         */
        type IntrinsicElements = types.JSXIntrinsicElements;

        /** JSX Element */
        type Element = types.JSXElement;
    }
}
