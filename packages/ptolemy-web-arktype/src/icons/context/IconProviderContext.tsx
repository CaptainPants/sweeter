import {
    ArrowDownRight,
    createElement,
    Grip,
    type IconNode,
    ListPlus,
    Pencil,
    Trash2,
} from 'lucide';

import {
    $derived,
    $val,
    type Component,
    Context,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    GlobalCssClass,
    stylesheet,
} from '@serpentis/ptolemy-web';

import { type IconProps, type IconSet } from '../types.js';

function createIconComponent(icon: IconNode): Component<IconProps> {
    return ({ hoverable, style, class: classProp }) => {
        const svg = createElement(icon);

        const classes: ElementCssClasses[] = [classProp, css.iconContainer];
        if (hoverable) {
            classes.push(
                $derived(() => ($val(hoverable) ? css.hoverable : null)),
            );
        }

        return (
            <div class={classes} style={style}>
                {svg}
            </div>
        );
    };
}

export const defaultIconSet: IconSet = {
    Child: createIconComponent(ArrowDownRight),
    DragHandle: createIconComponent(Grip),
    Delete: createIconComponent(Trash2),
    Edit: createIconComponent(Pencil),
    Add: createIconComponent(ListPlus),
};

export const IconProviderContext = new Context<IconSet>(
    'IconProviderContext',
    defaultIconSet,
);

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
