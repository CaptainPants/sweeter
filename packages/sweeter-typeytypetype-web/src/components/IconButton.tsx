import {
    $calc,
    $val,
    type Component,
    type PropertiesMightBeSignals,
    type ContextType,
    $peek,
} from '@captainpants/sweeter-core';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import {
    GlobalCssClass,
    type TypedEvent,
    stylesheet,
} from '@captainpants/sweeter-web';
import { Button } from '@captainpants/sweeter-gummybear';

export type IconButtonProps = PropertiesMightBeSignals<{
    icon: keyof ContextType<typeof IconProviderContext>;
    text?: string | undefined;
    onLeftClick?: () => void;
    hoverable?: boolean;
}>;

export const IconButton: Component<IconButtonProps> = (
    { hoverable, text, icon, onLeftClick: onClick },
    init,
) => {
    const icons = init.getContext(IconProviderContext);

    return $calc(() => {
        const iconValue = $val(icon);
        const Icon = icons[iconValue];

        const callback = (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
            const onClickResolved = $peek(onClick);
            if (onClickResolved && evt.button === 0) {
                onClickResolved?.();
            }
        };

        return (
            <Button class={css.addButton} onclick={callback} outline>
                <Icon hoverable={hoverable} />
                <div>{text}</div>
            </Button>
        );
    });
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
