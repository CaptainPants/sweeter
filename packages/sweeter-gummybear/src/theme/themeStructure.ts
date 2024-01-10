import { type ThemeOptionOrGroupDefinition } from '../types.js';

export const themeStructure = {
    bodyBackground: {
        cssVar: '--body-background',
        defaultValue: '#000000' as string,
    },

    modal: {
        backdropBackground: {
            cssVar: '--modal-backdrop-background',
            defaultValue: '#000000' as string,
        },
        windowBackground: {
            cssVar: '--modal-window-background',
            defaultValue: '#202020' as string,
        },
        border: {
            cssVar: '--modal-border',
            defaultValue: 'solid #535353 2px' as string,
        },
        headerBottomBorder: {
            cssVar: '--modal-header-bottom-border',
            defaultValue: 'solid #535353 1px' as string,
        },
        borderRadius: {
            cssVar: '--modal-border-radius',
            defaultValue: '5px' as string,
        },
        padding: {
            cssVar: '--modal-padding',
            defaultValue: '10px' as string,
        },
        closeButtonSize: {
            cssVar: '--modal-close-button-size',
            defaultValue: '30px' as string,
        }
    },

    common: {
        fontColor: { cssVar: '--font-color', defaultValue: 'white' as string },
    },

    // Grid
    grid: {
        columnPadding: {
            cssVar: '--column-padding',
            defaultValue: '10px' as string,
        },
        rowBottomPadding: {
            cssVar: '--row-bottom-padding',
            defaultValue: '4px' as string,
        },
    },

    // Input
    input: {
        borderWidth: {
            cssVar: '--input-border-width',
            defaultValue: '1px' as string,
        },
        borderColor: {
            cssVar: '--input-border-color',
            defaultValue: '#dddddd' as string,
        },
        borderRadius: {
            cssVar: '--input-border-radius',
            defaultValue: '0' as string, // '0.375rem' as string,
        },
        backgroundColor: {
            cssVar: '--input-background-color',
            defaultValue: '#000000' as string,
        },
        color: {
            cssVar: '--input-color-color',
            defaultValue: '#FFFFFF' as string,
        },

        focusOutlineColor: {
            cssVar: '--input-focus-outline-color',
            defaultValue: '#5ec2ff' as string,
        },
        focusOutlineWidth: {
            cssVar: '--input-focus-outline-width',
            defaultValue: '3px' as string,
        },
    },

    // Variant colours
    variants: {
        primary: {
            color: {
                cssVar: '--variant-primary-color',
                defaultValue: '#0d6efd' as string,
            },
            hoverColor: {
                cssVar: '--variant-primary-hover-color',
                defaultValue: '#0b5ed7' as string,
            },
        },
        secondary: {
            color: {
                cssVar: '--variant-secondary-color',
                defaultValue: '#6c757d' as string,
            },
            hoverColor: {
                cssVar: '--variant-secondary-hover-color',
                defaultValue: '#5c636a' as string,
            },
        },
        success: {
            color: {
                cssVar: '--variant-success-color',
                defaultValue: '#198754' as string,
            },
            hoverColor: {
                cssVar: '--variant-success-hover-color',
                defaultValue: '#157347' as string,
            },
        },
        danger: {
            color: {
                cssVar: '--variant-danger-color',
                defaultValue: '#dc3545' as string,
            },
            hoverColor: {
                cssVar: '--variant-danger-hover-color',
                defaultValue: '#bb2d3b' as string,
            },
        },
        warning: {
            color: {
                cssVar: '--variant-warning-color',
                defaultValue: '#ffc107' as string,
            },
            hoverColor: {
                cssVar: '--variant-warning-hover-color',
                defaultValue: '#ffca2c' as string,
            },
        },
        info: {
            color: {
                cssVar: '--variant-info-color',
                defaultValue: '#0dcaf0' as string,
            },
            hoverColor: {
                cssVar: '--variant-info-hover-color',
                defaultValue: '#31d2f2' as string,
            },
        },
        light: {
            color: {
                cssVar: '--variant-light-color',
                defaultValue: '#f8f9fa' as string,
            },
            hoverColor: {
                cssVar: '--variant-light-hover-color',
                defaultValue: '#d3d4d5' as string,
            },
        },
        dark: {
            color: {
                cssVar: '--variant-dark-color',
                defaultValue: '#212529' as string,
            },
            hoverColor: {
                cssVar: '--variant-dark-hover-color',
                defaultValue: '#424649' as string,
            },
        },
    },

    buttonVariants: {
        primary: {
            textColor: {
                cssVar: '--button-variant-primary-text-color',
                defaultValue: '#FFFFFF' as string,
            },
        },
        secondary: {
            textColor: {
                cssVar: '--button-variant-secondary-text-color',
                defaultValue: '#FFFFFF' as string,
            },
        },
        success: {
            textColor: {
                cssVar: '--button-variant-success-text-color',
                defaultValue: '#FFFFFF' as string,
            },
        },
        danger: {
            textColor: {
                cssVar: '--button-variant-danger-text-color',
                defaultValue: '#FFFFFF' as string,
            },
        },
        warning: {
            textColor: {
                cssVar: '--button-variant-warning-text-color',
                defaultValue: '#000000' as string,
            },
        },
        info: {
            textColor: {
                cssVar: '--button-variant-info-text-color',
                defaultValue: '#FFFFFF' as string,
            },
        },
        light: {
            textColor: {
                cssVar: '--button-variant-light-text-color',
                defaultValue: '#000000' as string,
            },
        },
        dark: {
            textColor: {
                cssVar: '--button-variant-dark-text-color',
                defaultValue: '#FFFFFF' as string,
            },
        },
    },
} as const satisfies ThemeOptionOrGroupDefinition;

type ExtractThemeOptionsFromDefinition<T> = T extends {
    cssVar: string;
    defaultValue: infer S;
}
    ? S
    : {
          -readonly [Key in keyof T]?: ExtractThemeOptionsFromDefinition<
              T[Key]
          >;
      };

export type ThemeOptions = ExtractThemeOptionsFromDefinition<
    typeof themeStructure
>;
