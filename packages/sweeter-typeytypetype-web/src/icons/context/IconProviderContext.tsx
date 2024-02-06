import {
    type Component,
    Context,
    $calc,
    $val,
} from '@captainpants/sweeter-core';

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
import {
    type ElementCssClasses,
    GlobalCssClass,
    stylesheet,
} from '@captainpants/sweeter-web';

function createIconComponent(icon: IconNode): Component<IconProps> {
    return ({ hoverable, style, class: classProp }) => {
        const svg = createElement(icon);

        const classes: ElementCssClasses[] = [classProp, css.iconContainer];
        if (hoverable) {
            classes.push($calc(() => ($val(hoverable) ? css.hoverable : null)));
        }

        return (
            <div class={classes} style={style}>
                {svg}
            </div>
        );
    };
}

export const IconProviderContext = new Context<IconSet>('IconProviderContext', {
    Child: createIconComponent(ArrowDownRight),
    DragHandle: createIconComponent(Grip),
    Delete: createIconComponent(Trash2),
    Edit: createIconComponent(Pencil),
    Add: createIconComponent(ListPlus),
});

const hoverable = new GlobalCssClass({
    className: 'is-hoverable',
});

const css = {
    hoverable,
    iconContainer: new GlobalCssClass({
        className: 'IconContainer',
        content: stylesheet`
            &.${hoverable} {
                cursor: pointer;

                :hover { 
                    color: #777777;
                }
            }

            > * {
                transition: color .15s ease-in-out;
            }
        `,
    }),
};
