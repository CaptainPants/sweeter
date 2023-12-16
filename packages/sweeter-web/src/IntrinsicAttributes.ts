import type {
    WritableSignal,
    ReadWriteSignal,
    Signal,
    MightBeSignal,
} from '@captainpants/sweeter-core';
import type { IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';

import { type StandardPropertiesHyphen } from 'csstype';
import type { ElementCssClasses } from './styles/index.js';

// ==== EVENTS

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

// ==== CSS

// eslint-disable-next-line @typescript-eslint/ban-types
type StyleProperties = StandardPropertiesHyphen<number | (string & {})>;

export type Styles = {
    [Key in keyof StyleProperties]:
        | StyleProperties[Key]
        | Signal<StyleProperties[Key]>;
};

// ==== OTHER

type AllElementAttributes<TElement> = {
    id?: string;
    title?: string;

    class?: ElementCssClasses;
    style?: Styles;
    children?: JSX.Element;

    ref?: ((value: TElement) => void) | WritableSignal<TElement>;
};

type OptionAttributes = {
    value?: MightBeSignal<string>;
};

type ElementSpecificOverrideAttributes<TElement> =
    TElement extends HTMLLabelElement
        ? { for?: string }
        : TElement extends HTMLOptionElement
        ? OptionAttributes
        : unknown;

type TextInputAttributes = {
    placeholder?: string;
    type?: string;
    value?: ReadWriteSignal<string> | Signal<string> | string | undefined;
};

type SelectAttributes = {
    value?: ReadWriteSignal<string> | Signal<string> | string | undefined;
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

type FormElementAttributes<TFormElement extends FormElement> =
    TFormElement extends HTMLInputElement
        ? TextInputAttributes & HasReadOnlyAttributes & NamedElementAttributes
        : TFormElement extends HTMLTextAreaElement
        ? TextInputAttributes & HasReadOnlyAttributes & NamedElementAttributes
        : TFormElement extends HTMLSelectElement
        ? SelectAttributes & HasDisabledAttributes & NamedElementAttributes
        : NamedElementAttributes;

export type ElementAttributesByName<TElementTypeString extends string> =
    TElementTypeString extends keyof IntrinsicElementTypeMap
        ? ElementAttributes<IntrinsicElementTypeMap[TElementTypeString]>
        : NonSpecificElementAttributes;

export type ElementAttributes<TElement extends Element> =
    EventHandlerProperties<TElement> &
        ElementSpecificOverrideAttributes<TElement> &
        AllElementAttributes<TElement> &
        (TElement extends FormElement
            ? FormElementAttributes<TElement>
            : unknown);

export type NonSpecificElementAttributes = ElementAttributes<HTMLElement>;
