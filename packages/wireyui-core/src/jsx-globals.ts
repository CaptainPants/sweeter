import { Signal } from './index.js';
import * as types from './types.js';

/**
 * Borrowed from https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I,
) => void
    ? I
    : never;

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
         * Use this to extend IntrinsicElementAttributes.
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface IntrinsicElementAttributeParts<TElementType extends string> {}

        /**
         * Extended by declaration merging into IntrinsicElementAttributeParts.
         */
        type IntrinsicElementAttributes<TElementType extends string> =
            UnionToIntersection<
                IntrinsicElementAttributeParts<TElementType>[keyof IntrinsicElementAttributeParts<TElementType>]
            >;

        interface ElementChildrenAttribute {
            // eslint-disable-next-line @typescript-eslint/ban-types
            children: {}; // specify children name to use
        }

        /**
         * Use this to add to the Element union.
         */
        interface ElementPossibilityParts {
            'wireyui-core': number | string | boolean | null | undefined;
        }

        /**
         * Expected to be { 'string': '<union>' | '<of>' | '<allowed>' | '<elements>' }
         * The key is ignored, and will generally be named for the assembly.
         */
        interface IntrinsicElementParts {}

        /**
         * Extended by declaration merging into IntrinsicElementParts.
         */
        type IntrinsicElements = {
            [Key in IntrinsicElementParts[keyof IntrinsicElementParts] &
                string]: IntrinsicElementAttributes<Key>;
        };

        /** JSX Element */
        type Element =
            | ElementPossibilityParts[keyof ElementPossibilityParts]
            | Signal<Element>
            | Element[];
    }
}
