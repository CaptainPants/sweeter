import { Context } from '@captainpants/sweeter-core';

import {
    ArrowDownRight,
    Grip,
    type IconNode,
    Trash2,
    createElement,
    Pencil,
    ListPlus,
} from 'lucide';
import { type IconProps, type IconSet } from '../types.js';

function createAndSetupElement(icon: IconNode, props: IconProps) {
    const result = createElement(icon);
    // This function currently is a simple wrapper around lucides createElement - but the idea is to later add any formatting/theming we might need.
    return result;
}

export const IconProviderContext = new Context<IconSet>('IconProviderContext', {
    Child: (props) => createAndSetupElement(ArrowDownRight, props),
    DragHandle: (props) => createAndSetupElement(Grip, props),
    Delete: (props) => createAndSetupElement(Trash2, props),
    Edit: (props) => createAndSetupElement(Pencil, props),
    Add: (props) => createAndSetupElement(ListPlus, props),
});
