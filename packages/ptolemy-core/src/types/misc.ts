import {
    type UnionToIntersection,
} from '@serpentis/ptolemy-utilities';

import { type Signal } from '../signals/types.js';

import { type ComponentOrIntrinsicElementTypeConstraint } from './constraints.js';
import { type IntrinsicElementPropsInput } from './propTypes.js';

export type JSXKey = string | number;

export type JSXElement =
    | IntrinsicElement
    | Signal<JSXElement>
    | readonly JSXElement[];

export type JSXIntrinsicElements = {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    [Key in PtolemyExtensionPoints.IntrinsicElementNames[keyof PtolemyExtensionPoints.IntrinsicElementNames] &
        string]: IntrinsicElementPropsInput<Key>;
};

export interface IdGenerator {
    next: (basis?: string) => string;
}

export type JSXResultForComponentOrElementType<
    ComponentType extends ComponentOrIntrinsicElementTypeConstraint,
> = ComponentType extends string
    ? PtolemyExtensionPoints.IntrinsicElementNameToType<ComponentType>[keyof PtolemyExtensionPoints.IntrinsicElementNameToType<ComponentType>]
    : JSXElement;


export type MightBeSignal<T> = T | Signal<T>;

/**
 * Take a props interface and make each property optionally a Signal.
 * You should ensure that the values aren't signals already.
 */
export type PropertiesMightBeSignals<TProps> = {
    [Key in keyof TProps]: Signal<TProps[Key]> | TProps[Key];
};
export type PropertiesAreSignals<TProps> = {
    [Key in keyof TProps]: Signal<TProps[Key]>;
};

/**
 * Extended by declaration merging into IntrinsicElementNames and IntrinsicElementAttributeParts.
 */
export type IntrinsicRawElementAttributes<TElementTypeString extends string> =
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    UnionToIntersection<
        PtolemyExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>[keyof PtolemyExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>]
    > & { children?: JSXElement };


/**
 * Extended by declaration merging into RuntimeRootHostElementTypes.
 */
export type RuntimeRootHostElement =
    PtolemyExtensionPoints.RuntimeRootHostElementTypes[keyof PtolemyExtensionPoints.RuntimeRootHostElementTypes];

/**
 * Extended by declaration merging into IntrinsicElementTypes.
 */
export type IntrinsicElement =
    PtolemyExtensionPoints.IntrinsicElementTypes[keyof PtolemyExtensionPoints.IntrinsicElementTypes];
