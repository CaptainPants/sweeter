import { type TypeMatcherRule } from '@captainpants/typeytypetype';
import { type ModalComponentType, type EditorSettings, type EditButtonComponentType, type EditorComponentType } from '../types.js';
import { Context } from '@captainpants/sweeter-core';

export interface EditorRootContextType {
    settings: EditorSettings;
    modalComponentType: ModalComponentType | undefined;
    editButtonComponentType: EditButtonComponentType | undefined;
    rules: Array<TypeMatcherRule<EditorComponentType>>;
}

export const EditorRootContext = new Context<EditorRootContextType>(
    'EditorHost',
    {
        get settings(): EditorSettings {
            throw new TypeError('No context found.');
        },
        get modalComponentType(): ModalComponentType | undefined {
            throw new TypeError('No context found.');
        },
        get editButtonComponentType(): EditButtonComponentType | undefined {
            throw new TypeError('No context found.');
        },
        get rules(): Array<TypeMatcherRule<EditorComponentType>> {
            throw new TypeError('No context found.');
        }
    },
);
