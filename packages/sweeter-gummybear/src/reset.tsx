import { GlobalCssStylesheet } from '@captainpants/sweeter-web';

export const reset = new GlobalCssStylesheet({
    id: 'reset',
    content: `
        select, option, input, textarea, tabel, thead, tbody, tr, td, th {
            font-family: inherit;
            font-size: inherit;
        }
    `,
    // Pre-processor not required
    preprocess: false,
});
