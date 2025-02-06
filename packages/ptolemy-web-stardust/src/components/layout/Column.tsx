import {
    $derived,
    $val,
    type Component,
    type IntrinsicRawElementAttributes,
    mapProps,
    type Prop,
    type PropertiesAreSignals,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import { assertNotNullOrUndefined } from '@serpentis/ptolemy-utilities';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { columnWidthToIdentifier } from '../../stylesheets/columnWidthToIdentifier.js';
import { columns } from '../../stylesheets/grid.js';
import { type ColumnWidth } from '../../types.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'div'>,
    'id'
>;

export interface ColumnProps {
    id?: string | undefined;

    children?: JSX.Element | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;

    xs?: ColumnWidth | undefined;
    sm?: ColumnWidth | undefined;
    md?: ColumnWidth | undefined;
    lg?: ColumnWidth | undefined;
    xl?: ColumnWidth | undefined;

    passthrough?: Prop<
        PropertiesMightBeSignals<OverridableHtmlAttributes | undefined>,
        PropertiesAreSignals<OverridableHtmlAttributes | undefined>
    >;
}

const mappedClasses = [
    columns.xs,
    columns.sm,
    columns.md,
    columns.lg,
    columns.xl,
];

export const Column: Component<ColumnProps> = ({
    id,
    children,
    xs,
    sm,
    md,
    lg,
    xl,
    style,
    class: classProp,
    passthrough: {
        class: classFromPassthroughProps,
        ...restPassthroughProps
    } = {},
}) => {
    const classesFromProps = $derived(() => {
        const result: ElementCssClasses[] = [];

        [xs, sm, md, lg, xl].forEach((numberOfColumns, index) => {
            const numberOfColumnsResolved = $val(numberOfColumns);
            if (numberOfColumnsResolved !== undefined) {
                const sizeGroup = mappedClasses[index];
                assertNotNullOrUndefined(sizeGroup);

                const columnWidthIdent = columnWidthToIdentifier(
                    numberOfColumnsResolved,
                );
                const columnClass = sizeGroup[columnWidthIdent];

                result.push(columnClass);
            }
        });

        return result;
    });

    return (
        <div
            id={id}
            class={[classesFromProps, classFromPassthroughProps, classProp]}
            style={style}
            {...restPassthroughProps}
        >
            {children}
        </div>
    );
};
Column.propMappings = {
    passthrough: (input) => {
        const mapped =
            input !== undefined
                ? mapProps<
                      PropertiesAreSignals<
                          OverridableHtmlAttributes | undefined
                      >
                  >(undefined, input)
                : undefined;
        return mapped;
    },
};
