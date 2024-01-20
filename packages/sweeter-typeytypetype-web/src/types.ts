import {
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    type LocalValueCallback,
    type Model,
    type Replacer,
} from '@captainpants/typeytypetype';

export type EditorLikeProps = PropertiesMightBeSignals<{
    id?: string | undefined;
    model: Model<unknown>;
    replace: Replacer<unknown>;
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

export type LocalizationTemplateCallback = (key: string) => string;

export interface Localizer {
    localize: {
        (key: string, args?: unknown[]): string;
        <TNully extends null | undefined>(
            key?: string | TNully,
            args?: unknown[],
        ): string | TNully;
    };
}

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

export type EditButtonProps = PropertiesMightBeSignals<{
    onClick: () => void;
    text?: JSX.Element;
}>;

export type EditButtonComponentType = Component<EditButtonProps>;

export interface ValidationListener {
    isValid: () => boolean;
}
