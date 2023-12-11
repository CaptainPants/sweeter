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
        },
        secondary: {
            color: {
                cssVar: '--variant-secondary-color',
                defaultValue: '#6c757d',
            },
        },
        success: {
            color: {
                cssVar: '--variant-success-color',
                defaultValue: '#198754',
            },
        },
        danger: {
            color: {
                cssVar: '--variant-danger-color',
                defaultValue: '#dc3545',
            },
        },
        warning: {
            color: {
                cssVar: '--variant-warning-color',
                defaultValue: '#ffc107',
            },
        },
        info: {
            color: {
                cssVar: '--variant-info-color',
                defaultValue: '#0dcaf0',
            },
        },
        light: {
            color: {
                cssVar: '--variant-light-color',
                defaultValue: '#f8f9fa',
            },
        },
        dark: {
            color: {
                cssVar: '--variant-dark-color',
                defaultValue: '#212529',
            },
        },

        buttonVariants: {
            primary: {
                textColor: {
                    cssVar: '--button-variant-primary-text-color',
                    defaultValue: '#ffffff',
                },
            },
            secondary: {
                textColor: {
                    cssVar: '--button-variant-primary-text-color',
                    defaultValue: '#ffffff',
                },
            },
            success: {
                textColor: {
                    cssVar: '--button-variant-primary-text-color',
                    defaultValue: '#000000',
                },
            },
            danger: {
                textColor: {
                    cssVar: '--button-variant-danger-text-color',
                    defaultValue: '#000000',
                },
            },
            warning: {
                textColor: {
                    cssVar: '--button-variant-warning-text-color',
                    defaultValue: '#FFFFFF',
                },
            },
            info: {
                textColor: {
                    cssVar: '--button-variant-warning-text-color',
                    defaultValue: '#FFFFFF',
                },
            },
            light: {
                textColor: {
                    cssVar: '--button-variant-warning-text-color',
                    defaultValue: '#FFFFFF',
                },
            },
            dark: {
                textColor: {
                    cssVar: '--button-variant-warning-text-color',
                    defaultValue: '#FFFFFF',
                },
            },
        },
    },
} as const satisfies Record<string, ThemeOptionOrGroup>;
