import { GlobalCssStylesheet, IncludeStylesheet } from '@serpentis/ptolemy-web';

export const reset = new GlobalCssStylesheet({
    id: 'reset',
    content: `
        /*thead, tbody, tr, td, th {
            background: transparent;
            color: inherit;
        }*/

        select, option, input, textarea, tabel, thead, tbody, tr, td, th, button {
            font-family: inherit;
            font-size: inherit;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: sans-serif;
        }
    `,
    // Pre-processor not required
    preprocess: false,
});

/**
 * Shorthand to include the reset stylesheet.
 * @returns
 */
export const Reset = () => <IncludeStylesheet stylesheet={reset} />;
