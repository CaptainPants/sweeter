import { type ComponentInit } from "./ComponentInit.js";

export type HookFactory<TArgs extends readonly unknown[], TResult> = (
    setup: ComponentInit,
    ...args: TArgs
) => TResult;

export type HookConstructor<TArgs extends readonly unknown[], TResult> = new (
    setup: ComponentInit,
    ...args: TArgs
) => TResult;

export type HookInitializer<TArgs extends readonly unknown[], TResult> =
    | HookFactory<TArgs, TResult>
    | HookConstructor<TArgs, TResult>;