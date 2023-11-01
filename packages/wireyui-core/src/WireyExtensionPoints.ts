export {};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace WireyExtensionPoints {
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
