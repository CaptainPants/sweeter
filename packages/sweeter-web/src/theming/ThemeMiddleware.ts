import {
    type JSXMiddlewareCallback,
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXMiddleware,
    type JSXMiddleUnknownProps,
} from '@captainpants/sweeter-core';

interface ThemableProps {
    themed?: boolean;
}

export class ThemeMiddleware implements JSXMiddleware {
    constructor() {}

    invoke(
        type: ComponentOrIntrinsicElementTypeConstraint,
        props: JSXMiddleUnknownProps,
        next: JSXMiddlewareCallback,
    ): JSX.Element {
        if (typeof type === 'string') {
            const themableProps = props as ThemableProps;

            if (themableProps.themed !== false) {
                return next(
                    type,
                    this.applyThemeToProps(props) as JSXMiddleUnknownProps,
                );
            }
        }
        return next(type, props);
    }

    applyThemeToProps(props: ThemableProps): ThemableProps {
        return props;
    }
}
