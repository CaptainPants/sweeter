import { Context } from '@captainpants/sweeter-core';

import {
    ArrowDownRight,
    Grip,
    type IconNode,
    Trash2,
    createElement,
} from 'lucide';
import { type IconProps, type IconSet } from '../types.js';

function createAndSetupElement(icon: IconNode, props: IconProps) {
    const result = createElement(icon);
    return result;
}

export const IconProviderContext = new Context<IconSet>('IconProviderContext', {
    Child: (props) => createAndSetupElement(ArrowDownRight, props),
    DragHandle: (props) => createAndSetupElement(Grip, props),
    Delete: (props) => createAndSetupElement(Trash2, props),
});
