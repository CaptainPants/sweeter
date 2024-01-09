import {
    $mutable,
    type Component,
    Portal,
    $calc,
    $val,
    type PropertiesMightBeSignals,
    $resolve,
} from '@captainpants/sweeter-core';

export type ModalProps = PropertiesMightBeSignals<{
    title?: JSX.Element | (() => JSX.Element);

    children?: JSX.Element | (() => JSX.Element);

    isOpen?: boolean;

    onClose?: (() => void) | undefined;
}>;

export const Modal: Component<ModalProps> = (
    { title, children, isOpen, onClose },
    init,
) => {
    const container = $mutable<HTMLElement>(document.createElement('div'));

    init.onMount(() => {
        document.body.appendChild(container.value);

        return () => {
            container.value.remove();
        };
    });

    return $calc(() => {
        if (!$val(isOpen)) {
            // Is it OK not to mount the children?
            return undefined;
        }

        return (
            <Portal target={$val(container)}>
                <div>
                    <div onclick={onClose}>BACKGROUND</div>
                    <div>
                        BOX
                        <div>{$resolve(title)}</div>
                        <div>{$resolve(children)}</div>
                    </div>
                </div>
            </Portal>
        );
    });
};
