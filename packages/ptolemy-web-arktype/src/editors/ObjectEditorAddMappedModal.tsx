import { Type } from 'arktype';

import { type UnknownType } from '@serpentis/ptolemy-arktype-modeling';
import { $derived, $mutable, type Component } from '@serpentis/ptolemy-core';
import { type TypedEvent } from '@serpentis/ptolemy-web';
import {
    Button,
    Column,
    Container,
    Input,
    Modal,
    Row,
} from '@serpentis/ptolemy-web-stardust';

export interface ObjectEditorAddMappedModalProps {
    isOpen: boolean;

    keyType: Type<string>;
    valueType: UnknownType;
    isOptional: boolean;

    validate: (name: string) => Promise<string | null>;

    onCancelled: () => void;
    onFinished: (name: string, type: UnknownType) => Promise<void>;
}

export const ObjectEditorAddMappedModal: Component<
    ObjectEditorAddMappedModalProps
> = ({ isOpen, valueType, validate, onCancelled, onFinished }) => {
    const title = $derived(() => {
        const typeResolved = valueType.value;
        const title = typeResolved.annotations()?.getBestDisplayName();
        return title;
    });

    const name = $mutable('');
    const failedValidationMessage = $mutable<null | string>(null);

    const onCancelClick = (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
        if (evt.button === 0) {
            evt.preventDefault();

            onCancel();
        }
    };

    const onCancel = () => {
        // Reset
        name.value = '';
        failedValidationMessage.value = null;

        onCancelled.peek()();
    };

    const onOK = async (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
        if (evt.button === 0) {
            evt.preventDefault();

            const validationResult = await validate.peek()(name.peek());

            failedValidationMessage.value = validationResult;

            if (validationResult) {
                return;
            }

            await onFinished.peek()(name.peek(), valueType.peek());
        }
    };

    // TODO: autofocus
    return (
        <Modal isOpen={isOpen} title={title} onClose={onCancel}>
            {() => {
                return (
                    <Container>
                        <Row>
                            <Column sm={4}>Name</Column>
                            <Column sm={8}>
                                <Input
                                    type="text"
                                    bind:value={name}
                                    fillWidth
                                    autofocus
                                />
                            </Column>
                        </Row>
                        <Row>
                            <Column sm={4}></Column>
                            <Column sm={8}>
                                <Button onclick={onCancelClick}>Cancel</Button>
                                <Button
                                    variant="primary"
                                    onclick={(evt) => void onOK(evt)}
                                >
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
