import { type TypeMatcherRule } from '@captainpants/arktype-modeling';
import {
    type ModalComponentType,
    type EditorSettings,
    type EditorComponentType,
} from '../types.js';
import { Context } from '@captainpants/sweeter-core';

export interface EditorRootContextType {
    settings: EditorSettings;
    Modal: ModalComponentType;
    rules: Array<TypeMatcherRule<EditorComponentType>>;
}

export const EditorRootContext = new Context<EditorRootContextType>(
    'EditorHost',
    {
        get settings(): EditorSettings {
            throw new TypeError('No context found.');
        },
        get Modal(): ModalComponentType {
            throw new TypeError('No context found.');
        },
        get rules(): Array<TypeMatcherRule<EditorComponentType>> {
            throw new TypeError('No context found.');
        },
    },
);
