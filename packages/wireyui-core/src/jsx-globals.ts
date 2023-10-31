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
         * Extended by declaration merging into IntrinsicElementAttributeParts.
         */
        type IntrinsicElementAttributes<TElementTypeString extends string> =
            UnionToIntersection<
                JSXExt.IntrinsicElementAttributeParts<TElementTypeString>[keyof JSXExt.IntrinsicElementAttributeParts<TElementTypeString>]
            >;

        /**
         * This tells typescript what property to use for children.
         */
        interface ElementChildrenAttribute {
            // eslint-disable-next-line @typescript-eslint/ban-types
            children: {}; // specify children name to use
        }
        /**
         * Extended by declaration merging into IntrinsicElementParts.
         */
        type IntrinsicElements = {
            [Key in JSXExt.IntrinsicElementParts[keyof JSXExt.IntrinsicElementParts] &
                string]: types.Props<
                IntrinsicElementAttributes<Key>,
                JSXInternal.IntrinsicElementDoNotSignalifyAttributes
            >;
        };

        /** JSX Element */
        type Element =
            | JSXInternal.IntrinsicElement
            | Signal<Element>
            | Element[];
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSXInternal {
        type IntrinsicElementDoNotSignalifyAttributes =
            JSXExt.IntrinsicElementDoNotSignalifyAttributesParts[keyof JSXExt.IntrinsicElementDoNotSignalifyAttributesParts];

        type RendererHostElement =
            JSXExt.RendererHostElementParts[keyof JSXExt.RendererHostElementParts];

        type IntrinsicElement =
            JSXExt.ElementPossibilityParts[keyof JSXExt.ElementPossibilityParts];
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSXExt {
        /**
         * Use this to extend IntrinsicElementAttributes.
         */
        interface IntrinsicElementAttributeParts<
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            TElementTypeString extends string,
        > {}

        interface IntrinsicElementDoNotSignalifyAttributesParts {}

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

        /**
         * Expected to be { 'string': '\<union>' | '\<of>' | '\<allowed>' | '\<elements>' }
         * The key is ignored, and will generally be named for the assembly.
         */
        interface IntrinsicElementParts {}
    }
}
