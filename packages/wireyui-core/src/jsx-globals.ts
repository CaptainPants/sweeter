import type { Signal } from './signals/types.js';
import type * as types from './types.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        /**
         * Props that apply to all elements.
         */
        interface IntrinsicAttributes {
            readonly key?: types.JSXKey | undefined;
        }

        /**
         * This tells typescript what property to use for children.
         */
        interface ElementChildrenAttribute {
            // eslint-disable-next-line @typescript-eslint/ban-types
            children: {}; // specify children name to use
        }

        /**
         * Extended by declaration merging into IntrinsicElementNamesParts.
         */
        type IntrinsicElements = {
            [Key in WireyExtensionPoints.IntrinsicElementNamesParts[keyof WireyExtensionPoints.IntrinsicElementNamesParts] &
                string]: types.IntrinsicElementProps<Key>;
        };

        /** JSX Element */
        type Element = types.IntrinsicElement | Signal<Element> | Element[];
    }
}
