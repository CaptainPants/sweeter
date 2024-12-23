import { Button, Modal, TextArea } from '@captainpants/sweeter-web-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    $derived,
    $mutable,
    type NoProps,
    type ComponentInit,
} from '@captainpants/sweeter-core';

export function Page2(props: NoProps, init: ComponentInit): JSX.Element {
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
