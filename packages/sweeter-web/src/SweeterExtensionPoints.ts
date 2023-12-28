import type { IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';
import type {
    ElementAttributesByName,
    WebSkipSignalifyingIntrinsicElementAttributes,
} from './IntrinsicAttributes.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace SweeterExtensionPoints {
        interface IntrinsicElementNames {
            'wireyui-web': keyof IntrinsicElementTypeMap;
        }

        interface IntrinsicElementNameToType<
            TElementTypeString extends string,
        > {
            'wireyui-web': IntrinsicElementTypeMap[TElementTypeString &
                keyof IntrinsicElementTypeMap];
        }

        interface IntrinsicElementAttributeByElementNameString<
            TElementTypeString extends string,
        > {
            'wireyui-web': ElementAttributesByName<TElementTypeString>;
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface IntrinsicElementTypes {
            'wireyui-web': HTMLElement | SVGElement | Text | Comment;
        }

        interface RuntimeRootHostElementTypes {
            'wireui-web': HTMLElement | SVGElement;
        }

        interface SkipSignalifyingIntrinsicElementAttributes<
            TElementTypeString extends string,
        > {
            'wireui-web': WebSkipSignalifyingIntrinsicElementAttributes<TElementTypeString>;
        }
    }
}
