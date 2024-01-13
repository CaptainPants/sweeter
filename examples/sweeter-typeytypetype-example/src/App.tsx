import {
    Column,
    Container,
    Label,
    Row,
    Select,
    createTheme,
} from '@captainpants/sweeter-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    $async,
    $mutable,
    Suspense,
    type ComponentInit,
    WithId,
} from '@captainpants/sweeter-core';
import { exampleData } from '@captainpants/typeytypetype-example-data';
import { EditorRoot } from '@captainpants/sweeter-typeytypetype-web';

const { IncludeThemeStylesheets } = createTheme({});

// eslint-disable-next-line @typescript-eslint/ban-types
export function App(props: {}, init: ComponentInit): JSX.Element {
    const type = $mutable<keyof typeof exampleData>('StringOnly');

    const keys = Object.keys(
        exampleData,
    ) as unknown as (keyof typeof exampleData)[];

    return (
        <Suspense fallback={() => 'Loading...'}>
            {() => (
                <>
                    <IncludeThemeStylesheets />
                    <h1>Simple Example</h1>
                    <Container>
                        <WithId>
                            {(id) => (
                                <Row>
                                    <Column xs={4}>
                                        <Label for={id} fillWidth>
                                            Type
                                        </Label>
                                    </Column>
                                    <Column xs={8}>
                                        <Select
                                            id={id}
                                            fillWidth
                                            bind:value={type}
                                            options={keys.map((item) => ({
                                                value: item,
                                            }))}
                                        />
                                    </Column>
                                </Row>
                            )}
                        </WithId>
                    </Container>
                    {$async(exampleData.StringOnly, (model) => {
                        const state = $mutable(model.peek());

                        return (
                            <EditorRoot<unknown>
                                model={state}
                                replace={(newValue) => {
                                    state.value = newValue;
                                    console.log('Updated ', newValue);
                                    return Promise.resolve(void 0);
                                }}
                            />
                        );
                    })}
                </>
            )}
        </Suspense>
    );
}
