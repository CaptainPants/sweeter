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
        interface IntrinsicAttributes {
            readonly key?: types.JSXKey | undefined;
        }

        /**
         * Attributes that apply to all element types - in HTML this is most things
         */
        interface CommonAttributeParts {}

        type CommonAttributes = UnionToIntersection<
            CommonAttributeParts[keyof CommonAttributeParts]
        >;

        interface ElementChildrenAttribute {
            // eslint-disable-next-line @typescript-eslint/ban-types
            children: {}; // specify children name to use
        }

        /**
         * This is not standard. I am hoping that by structuring in this way we
         * can use declaration merging to extend the definition of Element.
         */
        interface ElementAlternatives {
            'wireyui-core': number | string | boolean | null | undefined;
        }

        interface IntrinsicElements {}

        /** JSX Element */
        type Element =
            | ElementAlternatives[keyof ElementAlternatives]
            | Signal<Element>
            | Element[];
    }
}
