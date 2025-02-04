import { type IsAny, type IsNever } from '@serpentis/ptolemy-utilities';

import { type Signal } from '../signals/types.js';

import { type Component } from './Component.js';
import {
    type ComponentOrIntrinsicElementTypeConstraint,
    type ComponentTypeConstraint,
} from './constraints.js';
import {
    type PropOutputFromParam,
    type RemoveUndefined,
} from './internal/utility.js';
import { type IntrinsicRawElementAttributes,type MightBeSignal } from './misc.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- utility to represent that a component has no props
export type NoProps = {};

export type PropParamFromRaw<TPropRaw> =
    IsAny<TPropRaw> extends true // Deal with any explicitly so it doesn't do anything weird
        ? Signal<TPropRaw>
        : IsNever<TPropRaw> extends true // never => Signal<never>, mostly so the empty JSX types on ptolemy-core work nicely
          ? Signal<never>
          : [RemoveUndefined<TPropRaw>] extends [Prop<infer _Input, infer _Output>] // If its a Prop, keep it
            ? TPropRaw // Preserve the PropInput structure
            : Signal<TPropRaw>; // Otherwise make it a signal

export type PropInputFromParam<TPropParam> =
    IsAny<TPropParam> extends true // Deal with any explicitly so it doesn't do anything weird
        ? TPropParam
        : [RemoveUndefined<TPropParam>] extends [
                Prop<infer Input, infer _Output>,
            ] // If there was an override, use its input type
          ? Input
          : [RemoveUndefined<TPropParam>] extends [Signal<infer S>] // If it was a signal, allow either the signal or the signals value type
            ? MightBeSignal<S>
            : TPropParam; // Otherwise just use as is

/**
 * This is used to provide information about a prop outside the default mapping and handling.
 */
export type Prop<TInput, TOutput = TInput> = TOutput & {
    readonly __PROP_TREATMENT__: {
        input: TInput;
    };
};

export type PropsParam<PropsRaw> = {
    [Key in keyof PropsRaw]: PropParamFromRaw<PropsRaw[Key]>;
};

/**
 * The usage of a Props object, for creating the actual component.
 *
 * If the property is a signal, allow a non-signal and we'll wrap it
 */
export type PropsInputFromParam<TPropsParam> = {
    [Key in keyof TPropsParam]: PropInputFromParam<TPropsParam[Key]>;
};

export type PropsOutputFromParam<TPropsParam> = {
    [Key in keyof TPropsParam]: PropOutputFromParam<TPropsParam[Key]>;
};

export type PropsParamForComponent<
    ComponentType extends ComponentTypeConstraint,
> =
    ComponentType extends Component<infer _PropsParam>
        ? Parameters<ComponentType>[0]
        : never;

export type PropsInputForComponent<
    ComponentType extends ComponentTypeConstraint,
> = PropsInputFromParam<PropsParamForComponent<ComponentType>>;

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
    PropsInputFromParam<IntrinsicElementPropsDef<TElementTypeString>>;

/**
 * Props for intrinsic elements, based on the type string.
 */
export type IntrinsicElementPropsDef<TElementTypeString extends string> =
    PropsParam<IntrinsicRawElementAttributes<TElementTypeString>>;
