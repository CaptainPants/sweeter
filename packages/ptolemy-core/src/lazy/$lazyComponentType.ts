import { $async } from '../components/Async.js';
import { getRuntime } from '../runtime/Runtime.js';
import { $val } from '../signals/$val.js';
import { type Component, type PropsInputFor } from '../types/index.js';

import { $lazy } from './$lazy.js';

/**
 * Create a new lazy loaded component - to be used for SPA-style applications.
 * @param callback
 * @returns
 */
export function $lazyComponentType<TProps>(
    callback: () => Promise<Component<TProps>>,
): Component<TProps> {
    const lazy = $lazy(callback);

    // TODO: this component ideally shouldn't map the props at all and just pass them through unchanged
    // but we don't currently have a mechanism for that..
    // might need to add that as a property on Component
    const result: Component<TProps> = (props) => {
        return $async(
            () => lazy.promise,
            (LoadedComponent) => {
                return getRuntime().jsx(
                    $val(LoadedComponent),
                    props as PropsInputFor<Component<TProps>>,
                );
            },
        );
    };

    return result;
}
