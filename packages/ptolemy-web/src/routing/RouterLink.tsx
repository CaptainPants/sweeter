/* @jsxImportSource .. */

import {
    type Component,
    type IntrinsicRawElementAttributes,
} from '@serpentis/ptolemy-core';

import { type TypedEvent } from '../IntrinsicAttributes.js';

import { NavigateHook } from './NavigateHook.js';

export interface RouterLinkProps {
    href?: string | undefined;

    onClick?: (evt: TypedEvent<HTMLAnchorElement, MouseEvent>) => void;

    passthrough?: Omit<IntrinsicRawElementAttributes<'a'>, 'href'>;
}

export const RouterLink: Component<RouterLinkProps> = (
    { href, onClick: onClickProp, passthrough },
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

    return <a href={href} onclick={onClick} {...passthrough} />;
};
