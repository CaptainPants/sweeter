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
            // minWidgthResolved === undefined is not a sensible condition, but if it is the case then we never use a modal
            minWidthResolved !== undefined &&
            measuredWidth.value <= minWidthResolved
        );
    });

    const content = $calc(() => {
        const useModelResolved = $val(useModal);

        if (useModelResolved) {
            // Wrap in a model
            return <ModalEditor next={next} {...passthrough} />;
        }
        
        return $val(next)(passthrough);
    });

    return (
        <MeasuredBox
            onInitialLayout={(w) => {
                measuredWidth.value = w;
            }}
            onLayout={(w) => {
                measuredWidth.value = w;
            }}
        >
            {content}
        </MeasuredBox>
    );
}
