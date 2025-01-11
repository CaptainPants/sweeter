import { dev } from '@captainpants/sweeter-core';

import { type AbstractGlobalCssStylesheet } from './index.js';

export class StylesheetDependencyProvider {
    #callbacks: ((dependency: AbstractGlobalCssStylesheet) => void)[] = [];
    #frozen?: boolean;

    addDependency(dependency: AbstractGlobalCssStylesheet): this {
        if (this.#frozen) {
            return this;
        }

        for (const callback of this.#callbacks) {
            try {
                callback(dependency);
            } catch (ex) {
                dev.swallowedError('Swallowed error', ex);
            }
        }
        return this;
    }

    addDependencyListener(
        callback: (dependency: AbstractGlobalCssStylesheet) => void,
    ): void {
        if (this.#frozen) {
            return;
        }

        this.#callbacks.push(callback);
    }

    freeze(): void {
        this.#frozen = true;
    }
}
