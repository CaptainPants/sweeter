import {
    type PropertiesMightBeSignals,
    type Component,
    $calc,
    $val,
    $mutable,
    $peek,
} from '@captainpants/sweeter-core';
import {
    Button,
    Column,
    Container,
    Input,
    Modal,
    Row,
} from '@captainpants/sweeter-gummybear';
import { type TypedEvent } from '@captainpants/sweeter-web';
import { type Type } from '@captainpants/typeytypetype';

export type MapObjectEditorAddModalProps = PropertiesMightBeSignals<{
    isOpen: boolean;

    type: Type<unknown>;

    validate: (name: string) => Promise<string | null>;

    onCancelled: () => void;
    onFinished: (name: string, type: Type<unknown>) => Promise<void>;
}>;

export const MapObjectEditorAddModal: Component<
    MapObjectEditorAddModalProps
> = ({ isOpen, type, validate, onCancelled, onFinished }, init) => {
    const title = $calc(() => {
        const typeResolved = $val(type);
        const title = typeResolved.displayName ?? typeResolved.name;
        return title;
    });

    const name = $mutable('');
    const failedValidationMessage = $mutable<null | string>(null);

    const onCancel = (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
        if (evt.button === 0) {
            evt.preventDefault();

            // Reset
            name.value = '';
            failedValidationMessage.value = null;
        }
    };

    const onOK = async (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
        if (evt.button === 0) {
            evt.preventDefault();

            const validationResult = await $peek(validate)($peek(name));

            failedValidationMessage.value = validationResult;

            if (validationResult) {
                return;
            }

            await $peek(onFinished)(name.peek(), $peek(type));
        }
    };

    return (
        <Modal isOpen={isOpen} title={title}>
            {() => {
                return (
                    <Container>
                        <Row>
                            <Column sm={4}>Name</Column>
                            <Column sm={8}>
                                <Input type="text" bind:value={name} fillWidth />
                            </Column>
                        </Row>
                        <Row>
                            <Column sm={4}></Column>
                            <Column sm={8}>
                                <Button onclick={onCancel}>Cancel</Button>
                                <Button variant="primary" onclick={onOK}>
                                    OK
                                </Button>
                            </Column>
                        </Row>
                    </Container>
                );
            }}
        </Modal>
    );
};
