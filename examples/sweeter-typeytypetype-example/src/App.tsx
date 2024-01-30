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
    $calc,
} from '@captainpants/sweeter-core';
import { exampleData } from '@captainpants/typeytypetype-example-data';
import { EditorRoot } from '@captainpants/sweeter-typeytypetype-web';

const { IncludeThemeStylesheets } = createTheme({});

// eslint-disable-next-line @typescript-eslint/ban-types
export function App(props: {}, init: ComponentInit): JSX.Element {
    const typeName = $mutable<keyof typeof exampleData>('StringOnly');
    const type = $calc(() => exampleData[typeName.value]);

    const keys = Object.keys(
        exampleData,
    ) as unknown as (keyof typeof exampleData)[];

    return (
        <Suspense fallback={() => 'Loading...'}>
            {() => (
                <>
                    <IncludeThemeStylesheets />
                    <h1>Simple Example</h1>
                    <Container size="lg">
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
                                            bind:value={typeName}
                                            options={keys.map((item) => ({
                                                value: item,
                                            }))}
                                        />
                                    </Column>
                                </Row>
                            )}
                        </WithId>
                        {$async(type, (model) => {
                            return $calc(() => {
                                // This is a little fruity - we're returning a mutable signal
                                // that can be updated by UI elements.
                                const state = $mutable(model.value);
                                console.log('State reset');

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
                            });
                        })}
                    </Container>
                </>
            )}
        </Suspense>
    );
}
