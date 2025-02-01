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

        // This is not documented, but looks like it should work from the typescript source-code
        // The constructor signature and first parameter is passed in.
        // Refer to https://github.com/microsoft/TypeScript 739d729ecce60771c23723aad932ab35a34df82d src/checker.ts function createTypeChecker -> getJsxPropsTypeFromCallSignature
        type LibraryManagedAttributes<Ctor, RawProps> = types.PropsInput<RawProps>

        /**
         * Extended by declaration merging into IntrinsicElementNames.
         */
        type IntrinsicElements = types.JSXIntrinsicElements;

        /** JSX Element */
        type Element = types.JSXElement;
    }
}
