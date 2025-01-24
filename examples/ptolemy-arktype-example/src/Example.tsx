import { exampleData } from '@serpentis/arktype-example-data';
import { AnyTypeConstraint } from '@serpentis/ptolemy-arktype-modeling';
import {
    $async,
    $derived,
    $mutable,
    Component,
    WithId,
} from '@serpentis/ptolemy-core';
import { EditorRoot } from '@serpentis/ptolemy-web-arktype';
import {
    Column,
    Container,
    Label,
    Row,
    Select,
} from '@serpentis/ptolemy-web-stardust';

export const Example: Component = (_props, _init) => {
    const typeName = $mutable<keyof typeof exampleData>('StringOnly');
    const type = $derived(() => exampleData[typeName.value]);

    const keys = Object.keys(
        exampleData,
    ) as unknown as (keyof typeof exampleData)[];

    return (
        <>
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
                    return $derived(() => {
                        // This is a little fruity - we're returning a mutable signal
                        // that can be updated by UI elements.
                        const state = $mutable(model.value);
                        console.log('State reset');

                        return (
                            <EditorRoot<AnyTypeConstraint>
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
    );
};
