import type { ComponentInit } from '@captainpants/wireyui-core';
import { type GlobalCssClass } from './GlobalCssClass.js';
import { WebRuntimeContext } from '../runtime/WebRuntimeContext.js';

export class StyleHooks {
    constructor(init: ComponentInit) {
        this.#context = init.getContext(WebRuntimeContext);
    }

    #context: WebRuntimeContext;

    getClassName(cssClass: GlobalCssClass) {
        return cssClass.className;
    }
}
