import {
    type JSXMiddlewareCallback,
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXMiddleware,
} from '@captainpants/sweeter-core';

interface ThemableProps {
    themed?: boolean;
}

export class ThemeMiddleware implements JSXMiddleware {
    constructor() {}

    invoke(
        type: ComponentOrIntrinsicElementTypeConstraint,
        props: Readonly<Record<string, unknown>>,
        next: JSXMiddlewareCallback,
    ): JSX.Element {
        if (typeof type === 'string') {
            const themableProps = props as ThemableProps;

            if (themableProps.themed !== false) {
                return next(
                    type,
                    this.applyThemeToProps(props) as Readonly<
                        Record<string, unknown>
                    >,
                );
            }
        }
        return next(type, props);
    }

    applyThemeToProps(props: ThemableProps): ThemableProps {
        return props;
    }
}
