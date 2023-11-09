import type { ComponentInit } from '@captainpants/wireyui-core';
import {
    WebRuntimeContext,
    type WebRuntimeContextType,
} from '../runtime/index.js';
import { type GlobalCssClass } from './GlobalCssClass.js';

export class StyleHooks {
    constructor(init: ComponentInit) {
        this.#context = init.getContext(WebRuntimeContext);
    }

    #context: WebRuntimeContextType;

    getClassName(cssClass: GlobalCssClass) {
        return cssClass.className;
    }
}
