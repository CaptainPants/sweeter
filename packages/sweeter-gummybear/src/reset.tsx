import { GlobalCssStylesheet } from '@captainpants/sweeter-web';

export const reset = new GlobalCssStylesheet({
    id: 'reset',
    content: `
        input, textarea, td, th {
            font-family: inherit;
            font-size: inherit;
        }
    `,
});
