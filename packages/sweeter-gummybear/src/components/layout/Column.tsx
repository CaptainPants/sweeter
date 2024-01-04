import {
    $calc,
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { columns } from '../../stylesheets/grid.js';
import { type ElementCssClasses } from '@captainpants/sweeter-web';
import {
    type ColumnWidthIdentifier,
    columnWidthIdentifiers,
} from '../../stylesheets/internal/constants.js';

export type ColumnProps = PropertiesMightBeSignals<{
    id?: string | undefined;

    children?: JSX.Element | undefined;

    xs?: ColumnWidthIdentifier | undefined;
    sm?: ColumnWidthIdentifier | undefined;
    md?: ColumnWidthIdentifier | undefined;
    lg?: ColumnWidthIdentifier | undefined;
    xl?: ColumnWidthIdentifier | undefined;
}> & {
    passthrough?: IntrinsicElementAttributes<'div'>;
};

const mappedClasses = [
    columns.xs,
    columns.xs,
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
    passthrough: { class: classFromPassthroughProps, ...passthroughProps } = {},
}) => {
    const classesFromProps = $calc(() => {
        const result: ElementCssClasses[] = [];

        [xs, sm, md, lg, xl].forEach((numberOfColumns, index) => {
            if (numberOfColumns !== undefined) {
                const sizeGroup = mappedClasses[index]!;
                const columnWidthIdent = columnWidthIdentifiers[index]!;
                const columnClass = sizeGroup[columnWidthIdent];

                result.push(columnClass);
            }
        });

        return result;
    });

    return (
        <div
            id={id}
            class={[classFromPassthroughProps, classesFromProps]}
            {...passthroughProps}
        >
            {children}
        </div>
    );
};
