import {
    type JSXMiddlewareCallback,
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXMiddleware,
    type JSXMiddlewareUnknownProps,
} from '@captainpants/sweeter-core';

interface ThemableProps {
    themed?: boolean;
}

export class ThemeMiddleware implements JSXMiddleware {
    constructor() {}

    invoke(
        type: ComponentOrIntrinsicElementTypeConstraint,
        props: JSXMiddlewareUnknownProps,
        next: JSXMiddlewareCallback,
    ): JSX.Element {
        if (typeof type === 'string') {
            const themableProps = props as ThemableProps;

            if (themableProps.themed !== false) {
                return next(
                    type,
                    this.applyThemeToProps(props) as JSXMiddlewareUnknownProps,
                );
            }
        }
        return next(type, props);
    }

    applyThemeToProps(props: ThemableProps): ThemableProps {
        return props;
    }
}
