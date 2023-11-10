import type { Signal } from '@captainpants/wireyui-core';
import type { GlobalCssClass } from './index.js';

export interface GlobalStylesheet {
    readonly symbol: symbol;
    readonly id: string;
    readonly content: string;
}

export type ElementCssClasses =
    | Signal<ElementCssClasses>
    | string
    | GlobalCssClass
    | undefined
    | null
    | (
          | string
          | GlobalCssClass
          | undefined
          | null
          | Signal<ElementCssClasses>
      )[];
