/* @jsxImportSource .. */

import {
    $peek,
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';

import { type TypedEvent } from '../IntrinsicAttributes.js';

import { NavigateHook } from './NavigateHook.js';

export type RouterLinkProps = PropertiesMightBeSignals<{
    href?: string | undefined;
}> &
    Omit<IntrinsicElementAttributes<'a'>, 'href'>;

export const RouterLink: Component<RouterLinkProps> = (
    { href, onclick: onclickProp, ...rest },
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

            const hrefResolved = $peek(href);
            if (hrefResolved) {
                navigate(hrefResolved);
            }
            return;
        }

        onclickProp?.call(this, evt);
    }

    return <a href={href} onclick={onClick} {...rest} />;
};
