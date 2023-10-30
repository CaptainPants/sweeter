import type { Signal } from './signals/types.js';
import type * as types from './types.js';

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

        interface IntrinsicElementAttributeParts<
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            TElementTypeString extends string,
        > {}

        interface IntrinsicElementDoNotSignalifyAttributesParts {}

        type IntrinsicElementDoNotSignalifyAttributes =
            IntrinsicElementDoNotSignalifyAttributesParts[keyof IntrinsicElementDoNotSignalifyAttributesParts];

        /**
         * Extended by declaration merging into IntrinsicElementAttributeParts.
         */
        type IntrinsicElementAttributes<TElementTypeString extends string> =
            UnionToIntersection<
                IntrinsicElementAttributeParts<TElementTypeString>[keyof IntrinsicElementAttributeParts<TElementTypeString>]
            >

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
         * Use this to add to the Element union.
         */
        interface RendererHostElementParts {}

        type RendererHostElement =
            RendererHostElementParts[keyof RendererHostElementParts];

        /**
         * Expected to be { 'string': '\<union>' | '\<of>' | '\<allowed>' | '\<elements>' }
         * The key is ignored, and will generally be named for the assembly.
         */
        interface IntrinsicElementParts {}

        /**
         * Extended by declaration merging into IntrinsicElementParts.
         * (Standard)
         */
        type IntrinsicElements = {
            [Key in IntrinsicElementParts[keyof IntrinsicElementParts] &
                string]:
                | types.Props<IntrinsicElementAttributes<Key>, IntrinsicElementDoNotSignalifyAttributes>;
        };

        /**
         * Extended by interface merging of ElementPossibilityParts.
         * (Non-standard)
         */
        type IntrinsicElement =
            ElementPossibilityParts[keyof ElementPossibilityParts];

        /** JSX Element */
        type Element = IntrinsicElement | Signal<Element> | Element[];
    }
}
