/**
 * @module JSX-extensions
 */

export {};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace PtolemyExtensionPoints {
        /**
         * Use this to extend IntrinsicElementAttributes.
         *
         * Merge into this interface using properties with structure:
         * '{library-name}': ComponentProps
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface IntrinsicElementAttributeByElementNameString<
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            TElementTypeString extends string,
        > {}

        /**
         * Defines the return type for Runtime.jsx / JSXResultForComponentType<TComponentType>.
         *
         * Merge into this interface using properties with structure:
         * '{library-name}': ResultType
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface IntrinsicElementNameToType<
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            TElementTypeString extends string,
        > {}

        /**
         * Use this to provide a list of valid intrinsic element names, for use in
         * populating IntrinsicElements.
         *
         * Merge into this interface using properties with structure:
         * '{library-name}': 'div' | 'span';
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface IntrinsicElementNames {}

        /**
         * Use this to add to the IntrinsicElements union.
         *
         * Merge into this interface using properties with structure:
         * '{library-name}': BackendSpecificJSXElement1 | BackendSpecificJSXElement2;
         */
        interface IntrinsicElementTypes {
            'ptolemy-core': number | string | boolean | null | undefined;
        }

        /**
         * Use this to add to the RuntimeRootHostElement union, primarily for use with Portals
         * and RendererContext.
         *
         * Merge into this interface using properties with structure:
         * '{library-name}': BackendSpecificJSXRoot1 | BackendSpecificJSXRoot2;
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface RuntimeRootHostElementTypes {}

        interface DebugFlags {
            all: boolean;

            signalStacks: boolean;

            monitorOperations: boolean;
            monitorInvokesDebugger: boolean;

            componentMounting: boolean;

            breakpointOnSwallowedError: boolean;
        }
    }
}
