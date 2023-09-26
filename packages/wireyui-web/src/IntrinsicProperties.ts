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

type AllElementProps = {
    id?: string;
    title?: string;

    style?: Record<string, string>;
    children?: JSX.Element;
};

type OverrideProps<TElement> = TElement extends HTMLInputElement
    ? { value?: string }
    : TElement extends HTMLLabelElement
    ? { for?: string }
    : unknown;

type TextInputProps = {
    placeholder?: string;
    value?: string;
};

type NamedProps = {
    name?: string;
};

type HasReadOnlyProps = {
    readonly?: boolean;
};

type HasDisabledProps = {
    disabled?: boolean;
};

type FormElement = HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;

type FormElementProps<TElement> = TElement extends HTMLInputElement
    ? TextInputProps & HasReadOnlyProps & NamedProps
    : TElement extends HTMLTextAreaElement
    ? TextInputProps & HasReadOnlyProps & NamedProps
    : TElement extends HTMLSelectElement
    ? HasDisabledProps & NamedProps
    : NamedProps;

export type ElementProperties<TElement extends Element> =
    EventHandlerProperties<TElement> &
        OverrideProps<TElement> &
        AllElementProps &
        (TElement extends FormElement
            ? FormElementProps<FormElement>
            : unknown);
