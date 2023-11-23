import type { Runtime } from '@captainpants/sweeter-core';
import type { GlobalStyleSheetContentGeneratorContext } from '../index.js';

export interface WebRuntime
    extends Runtime,
        GlobalStyleSheetContentGeneratorContext {}
