//import typescriptLogo from "./typescript.svg";
//import viteLogo from "/vite.svg";
import {
    $derived,
    $mutable,
    type ComponentInit,
    type NoProps,
} from '@captainpants/sweeter-core';
import { Button, Modal, TextArea } from '@captainpants/sweeter-web-gummybear';

export function Page2(_props: NoProps, _init: ComponentInit): JSX.Element {
    const open = $mutable(false);

    return (
        <>
            <Button
                onclick={() => {
                    open.value = !open.peek();
                }}
            >
                {$derived(() => (open.value ? 'Close' : 'Open'))}
            </Button>
            {$derived(() => {
                if (open.value) {
                    return (
                        <Modal
                            onClose={() => {
                                open.value = false;
                            }}
                        >
                            Test
                            <TextArea fillWidth />
                        </Modal>
                    );
                }
                return <>Closed</>;
            })}
        </>
    );
}
