import { GlobalCssMarkerClass } from '@captainpants/sweeter-web';

export const variants = {
    primary: new GlobalCssMarkerClass({ className: 'primary' }),
    secondary: new GlobalCssMarkerClass({ className: 'secondary' }),
    success: new GlobalCssMarkerClass({ className: 'success' }),
    danger: new GlobalCssMarkerClass({ className: 'danger' }),
    warning: new GlobalCssMarkerClass({ className: 'warning' }),
    info: new GlobalCssMarkerClass({ className: 'info' }),
    light: new GlobalCssMarkerClass({ className: 'light' }),
    dark: new GlobalCssMarkerClass({ className: 'dark' }),
};

export const tags = {
    outline: new GlobalCssMarkerClass({ className: 'outline' }),
    disabled: new GlobalCssMarkerClass({ className: 'disabled' }),
};

export const sizes = {
    large: new GlobalCssMarkerClass({ className: 'large' }),
    small: new GlobalCssMarkerClass({ className: 'small' }),
};
