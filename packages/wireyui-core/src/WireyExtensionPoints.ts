export {};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace WireyExtensionPoints {
        /**
         * Use this to extend IntrinsicElementAttributes.
         *
         * Merge into this interface with:
         * '<unique-name>': ComponentProps
         */
        interface IntrinsicElementAttributesParts<
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            TElementTypeString extends string,
        > {}

        /**
         * Use this to provide a list of valid intrinsic element names, for use in
         * populating IntrinsicElements.
         *
         * Merge into this interface with:
         * '<unique-name>': 'div' | 'span';
         */
        interface IntrinsicElementNamesParts {}

        /**
         * Use this to extend IntrinsicElementDoNotSignalifyAttributes.
         *
         * Merge into this interface with:
         * '<unique-name>': 'attribute-1' | 'attribute-2'
         */
        interface IntrinsicElementDoNotSignalifyAttributesParts {}

        /**
         * Use this to add to the IntrinsicElements union.
         *
         * Merge into this interface with:
         * '<unique-name>': BackendSpecificJSXElement1 | BackendSpecificJSXElement2;
         */
        interface IntrinsicElementPossibilityParts {
            'wireyui-core': number | string | boolean | null | undefined;
        }

        /**
         * Use this to add to the RendererHostElement union, primarily for use with Portals
         * and RendererContext.
         *
         * Merge into this interface with:
         * '<unique-name>': BackendSpecificJSXRoot1 | BackendSpecificJSXRoot2;
         */
        interface RendererHostElementParts {}
    }
}
