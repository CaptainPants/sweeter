import {
    type PropertiesMightBeSignals,
    type Component,
    $calc,
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

export type MapObjectEditorRenameModalProps = PropertiesMightBeSignals<{
    isOpen: boolean;

    from: string;

    validate: (from: string, to: string) => Promise<string | null>;

    onCancelled: () => void;
    onFinished: (from: string, to: string) => Promise<void>;
}>;

export const MapObjectEditorRenameModal: Component<
    MapObjectEditorRenameModalProps
> = ({ isOpen, from, validate, onCancelled, onFinished }, init) => {
    const title = $calc(() => {
        return `Renaming '${from}'`;
    });

    const to = $mutable('');
    const failedValidationMessage = $mutable<null | string>(null);

    const onCancel = (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
        if (evt.button === 0) {
            evt.preventDefault();

            // Reset
            to.value = '';
            failedValidationMessage.value = null;

            $peek(onCancelled)();
        }
    };

    const onOK = async (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => {
        if (evt.button === 0) {
            evt.preventDefault();

            const validationResult = await $peek(validate)(
                $peek(from),
                to.peek(),
            );

            failedValidationMessage.value = validationResult;

            if (validationResult) {
                return;
            }

            await $peek(onFinished)($peek(from), to.peek());
        }
    };

    // TODO: autofocus
    // TODO: binding to <input />.value still allows user input, despite the signal being not being updated..
    return (
        <Modal isOpen={isOpen} title={title}>
            {() => {
                return (
                    <Container>
                        <Row>
                            <Column sm={4}>From</Column>
                            <Column sm={8}>
                                <Input
                                    type="text"
                                    value={from}
                                    readOnly
                                    fillWidth
                                />
                            </Column>
                        </Row>
                        <Row>
                            <Column sm={4}>To</Column>
                            <Column sm={8}>
                                <Input
                                    type="text"
                                    bind:value={to}
                                    fillWidth
                                    autofocus
                                />
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
