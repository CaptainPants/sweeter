import {
    $derived,
    $val,
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

import { columnWidthToIdentifier } from '../../stylesheets/columnWidthToIdentifier.js';
import { columns } from '../../stylesheets/grid.js';
import { type ColumnWidth } from '../../types.js';

export type ColumnProps = PropertiesMightBeSignals<{
    id?: string | undefined;

    children?: JSX.Element | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;

    xs?: ColumnWidth | undefined;
    sm?: ColumnWidth | undefined;
    md?: ColumnWidth | undefined;
    lg?: ColumnWidth | undefined;
    xl?: ColumnWidth | undefined;
}> & {
    passthrough?: IntrinsicElementAttributes<'div'>;
};

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
    passthrough: { class: classFromPassthroughProps, ...passthroughProps } = {},
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
            {...passthroughProps}
        >
            {children}
        </div>
    );
};
