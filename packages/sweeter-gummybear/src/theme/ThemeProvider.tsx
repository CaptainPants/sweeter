import { $calc, $children, $val, type Component, type PropertiesMightBeSignals } from "@captainpants/sweeter-core";
import { type Theme } from './types.js';
import { ThemeContext } from "./context.js";

export type ThemeProviderProps = PropertiesMightBeSignals<{
    theme: Theme;
    children?: () => JSX.Element;
}>;

export const ThemeProvider: Component<ThemeProviderProps> = ({ theme, children }) => {
    return $calc(() => {
        const themeValue = $val(theme);

        return ThemeContext.invokeWith(
            { theme: themeValue },
            () => <>
                <themeValue.IncludeThemeStylesheets />
                {$children(children)}
            </>
        );
    })
}