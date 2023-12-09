import { GlobalCssStylesheet } from '@captainpants/sweeter-web';
import { varNames } from './vars.js';

export interface ThemeOptions {}

export function createTheme(options: ThemeOptions) {
    return new GlobalCssStylesheet({
        id: 'theme',
        content: `
            :root {
                ${varNames.columnPadding}: 10px;
            }
        `,
    });
}
