import {
    type WritableSignal,
    type ReadWriteSignal,
    type Signal,
    type MightBeSignal,
} from '@captainpants/sweeter-core';
import { type IntrinsicElementTypeMap } from './IntrinsicElementTypeMap.js';

import { type StandardPropertiesHyphen } from 'csstype';
import { type AbstractGlobalCssClass } from './styles/index.js';
import { type ThreeValueBoolean } from './indeterminate.js';

// ==== EVENTS

type PrefixedNames<
    TNames extends string,
    TPrefix extends string,
> = TNames extends `${TPrefix}${string}` ? TNames : never;

export type TypedEvent<TElement, TEvent> = Omit<TEvent, 'target'> & {
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
    [Property in EventHandlerNames<TElement>]?:
        | ((
              this: TElement,
              evt: TypedEvent<
                  TElement,
                  FirstParamForProperty<TElement, Property>
              >,
          ) => void)
        | undefined;
};

// ==== CSS

// eslint-disable-next-line @typescript-eslint/ban-types
export type StyleProperties = StandardPropertiesHyphen<number | (string & {})>;

export type ElementCssStyles = {
    [Key in keyof StyleProperties]:
        | StyleProperties[Key]
        | Signal<StyleProperties[Key]>;
};

export type ElementCssClasses =
    | Signal<ElementCssClasses>
    | string
    | AbstractGlobalCssClass
    | Record<string, Signal<boolean> | boolean>
    | undefined
    | null
    | ElementCssClasses[];

// ==== Generic

type AllElementAttributes<TElement> = {
    id?: string | undefined;
    title?: string | undefined;

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;
    children?: JSX.Element | undefined;

    ref?: ((value: TElement) => void) | WritableSignal<TElement>;
};

type HasFormControlValueAttribute = {
    value?: string | undefined;
    'bind:value'?: ReadWriteSignal<string> | undefined;
};
type HasNonBindableFormControlValueAttribute = {
    value?: string | undefined;
};

type HasCheckedAttribute = {
    checked?: ThreeValueBoolean | undefined;

    'bind:checked'?: ReadWriteSignal<ThreeValueBoolean> | undefined;
};

type HasNameAttribute = {
    name?: string | undefined;
};

type HasReadOnlyAttribute = {
    readonly?: boolean | undefined;
};

type HasDisabledAttribute = {
    disabled?: boolean | undefined;
};

// == Element-specific ==

type HTMLOptionElementAttributes = {
    value?: MightBeSignal<string> | undefined;
} & HasDisabledAttribute;

type HTMLLabelElementAttributes = {
    for?: string | undefined;
};

export type InputType =
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

type HTMLInputElementAttributes = {
    placeholder?: string | undefined;
    type?: InputType | undefined;
} & HasFormControlValueAttribute &
    HasCheckedAttribute &
    HasDisabledAttribute &
    HasReadOnlyAttribute &
    HasNameAttribute;

type HTMLTextAreaAttributes = {
    placeholder?: string | undefined;
} & HasFormControlValueAttribute &
    HasDisabledAttribute &
    HasReadOnlyAttribute &
    HasNameAttribute;

type HTMLSelectElementAttributes = HasFormControlValueAttribute &
    HasDisabledAttribute &
    HasNameAttribute;

type HTMLButtonElementAttributes = HasNonBindableFormControlValueAttribute &
    HasDisabledAttribute &
    HasNameAttribute;

// == (END) Element-specific ==

type SpecificElementAttributes<TElement> = TElement extends HTMLButtonElement
    ? HTMLButtonElementAttributes
    : TElement extends HTMLLabelElement
    ? HTMLLabelElementAttributes
    : TElement extends HTMLInputElement
    ? HTMLInputElementAttributes
    : TElement extends HTMLTextAreaElement
    ? HTMLTextAreaAttributes
    : TElement extends HTMLSelectElement
    ? HTMLSelectElementAttributes
    : TElement extends HTMLOptionElement
    ? HTMLOptionElementAttributes
    : // eslint-disable-next-line @typescript-eslint/ban-types
      {};

export type ElementAttributesByName<TElementTypeString extends string> =
    TElementTypeString extends keyof IntrinsicElementTypeMap
        ? ElementAttributes<IntrinsicElementTypeMap[TElementTypeString]>
        : NonSpecificElementAttributes;

export type ElementAttributes<TElement extends Element> =
    EventHandlerProperties<TElement> &
        SpecificElementAttributes<TElement> &
        AllElementAttributes<TElement>;

export type NonSpecificElementAttributes = ElementAttributes<HTMLElement>;

export type WebSkipSignalifyingIntrinsicElementAttributes<
    _TElementTypeString extends string,
> = 'ref' | 'class' | `bind:${string}`;
