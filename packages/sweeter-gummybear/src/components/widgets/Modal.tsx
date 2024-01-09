import {
    type Component,
    Portal,
    $calc,
    $val,
    type PropertiesMightBeSignals,
    $resolve,
} from '@captainpants/sweeter-core';

import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';

const classes = {
    frame: new GlobalCssClass({
        className: 'Modal_background',
        content: stylesheet`
            position: fixed;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        `,
    }),
    background: new GlobalCssClass({
        className: 'Modal-Background',
        content: stylesheet`
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            background: black;
            opacity: 0.8;
        `,
    }),
    window: new GlobalCssClass({
        className: 'Modal-Window',
        content: stylesheet`
            background: #e0e0e0;
            border: solid green 1px;

            max-width: 1000px;
            margin: 0 auto;
        `,
    }),
    heading: new GlobalCssClass({
        className: 'Modal-Heading',
        content: stylesheet`
            display: flex;
            flex-direction: row;
        `,
    }),
    title: new GlobalCssClass({
        className: 'Modal-Title',
        content: stylesheet`
            flex: 1;
        `,
    }),
    closeButton: new GlobalCssClass({
        className: 'Modal-CloseButton',
        content: stylesheet`
            
        `,
    }),
    body: new GlobalCssClass({
        className: 'Modal-Body',
        content: stylesheet`

        `,
    }),
    footer: new GlobalCssClass({
        className: 'Modal-ButtonRow',
        content: stylesheet`

        `,
    }),
} as const;

export type ModalProps = PropertiesMightBeSignals<{
    title?: JSX.Element | (() => JSX.Element);
    footer?: JSX.Element | (() => JSX.Element);

    children?: JSX.Element | (() => JSX.Element);

    isOpen?: boolean;

    onClose?: (() => void) | undefined;
}>;

export const Modal: Component<ModalProps> = (
    { title, children, footer, isOpen, onClose },
    init,
) => {
    const container = document.createElement('div');

    init.onMount(() => {
        document.body.appendChild(container);

        return () => {
            container.remove();
        };
    });

    return $calc(() => {
        if (!$val(isOpen)) {
            // Is it OK not to mount(/invoke callback) the children?
            return undefined;
        }

        return (
            <Portal target={container}>
                <div class={classes.frame}>
                    <div class={classes.background} onclick={onClose} />
                    <div class={classes.window}>
                        <div class={classes.heading}>
                            <div class={classes.title}>{$resolve(title)}</div>
                            <div onclick={onClose} class={classes.closeButton}>
                                x
                            </div>
                        </div>
                        <div class={classes.body}>{$resolve(children)}</div>
                    </div>
                    <div class={classes.footer}>{$resolve(footer)}</div>
                </div>
            </Portal>
        );
    });
};
