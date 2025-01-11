import {
    type LocalValueCallback,
    type UnknownModel,
    type UnknownReplacer,
} from '@captainpants/sweeter-arktype-modeling';
import {
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';

export type EditorLikeProps = PropertiesMightBeSignals<{
    id?: string | undefined;
    model: UnknownModel;
    replace: UnknownReplacer;
    propertyDisplayName?: string | undefined;
    indent: number;
    isRoot?: boolean;

    idPath: string | undefined;
    local?: LocalValueCallback | undefined;
}>;

export type EditorSettings = Readonly<Record<string, unknown>>;

export type RenderNextFunction = (props: RenderNextFunctionArgs) => JSX.Element;

export type EditorCommonProps = EditorLikeProps &
    PropertiesMightBeSignals<{
        settings: EditorSettings;
    }>;

export interface RenderNextFunctionArgs extends EditorCommonProps {
    key?: string;
}

export type EditorProps = EditorCommonProps &
    PropertiesMightBeSignals<{
        next: RenderNextFunction;
    }>;

export type EditorHostProps = EditorLikeProps;

export type EditorComponentType = Component<EditorProps>;

/**
 * Abstraction around different modal implementations
 */
export type ModalProps = PropertiesMightBeSignals<{
    onClose: () => void;

    commitEnabled?: boolean;
    onCommit: () => void;

    title: string | undefined;
    children?: JSX.Element | undefined;

    isOpen: boolean;
}>;

export type ModalComponentType = Component<ModalProps>;

export interface ValidationListener {
    isValid: () => boolean;
}
