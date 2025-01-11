import {
    type ComponentInit,
    type HookConstructor,
    type HookFactory,
    type HookInitializer,
} from '../types.js';

export function initializeHook<TArgs extends readonly unknown[], TResult>(
    init: ComponentInit,
    hookInitializer: HookInitializer<TArgs, TResult>,
    ...args: TArgs
): TResult {
    if ('prototype' in hookInitializer) {
        return new (hookInitializer as HookConstructor<TArgs, TResult>)(
            init,
            ...args,
        );
    }

    return (hookInitializer as HookFactory<TArgs, TResult>)(init, ...args);
}
