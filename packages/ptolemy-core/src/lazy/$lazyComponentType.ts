import { $async } from '../components/Async.js';
import { getRuntime } from '../runtime/Runtime.js';
import { $val } from '../signals/$val.js';
import {
    type Component,
    type PropsInputFor,
} from '../types.js';

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
