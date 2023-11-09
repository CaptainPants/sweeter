import type { ComponentInit } from '@captainpants/wireyui-core';
import { type GlobalCssClass } from './GlobalCssClass.js';
import {
    WebRuntimeContext,
    type WebRuntimeContextType,
} from '../runtime/WebRuntimeContext.js';

export class StyleHooks {
    constructor(init: ComponentInit) {
        this.#context = init.getContext(WebRuntimeContext);
    }

    #context: WebRuntimeContextType;

    getClassName(cssClass: GlobalCssClass) {
        return cssClass.className;
    }
}
