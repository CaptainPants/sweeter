import {
    $children,
    $derived,
    $insertLocation,
    type Component,
} from '@serpentis/ptolemy-core';

import { ThemeContext } from './context.js';
import { type Theme } from './types.js';

export interface ThemeProviderProps {
    theme: Theme;
    children?: () => JSX.Element;
};

export const ThemeProvider: Component<ThemeProviderProps> = ({
    theme,
    children,
}) => {
    return $derived(() => {
        const themeValue = theme.value;

        return ThemeContext.invokeWith(
            { theme: themeValue },
            $insertLocation(),
            () => (
                <>
                    <themeValue.IncludeThemeStylesheets />
                    {$children(children)}
                </>
            ),
        );
    });
};
