import { Context } from "@captainpants/sweeter-core";
import { type Theme } from './types.js';

export interface ThemeContextType {
    theme: Theme;
}

export const ThemeContext = new Context<ThemeContextType>('ThemeContext', {
    get theme(): Theme {
        throw new TypeError('Context not found.');
    }
});