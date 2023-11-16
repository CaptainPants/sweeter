import type { IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';
import type { ElementAttributesByName } from './IntrinsicAttributes.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace SweeterExtensionPoints {
        interface IntrinsicElementNames {
            'wireyui-web': keyof IntrinsicElementTypeMap;
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
            'wireui-web/all': 'ref' | 'class';
            'wireui-web/input': TElementTypeString extends
                | 'input'
                | 'textarea'
                | 'select'
                ? 'value'
                : never;
        }
    }
}
