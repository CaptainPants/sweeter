import {
    $derived,
    $val,
    type Component,
    IntrinsicRawElementAttributes,
    PropertiesAreSignals,
    PropertiesMightBeSignals,
    Prop,
    mapProps,
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
    'class'
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
        PropertiesMightBeSignals<OverridableHtmlAttributes>,
        PropertiesAreSignals<OverridableHtmlAttributes>
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
    passthrough,
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

    const props: PropertiesAreSignals<IntrinsicRawElementAttributes<'div'>> = {
        ...passthrough,
    };

    return (
        <div
            id={id}
            class={[classesFromProps, classProp]}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
};
Column.propMappings = {
    passthrough: (input) => {
        const mapped = mapProps<PropertiesAreSignals<OverridableHtmlAttributes>>(undefined, input);
        return mapped;
    },
};
