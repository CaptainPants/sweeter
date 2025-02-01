import { type ElementAttributesByName } from './IntrinsicAttributes.js';
import { type IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace PtolemyExtensionPoints {
        interface IntrinsicElementNames {
            'ptolemy-web': keyof IntrinsicElementTypeMap;
        }

        interface IntrinsicElementNameToType<
            TElementTypeString extends string,
        > {
            'ptolemy-web': IntrinsicElementTypeMap[TElementTypeString &
                keyof IntrinsicElementTypeMap];
        }

        interface IntrinsicElementAttributeByElementNameString<
            TElementTypeString extends string,
        > {
            'ptolemy-web': ElementAttributesByName<TElementTypeString>;
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface IntrinsicElementTypes {
            'ptolemy-web': HTMLElement | SVGElement | Text | Comment;
        }

        interface RuntimeRootHostElementTypes {
            'wireui-web': HTMLElement | SVGElement;
        }
    }
}
