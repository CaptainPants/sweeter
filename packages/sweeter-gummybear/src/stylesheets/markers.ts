import { GlobalCssClass } from '@captainpants/sweeter-web';

export const variants = {
    primary: new GlobalCssClass({ className: 'primary' }),
    secondary: new GlobalCssClass({ className: 'secondary' }),
    success: new GlobalCssClass({ className: 'success' }),
    danger: new GlobalCssClass({ className: 'danger' }),
    warning: new GlobalCssClass({ className: 'warning' }),
    info: new GlobalCssClass({ className: 'info' }),
    light: new GlobalCssClass({ className: 'light' }),
    dark: new GlobalCssClass({ className: 'dark' }),
};

export const tags = {
    outline: new GlobalCssClass({ className: 'outline' }),
    disabled: new GlobalCssClass({ className: 'disabled' }),
};

export const sizes = {
    large: new GlobalCssClass({ className: 'large' }),
    small: new GlobalCssClass({ className: 'small' }),
};
