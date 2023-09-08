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
            number: number;
            string: string;
            boolean: boolean;
            null: null;
            undefined: undefined;
        }

        interface IntrinsicElements {
            core: { banana: number };
        }
        
        type ElementType<TAlternatives> = TAlternatives[keyof TAlternatives] | ElementType<TAlternatives>[];

        type Element = ElementType<ElementAlternatives>;
    }
}
