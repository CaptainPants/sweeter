import type {
    WritableSignal,
    Props,
    ReadWriteSignal,
} from '@captainpants/wireyui-core';

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

type AllElementAttributes<TElement> = {
    id?: string;
    title?: string;

    style?: Record<string, string>;
    children?: JSX.Element;

    ref?: ((value: TElement) => void) | WritableSignal<TElement>;
};

type ElementSpecificOverrideAttributes<TElement> =
    TElement extends HTMLLabelElement ? { for?: string } : unknown;

type TextInputAttributes = {
    placeholder?: string;
    type?: string;
    value?: ReadWriteSignal<string> | string | undefined;
};

type NamedElementAttributes = {
    name?: string;
};

type HasReadOnlyAttributes = {
    readonly?: boolean;
};

type HasDisabledAttributes = {
    disabled?: boolean;
};

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type FormElementAttributes<TElement> = TElement extends HTMLInputElement
    ? TextInputAttributes & HasReadOnlyAttributes & NamedElementAttributes
    : TElement extends HTMLTextAreaElement
    ? TextInputAttributes & HasReadOnlyAttributes & NamedElementAttributes
    : TElement extends HTMLSelectElement
    ? HasDisabledAttributes & NamedElementAttributes
    : NamedElementAttributes;

export type ElementAttributes<TElement extends Element> =
    EventHandlerProperties<TElement> &
        ElementSpecificOverrideAttributes<TElement> &
        AllElementAttributes<TElement> &
        (TElement extends FormElement
            ? FormElementAttributes<TElement>
            : unknown);

export type ElementProps<TElement extends Element> = Props<
    ElementAttributes<TElement>,
    JSXExt.IntrinsicElementDoNotSignalifyAttributes
>;
