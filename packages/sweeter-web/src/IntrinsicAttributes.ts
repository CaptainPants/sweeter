import type {
    WritableSignal,
    ReadWriteSignal,
    Signal,
    MightBeSignal,
} from '@captainpants/sweeter-core';
import type { IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';

import { type StandardPropertiesHyphen } from 'csstype';
import type { ElementCssClasses } from './styles/index.js';
import type { ThreeValueBoolean } from './indeterminate.js';

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
export type StyleProperties = StandardPropertiesHyphen<number | (string & {})>;

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

type HasFormControlValueAttribute = {
    value?: string | undefined;
    'bind:value'?: ReadWriteSignal<string> | undefined;
};

type HasCheckedAttribute = {
    checked?: ThreeValueBoolean;

    'bind:checked'?: ReadWriteSignal<ThreeValueBoolean> | undefined;
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

type InputType =
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
    // eslint-disable-next-line @typescript-eslint/ban-types -- This allows custom values but also autocomplete. If you specify | string, the whole thing just becomes 'string'
    | (string & {});

type InputGeneralAttributes = {
    placeholder?: string;
    type?: InputType;
};

type TextAreaAttributes = {
    placeholder?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type SelectAttributes = {};

type HasNameAttribute = {
    name?: string;
};

type HasReadOnlyAttribute = {
    readonly?: boolean;
};

type HasDisabledAttribute = {
    disabled?: boolean;
};

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type FormElementAttributes<TFormElement extends FormElement> =
    TFormElement extends HTMLInputElement
        ? InputGeneralAttributes &
              HasFormControlValueAttribute &
              HasCheckedAttribute &
              HasDisabledAttribute &
              HasReadOnlyAttribute &
              HasNameAttribute
        : TFormElement extends HTMLTextAreaElement
        ? TextAreaAttributes &
              HasFormControlValueAttribute &
              HasReadOnlyAttribute &
              HasNameAttribute
        : TFormElement extends HTMLSelectElement
        ? SelectAttributes &
              HasFormControlValueAttribute &
              HasDisabledAttribute &
              HasNameAttribute
        : HasNameAttribute;

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

export type WebSkipSignalifyingIntrinsicElementAttributes<
    _TElementTypeString extends string,
> = 'ref' | 'class' | `bind:${string}`;
