/* @jsxImportSource .. */

import {
    type Component,
    type IntrinsicRawElementAttributes,
    type JSXElement,
    mapProps,
    type Prop,
    type PropertiesAreSignals,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';

import { type TypedEvent } from '../IntrinsicAttributes.js';

import { NavigateHook } from './NavigateHook.js';

type PassthoughProps = Omit<IntrinsicRawElementAttributes<'a'>, 'href'>;

export interface RouterLinkProps {
    href?: string | undefined;

    onClick?: (evt: TypedEvent<HTMLAnchorElement, MouseEvent>) => void;

    passthrough?: Prop<
        PropertiesMightBeSignals<PassthoughProps>,
        PropertiesAreSignals<PassthoughProps>
    >;

    children?: JSXElement;
}

export const RouterLink: Component<RouterLinkProps> = (
    { href, onClick: onClickProp, passthrough, children },
    init,
) => {
    const { navigate } = init.hook(NavigateHook);

    function onClick(
        this: HTMLAnchorElement,
        evt: TypedEvent<HTMLAnchorElement, MouseEvent>,
    ) {
        if (evt.button === 0) {
            // Left mouse button
            evt.preventDefault(); // Preventes normal browser navigation

            const hrefResolved = href?.peek();
            if (hrefResolved) {
                navigate(hrefResolved);
            }
            return;
        }

        onClickProp?.value?.call(this, evt);
    }

    return (
        <a href={href} onclick={onClick} {...passthrough}>
            {children}
        </a>
    );
};

RouterLink.propMappings = {
    passthrough: (input) => {
        const res = mapProps<PropertiesAreSignals<PassthoughProps>>(
            undefined,
            input,
        );
        return res;
    },
};
