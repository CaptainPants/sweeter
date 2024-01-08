import { type TypeMatcherRule } from '@captainpants/typeytypetype';

import {
    type EditButtonComponentType,
    type EditorComponentType,
    type ModalComponentType,
} from '../types.js';
import { Context } from '@captainpants/sweeter-core';

export interface EditorProviderContextType {
    modalComponentType?: ModalComponentType | undefined;
    editButtonComponentType?: EditButtonComponentType | undefined;
    rules: Array<TypeMatcherRule<EditorComponentType>>;
}

export const EditorProviderContext = new Context<EditorProviderContextType>(
    'EditorProvider',
    {
        rules: [],
    },
);
