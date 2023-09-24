import {
    KeysMatching,
    OnlyWritableProperties,
} from '@captainpants/wireyui-core';

type PrefixedNames<
    TNames extends string,
    TPrefix extends string,
> = TNames extends `${TPrefix}${string}` ? TNames : never;

type TypedEvent<TElement, TEvent> = Omit<TEvent, 'target'> & {
    target: TElement;
};

type EventHandlerNames<TElement extends Element> = PrefixedNames<
    keyof TElement & string,
    'on'
>;

type FirstParam<T> = T extends (evt: infer TEvent) => unknown ? TEvent : never;
type EventTypeParamHandler<TElement, PropertyName extends string> = FirstParam<
    TElement[PropertyName & keyof TElement]
>;

type EventHandlerProperties<TElement extends Element> = {
    [Property in EventHandlerNames<TElement>]?: (
        this: TElement,
        evt: TypedEvent<TElement, EventTypeParamHandler<TElement, Property>>,
    ) => void;
};

type ExcludedSimpleProperties = 'innerHTML' | 'innerText' | 'outerText';

type SimpleTypesProperties<TElement extends Element> = Partial<
    OnlyWritableProperties<
        Pick<
            TElement,
            Exclude<
                KeysMatching<TElement, string | number | boolean>,
                ExcludedSimpleProperties
            >
        >
    >
>;

type ManuallySpecifiedProperties = {
    style?: Record<string, string>;
};

interface IntrinsicTypeMap {
    html: HTMLHtmlElement;
    head: HTMLHeadElement;
    div: HTMLDivElement;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElementParts {
            'wireyui-web': keyof IntrinsicTypeMap;
        }

        interface IntrinsicElementAttributeParts<TElementType extends string> {
            'wireyui-web': TElementType extends keyof IntrinsicTypeMap
                ? EventHandlerProperties<IntrinsicTypeMap[TElementType]> &
                      SimpleTypesProperties<IntrinsicTypeMap[TElementType]> &
                      ManuallySpecifiedProperties
                : EventHandlerProperties<HTMLElement> &
                      SimpleTypesProperties<HTMLElement> &
                      ManuallySpecifiedProperties;
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface ElementPossibilityParts {
            'wireyui-web': HTMLElement | SVGElement;
        }
    }
}
