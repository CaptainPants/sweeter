import { $insertLocation, type Component } from '@serpentis/ptolemy-core';

import { IconProviderContext } from './context/IconProviderContext.js';
import { type IconSet } from './types.js';

export interface IconProviderProps {
    icons: IconSet;
    children?: JSX.Element | undefined;
}

export const IconProvider: Component<IconProviderProps> = ({
    icons,
    children,
}) => {
    return IconProviderContext.invokeWith(icons, $insertLocation(), () => {
        return children;
    });
};
