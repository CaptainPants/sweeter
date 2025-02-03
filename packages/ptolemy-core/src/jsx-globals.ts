import type * as types from './types/index.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        /**
         * This tells typescript what property to use for children.
         */
        interface ElementChildrenAttribute {
            // eslint-disable-next-line  @typescript-eslint/no-empty-object-type -- This is the structure required for JSX.ElementChildrenAttribute
            children: {}; // specify children name to use
        }

        // See TypeScript 3.0 release announcement https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#support-for-defaultprops-in-jsx
        // I can't find any other documentation for it.
        // This is not documented, but looks like it should work from the typescript source-code
        // The constructor signature and first parameter is passed in.
        // Refer to https://github.com/microsoft/TypeScript 739d729ecce60771c23723aad932ab35a34df82d src/checker.ts function createTypeChecker -> getJsxPropsTypeFromCallSignature
        type LibraryManagedAttributes<_Ctor, DeclaredProps> =
            types.PropsInputFromDef<DeclaredProps>;

        /**
         * Extended by declaration merging into IntrinsicElementNames.
         */
        type IntrinsicElements = types.JSXIntrinsicElements;

        /** JSX Element */
        type Element = types.JSXElement;
    }
}
