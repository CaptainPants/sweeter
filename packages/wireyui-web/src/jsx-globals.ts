import type { IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';
import type { ElementProperties } from './IntrinsicProperties.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElementParts {
            'wireyui-web': keyof IntrinsicElementTypeMap;
        }

        interface IntrinsicElementAttributeParts<TElementType extends string> {
            'wireyui-web': TElementType extends keyof IntrinsicElementTypeMap
                ? ElementProperties<IntrinsicElementTypeMap[TElementType]>
                : ElementProperties<HTMLElement>;
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface ElementPossibilityParts {
            'wireyui-web': HTMLElement | SVGElement | Text | Comment;
        }

        interface RendererHostElementParts {
            'wireui-web': HTMLElement | SVGElement;
        }
    }
}
