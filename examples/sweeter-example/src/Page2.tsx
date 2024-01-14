import {
    Button,
    Modal,
    TextArea,
    createTheme,
} from '@captainpants/sweeter-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    $calc,
    $mutable,
    type NoProps,
    type ComponentInit,
} from '@captainpants/sweeter-core';

const { IncludeThemeStylesheets } = createTheme({});

export function Page2(props: NoProps, init: ComponentInit): JSX.Element {
    const open = $mutable(false);

    return (
        <>
            <IncludeThemeStylesheets />
            <Button
                onclick={() => {
                    open.value = !open.peek();
                }}
            >
                {$calc(() => (open.value ? 'Close' : 'Open'))}
            </Button>
            {$calc(() => {
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
