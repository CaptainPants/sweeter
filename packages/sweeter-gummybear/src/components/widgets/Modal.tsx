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
        className: 'Modal-Frame',
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

            overflow: auto;
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
            position: relative;

            background: #606060;
            border: solid green 1px;

            max-width: 1000px;
            width: 100%;
            box-sizing: border-box;
        `,
    }),
    header: new GlobalCssClass({
        className: 'Modal-Header',
        content: stylesheet`
            display: flex;
            flex-direction: row;
            align-items: center;

            padding: 4px;
            border-bottom: solid black 1px;
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
            width: 20px;
            
            height: 20px;
            border: solid black 1px;
            border-radius: 4px;
            margin: 1px;

            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: #505050;
            }
        `,
    }),
    body: new GlobalCssClass({
        className: 'Modal-Body',
        content: stylesheet`
            padding: 4px;
        `,
    }),
    footer: new GlobalCssClass({
        className: 'Modal-ButtonRow',
        content: stylesheet`
            padding: 4px;

            // align footer buttons to the end
            align-content: flex-end;
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
                        <div class={classes.header}>
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
