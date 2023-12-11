export type ThemeOption = {
    cssVar: string;
    defaultValue: string | number | undefined;
};

export type ThemeOptionOrGroup =
    | ThemeOption
    | { [key: string]: ThemeOptionOrGroup };

export const themeOptions = {
    bodyBackground: { cssVar: '--body-background', defaultValue: 'black' },

    common: {
        fontColor: { cssVar: '--font-color', defaultValue: 'white' },
    },

    // Grid
    grid: {
        columnPadding: { cssVar: '--column-padding', defaultValue: '10px' },
    },

    // Input
    input: {
        borderWidth: { cssVar: '--input-border-width', defaultValue: '1px' },
        borderColor: {
            cssVar: '--input-border-color',
            defaultValue: '#dddddd',
        },
        borderRadius: {
            cssVar: '--input-border-radius',
            defaultValue: '0.375rem',
        },
        backgroundColor: {
            cssVar: '--input-background-color',
            defaultValue: 'transparent',
        },

        focusOutlineColor: {
            cssVar: '--input-focus-outline-color',
            defaultValue: 'red',
        },
        focusOutlineWidth: {
            cssVar: '--input-focus-outline-width',
            defaultValue: '3px',
        },
    },

    // Variant colours
    variants: {
        primary: {
            color: {
                cssVar: '--variant-primary-color',
                defaultValue: '#0d6efd',
            },
            hoverColor: {
                cssVar: '--variant-primary-hover-color',
                defaultValue: '#0b5ed7',
            },
        },
        secondary: {
            color: {
                cssVar: '--variant-secondary-color',
                defaultValue: '#6c757d',
            },
            hoverColor: {
                cssVar: '--variant-secondary-hover-color',
                defaultValue: '#5c636a',
            },
        },
        success: {
            color: {
                cssVar: '--variant-success-color',
                defaultValue: '#198754',
            },
            hoverColor: {
                cssVar: '--variant-success-hover-color',
                defaultValue: '#157347',
            },
        },
        danger: {
            color: {
                cssVar: '--variant-danger-color',
                defaultValue: '#dc3545',
            },
            hoverColor: {
                cssVar: '--variant-danger-hover-color',
                defaultValue: '#bb2d3b',
            },
        },
        warning: {
            color: {
                cssVar: '--variant-warning-color',
                defaultValue: '#ffc107',
            },
            hoverColor: {
                cssVar: '--variant-warning-hover-color',
                defaultValue: '#ffca2c',
            },
        },
        info: {
            color: {
                cssVar: '--variant-info-color',
                defaultValue: '#0dcaf0',
            },
            hoverColor: {
                cssVar: '--variant-info-hover-color',
                defaultValue: '#31d2f2',
            },
        },
        light: {
            color: {
                cssVar: '--variant-light-color',
                defaultValue: '#f8f9fa',
            },
            hoverColor: {
                cssVar: '--variant-light-hover-color',
                defaultValue: '#d3d4d5',
            },
        },
        dark: {
            color: {
                cssVar: '--variant-dark-color',
                defaultValue: '#212529',
            },
            hoverColor: {
                cssVar: '--variant-dark-hover-color',
                defaultValue: '#424649',
            },
        },
    },

    buttonVariants: {
        primary: {
            textColor: {
                cssVar: '--button-variant-primary-text-color',
                defaultValue: '#FFFFFF',
            },
        },
        secondary: {
            textColor: {
                cssVar: '--button-variant-secondary-text-color',
                defaultValue: '#FFFFFF',
            },
        },
        success: {
            textColor: {
                cssVar: '--button-variant-success-text-color',
                defaultValue: '#FFFFFF',
            },
        },
        danger: {
            textColor: {
                cssVar: '--button-variant-danger-text-color',
                defaultValue: '#FFFFFF',
            },
        },
        warning: {
            textColor: {
                cssVar: '--button-variant-warning-text-color',
                defaultValue: '#000000',
            },
        },
        info: {
            textColor: {
                cssVar: '--button-variant-info-text-color',
                defaultValue: '#FFFFFF',
            },
        },
        light: {
            textColor: {
                cssVar: '--button-variant-light-text-color',
                defaultValue: '#000000',
            },
        },
        dark: {
            textColor: {
                cssVar: '--button-variant-dark-text-color',
                defaultValue: '#FFFFFF',
            },
        },
    },
} as const satisfies Record<string, ThemeOptionOrGroup>;
