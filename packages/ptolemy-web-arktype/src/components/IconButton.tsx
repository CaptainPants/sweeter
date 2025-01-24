import {
    $derived,
    $peek,
    $val,
    type Component,
    type ContextType,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    GlobalCssClass,
    stylesheet,
    type TypedEvent,
} from '@serpentis/ptolemy-web';
import { Button } from '@serpentis/ptolemy-web-stardust';

import { IconProviderContext } from '../icons/context/IconProviderContext.js';

export type IconButtonProps = PropertiesMightBeSignals<{
    icon: keyof ContextType<typeof IconProviderContext>;
    text?: string | undefined;
    onLeftClick?: () => void;
    hoverable?: boolean;
}>;

export const IconButton: Component<IconButtonProps> = (
    { hoverable, text, icon, onLeftClick },
    init,
) => {
    const icons = init.getContext(IconProviderContext);

    const callback = (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
        const onClickResolved = $peek(onLeftClick);
        if (onClickResolved && evt.button === 0) {
            onClickResolved?.();
        }
    };

    return (
        <Button class={css.addButton} onclick={callback} outline>
            {$derived(() => {
                const iconValue = $val(icon);
                const Icon = icons[iconValue];
                return <Icon hoverable={hoverable} />;
            })}
            <div>{text}</div>
        </Button>
    );
};

const css = {
    addButton: new GlobalCssClass({
        className: 'IconButton',
        content: stylesheet`
            display: flex;
            flex-direction: row;
            align-items: center;

            > * {
                margin-left: 6px;
            }

            > :first-child {
                margin-left: 0px;
            }
        `,
    }),
};
