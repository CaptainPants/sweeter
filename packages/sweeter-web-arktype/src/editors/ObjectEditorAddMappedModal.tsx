import { type AnyTypeConstraint } from '@captainpants/arktype-modeling';
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
} from '@captainpants/sweeter-web-gummybear';
import { type TypedEvent } from '@captainpants/sweeter-web';

export type ObjectEditorAddMappedModalProps = PropertiesMightBeSignals<{
    isOpen: boolean;

    type: AnyTypeConstraint;

    validate: (name: string) => Promise<string | null>;

    onCancelled: () => void;
    onFinished: (name: string, type: AnyTypeConstraint) => Promise<void>;
}>;

export const ObjectEditorAddMappedModal: Component<
    ObjectEditorAddMappedModalProps
> = ({ isOpen, type, validate, onCancelled, onFinished }, init) => {
    const title = $calc(() => {
        const typeResolved = $val(type);
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

        $peek(onCancelled)();
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
