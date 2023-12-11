type ValidOption = {
    cssVar: string;
    defaultValue: string | number | undefined;
};

export const themeOptions = {
    bodyBackground: { cssVar: '--body-background', defaultValue: 'black' },
    fontColor: { cssVar: '--font-color', defaultValue: 'white' },

    // Grid
    columnPadding: { cssVar: '--column-padding', defaultValue: '10px' },

    // Input
    inputBorderWidth: { cssVar: '--input-border-width', defaultValue: '1px' },
    inputBorderColor: {
        cssVar: '--input-border-color',
        defaultValue: '#dddddd',
    },
    inputBorderRadius: {
        cssVar: '--input-border-radius',
        defaultValue: '0.375rem',
    },
    inputBackgroundColor: {
        cssVar: '--input-background-color',
        defaultValue: 'transparent',
    },

    inputFocusOutlineColor: {
        cssVar: '--input-focus-outline-color',
        defaultValue: 'red',
    },
    inputFocusOutlineWidth: {
        cssVar: '--input-focus-outline-width',
        defaultValue: '3px',
    },
} as const satisfies Record<string, ValidOption>;
