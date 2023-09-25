import {
    KeysMatching as PropertyNamesWithValueMatching,
    OnlyWritableProperties,
} from '@captainpants/wireyui-core';
import { IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';

type PrefixedNames<
    TNames extends string,
    TPrefix extends string,
> = TNames extends `${TPrefix}${string}` ? TNames : never;

type Event<TElement, TEvent> = Omit<TEvent, 'target'> & {
    /**
     * Returns the object to which event is dispatched (its target).
     */
    readonly target: TElement | null;
};

type EventHandlerNames<TElement extends Element> = PrefixedNames<
    keyof TElement & string,
    'on'
>;

type FirstParam<T> = T extends (evt: infer TEvent) => unknown ? TEvent : never;
type FirstParamForProperty<TElement, PropertyName extends string> = FirstParam<
    TElement[PropertyName & keyof TElement]
>;

type EventHandlerProperties<TElement extends Element> = {
    [Property in EventHandlerNames<TElement>]?: (
        this: TElement,
        evt: Event<TElement, FirstParamForProperty<TElement, Property>>,
    ) => void;
};

type ExcludedSimpleDOMProperties =
    | 'innerHTML'
    | 'outerHTML'
    | 'innerText'
    | 'outerText';

/**
 * Some property names are weirdly represented in the DOM, this just puts them back to what they are in HTML.
 */
interface RemappedProperties {
    className: 'class';
    htmlFor: 'for';
}

/**
 * Some property names are weirdly represented in the DOM, this just puts them back to what they are in HTML.
 */
type RemapPropertyNames<TObj> = {
    [Key in keyof TObj as Key extends keyof RemappedProperties
        ? RemappedProperties[Key]
        : Key]: TObj[Key];
};

type SimpleDOMProperties<TElement extends Element> = Partial<
    RemapPropertyNames<
        OnlyWritableProperties<
            Pick<
                TElement,
                Exclude<
                    PropertyNamesWithValueMatching<
                        TElement,
                        string | number | boolean
                    >,
                    ExcludedSimpleDOMProperties
                >
            >
        >
    >
>;

type ManuallySpecifiedProperties = {
    style?: Record<string, string>;
    children?: JSX.Element;
};

type ElementProperties<TElement extends Element> = EventHandlerProperties<TElement> & SimpleDOMProperties<TElement> & ManuallySpecifiedProperties;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElementParts {
            'wireyui-web': keyof IntrinsicElementTypeMap;
        }

        interface IntrinsicElementAttributeParts<TElementType extends string> {
            'wireyui-web': TElementType extends keyof IntrinsicElementTypeMap
                ? ElementProperties<
                      IntrinsicElementTypeMap[TElementType]
                  > 
                : ElementProperties<HTMLElement>;
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface ElementPossibilityParts {
            'wireyui-web': HTMLElement | SVGElement | Text;
        }
    }
}
