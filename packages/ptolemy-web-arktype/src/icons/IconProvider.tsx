import {
    $derived,
    $insertLocation,
    type Component,
} from '@serpentis/ptolemy-core';

import { IconProviderContext } from './context/IconProviderContext.js';
import { type IconSet } from './types.js';

export interface IconProviderProps {
    icons: IconSet;
    children?: JSX.Element | undefined;
}

// At the moment this will just rebuild everything if the icons change,
// which I think is good enough, but might want to consider .. not doing that
export const IconProvider: Component<IconProviderProps> = ({
    icons,
    children,
}) => {
    return $derived(() => {
        return IconProviderContext.invokeWith(
            icons.value,
            $insertLocation(),
            () => {
                return children?.value;
            },
        );
    });
};
