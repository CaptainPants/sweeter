import {
    type LocalValueCallback,
    type UnknownModel,
    type UnknownReplacer,
} from '@serpentis/ptolemy-arktype-modeling';
import { PropertiesAreSignals, type Component } from '@serpentis/ptolemy-core';

export interface EditorLikeProps {
    id?: string | undefined;
    model: UnknownModel;
    replace: UnknownReplacer;
    propertyDisplayName?: string | undefined;
    indent: number;
    isRoot?: boolean;

    idPath: string | undefined;
    local?: LocalValueCallback | undefined;
}

export type EditorSettings = Readonly<Record<string, unknown>>;

export type RenderNextFunction = (props: RenderNextFunctionArgs) => JSX.Element;

export type EditorCommonProps = EditorLikeProps & {
    settings: EditorSettings;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RenderNextFunctionArgs = PropertiesAreSignals<EditorCommonProps>;

export type EditorProps = EditorCommonProps & {
    next: RenderNextFunction;
};

export type EditorHostProps = EditorLikeProps;

export type EditorComponentType = Component<EditorProps>;

/**
 * Abstraction around different modal implementations
 */
export type ModalProps = {
    onClose: () => void;

    commitEnabled?: boolean;
    onCommit: () => void;

    title: string | undefined;
    children?: JSX.Element | undefined;

    isOpen: boolean;
};

export type ModalComponentType = Component<ModalProps>;

export interface ValidationListener {
    isValid: () => boolean;
}
