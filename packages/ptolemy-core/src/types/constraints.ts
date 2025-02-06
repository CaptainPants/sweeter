import { type Component } from './Component.js';

export type ComponentTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any>;

export type ComponentOrIntrinsicElementTypeConstraint =
    | ComponentTypeConstraint
    | string;
