import {
    $children,
    $derived,
    $insertLocation,
    $val,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';

import { ThemeContext } from './context.js';
import { type Theme } from './types.js';

export type ThemeProviderProps = PropertiesMightBeSignals<{
    theme: Theme;
    children?: () => JSX.Element;
}>;

export const ThemeProvider: Component<ThemeProviderProps> = ({
    theme,
    children,
}) => {
    return $derived(() => {
        const themeValue = $val(theme);

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
