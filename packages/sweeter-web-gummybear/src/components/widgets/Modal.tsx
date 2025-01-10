import {
    $children,
    $derived,
    $val,
    type Component,
    Portal,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';

import { themeStructure } from '../../theme/themeStructure.js';

const classes = {
    backdrop: new GlobalCssClass({
        className: 'Modal-Backdrop',
        content: stylesheet`
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            background: var(${themeStructure.modal.backdropBackground.cssVar});
            opacity: 0.8;
        `,
    }),
    centerColumn: new GlobalCssClass({
        className: 'Modal-CenterColumn',
        content: stylesheet`
            position: fixed;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
            padding: 20px;
        `,
    }),
    verticalSpacer: new GlobalCssClass({
        className: 'Modal-VerticalSpacer',
        content: stylesheet`
            flex-grow: 1;
        `,
    }),
    window: new GlobalCssClass({
        className: 'Modal-Window',
        content: stylesheet`
            position: relative;

            background: var(${themeStructure.modal.windowBackground.cssVar});
            border: var(${themeStructure.modal.border.cssVar});
            border-radius: var(${themeStructure.modal.borderRadius.cssVar});

            max-width: 1000px;
            width: 100%;
            box-sizing: border-box;

            display: flex;
            flex-direction: column;

            overflow: hidden;
        `,
    }),
    header: new GlobalCssClass({
        className: 'Modal-Header',
        content: stylesheet`
            display: flex;
            flex-direction: row;
            align-items: center;

            margin: var(${themeStructure.modal.padding.cssVar});
            margin-bottom: 0px;
            padding-bottom: var(${themeStructure.modal.padding.cssVar});

            border-bottom: var(${themeStructure.modal.headerBottomBorder.cssVar});
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
            width:  var(${themeStructure.modal.closeButtonSize.cssVar});
            height:  var(${themeStructure.modal.closeButtonSize.cssVar});

            border: solid black 1px;
            border-radius: 4px;
            margin: 1px;

            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;

            vertical-align: center;

            &:hover {
                background-color: #505050;
            }
        `,
    }),
    body: new GlobalCssClass({
        className: 'Modal-Body',
        content: stylesheet`
            margin: var(${themeStructure.modal.padding.cssVar});
            flex-shrink: 1;

            overflow: auto;
            
            // So that outlines at the top of the box aren't chopped off
            padding-top: 2px;
        `,
    }),
    footer: new GlobalCssClass({
        className: 'Modal-Footer',
        content: stylesheet`
            margin: var(${themeStructure.modal.padding.cssVar});

            display: flex;
            flex-direction: row;
            // align footer buttons to the end
            justify-content: flex-end;
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

    return $derived(() => {
        if ($val(isOpen) === false) {
            // Is it OK not to mount(/invoke callback) the children?
            return undefined;
        }

        return (
            <Portal target={container}>
                <div>
                    <div class={classes.backdrop} onclick={onClose} />
                    <div class={classes.centerColumn}>
                        <div class={classes.verticalSpacer} />
                        <div class={classes.window}>
                            <div class={classes.header}>
                                <div class={classes.title}>
                                    {$children(title)}
                                </div>
                                <div
                                    onclick={onClose}
                                    class={classes.closeButton}
                                >
                                    ×
                                </div>
                            </div>
                            <div class={classes.body}>
                                {$children(children)}
                            </div>
                            <div class={classes.footer}>
                                {$children(footer)}
                            </div>
                        </div>
                        <div class={classes.verticalSpacer} />
                    </div>
                </div>
            </Portal>
        );
    });
};
