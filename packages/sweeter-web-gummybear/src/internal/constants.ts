export const variantNames = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
] as const;

export type VariantName = (typeof variantNames)[number];

export const tagNames = [
    'outline',
    'disabled',
    'fillWidth',
    'invalid',
] as const;

export type TagName = (typeof tagNames)[number];

export const sizeNames = ['large', 'small'] as const;

export type SizeName = (typeof sizeNames)[number];
