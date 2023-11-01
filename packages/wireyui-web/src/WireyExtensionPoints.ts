import type { IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';
import type { ElementAttributes } from './IntrinsicAttributes.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace WireyExtensionPoints {
        interface IntrinsicElementNamesParts {
            'wireyui-web': keyof IntrinsicElementTypeMap;
        }

        interface IntrinsicElementAttributeParts<
            TElementTypeString extends string,
        > {
            'wireyui-web': TElementTypeString extends keyof IntrinsicElementTypeMap
                ? ElementAttributes<IntrinsicElementTypeMap[TElementTypeString]>
                : ElementAttributes<HTMLElement>;
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface IntrinsicElementPossibilityParts {
            'wireyui-web': HTMLElement | SVGElement | Text | Comment;
        }

        interface RendererHostElementParts {
            'wireui-web': HTMLElement | SVGElement;
        }

        interface IntrinsicElementDoNotSignalifyAttributesParts {
            'wireui-web': 'ref' | 'value';
        }
    }
}
