import { type EditorSettings } from '../types.js';
import { Context } from '@captainpants/sweeter-core';

export interface EditorHostContextType {
    settings: EditorSettings;
}

export const EditorHostContext = new Context<EditorHostContextType>(
    'EditorHost',
    {
        get settings(): EditorSettings {
            throw new TypeError('No context found.');
        },
    },
);
