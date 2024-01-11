import { type EditorProps } from '../types.js';

import { ModalEditor } from './ModalEditor.js';
import {
    $calc,
    $mutable,
    $val,
    type PropertiesMightBeSignals,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { MeasuredBox } from '../components/MeasuredBox.js';

export type ConditionalModelEditorProps = EditorProps &
    PropertiesMightBeSignals<{ minWidth?: number }>;

export function ModalEditorIfTooSmall(
    {
        minWidth = 200,
        next,
        ...passthrough
    }: Readonly<ConditionalModelEditorProps>,
    init: ComponentInit,
): JSX.Element {
    const measuredWidth = $mutable(0);
    const useModal = $calc(() => {
        const minWidthResolved = $val(minWidth);

        return (
            minWidthResolved !== undefined &&
            measuredWidth.value > minWidthResolved
        );
    });

    const content = $calc(() => {
        return $val(useModal) ? (
            <ModalEditor next={next} {...passthrough} />
        ) : (
            $val(next)(passthrough)
        );
    });

    return (
        <MeasuredBox
            onInitialLayout={(w) => (measuredWidth.value = w)}
            onLayout={(w) => (measuredWidth.value = w)}
        >
            {content}
        </MeasuredBox>
    );
}
