import { type IsAny, type IsNever } from '@serpentis/ptolemy-utilities';

import { type Signal } from '../signals/types.js';

import { type Component } from './Component.js';
import {
    type ComponentOrIntrinsicElementTypeConstraint,
    type ComponentTypeConstraint,
} from './constraints.js';
import {
    type IntrinsicRawElementAttributes,
    type MightBeSignal,
} from './misc.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- utility to represent that a component has no props
export type NoProps = {};

/**
 * This is used to provide information about a prop outside the default mapping and handling.
 */
export type Prop<TInput, TOutput = TInput> = TOutput & {
    readonly __PROP_TREATMENT__: {
        input: TInput;
    };
};

// In an ideal world we might work out an alternative..
type _RemoveUndefined<T> = Exclude<T, undefined>;

export type PropInputFromDefinition<PropDefinition> =
    IsAny<PropDefinition> extends true // Deal with any explicitly so it doesn't do anything weird
        ? PropDefinition
        : [_RemoveUndefined<PropDefinition>] extends [
                Prop<infer Input, infer _Output>,
            ] // If there was an override, use its input type
          ? Input
          : [_RemoveUndefined<PropDefinition>] extends [Signal<infer S>] // If it was a signal, allow either the signal or the signals value type
            ? MightBeSignal<S>
            : PropDefinition; // Otherwise just use as is

export type PropDef<TProp> =
    IsAny<TProp> extends true // Deal with any explicitly so it doesn't do anything weird
        ? Signal<TProp>
        : IsNever<TProp> extends true // never => Signal<never>, mostly so the empty JSX types on ptolemy-core work nicely
          ? Signal<never>
          : [_RemoveUndefined<TProp>] extends [
                  Prop<infer _Input, infer _Output>,
              ] // If its a Prop, keep it
            ? TProp // Preserve the PropInput structure
            : Signal<TProp>; // Otherwise make it a signal

/**
 * The usage of a Props object, for creating the actual component.
 *
 * If the property is a signal, allow a non-signal and we'll wrap it
 */
export type PropsInputFromDef<DefinedProps> = {
    [Key in keyof DefinedProps]: PropInputFromDefinition<DefinedProps[Key]>;
};

export type PropsDef<RawProps> = {
    [Key in keyof RawProps]: PropDef<RawProps[Key]>;
};

export type PropsDefForComponent<
    ComponentType extends ComponentTypeConstraint,
> =
    ComponentType extends Component<infer _PropsDefinition>
        ? Parameters<ComponentType>[0]
        : never;

export type PropsInputForComponent<
    ComponentType extends ComponentTypeConstraint,
> = PropsInputFromDef<PropsDefForComponent<ComponentType>>;

export type PropsInputFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> = ComponentOrIntrinsicElementTypeString extends ComponentTypeConstraint
    ? PropsInputForComponent<ComponentOrIntrinsicElementTypeString>
    : ComponentOrIntrinsicElementTypeString extends string
      ? IntrinsicElementPropsInput<ComponentOrIntrinsicElementTypeString>
      : never;

export type ChildrenTypeFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> =
    PropsInputFor<ComponentOrIntrinsicElementTypeString> extends {
        children: infer Children;
    }
        ? Children
        : never;

/**
 * Props for intrinsic elements, based on the type string.
 */
export type IntrinsicElementPropsInput<TElementTypeString extends string> =
    PropsInputFromDef<IntrinsicElementPropsDef<TElementTypeString>>;

/**
 * Props for intrinsic elements, based on the type string.
 */
export type IntrinsicElementPropsDef<TElementTypeString extends string> =
    PropsDef<IntrinsicRawElementAttributes<TElementTypeString>>;
