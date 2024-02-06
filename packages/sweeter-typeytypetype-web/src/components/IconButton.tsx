import {
    $calc,
    $val,
    type Component,
    type PropertiesMightBeSignals,
    type ContextType,
} from '@captainpants/sweeter-core';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { Button } from '@captainpants/sweeter-gummybear';

export type IconButtonProps = PropertiesMightBeSignals<{
    icon: keyof ContextType<typeof IconProviderContext>;
    text?: string | undefined;
    onClick?: () => void;
}>;

export const IconButton: Component<IconButtonProps> = (
    { text, icon, onClick },
    init,
) => {
    const icons = init.getContext(IconProviderContext);

    return $calc(() => {
        const iconValue = $val(icon);
        const Icon = icons[iconValue];

        return (
            <Button class={css.addButton} onclick={onClick} outline>
                <Icon />
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
