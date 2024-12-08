import { exampleData } from '@captainpants/arktype-example-data';
import {
    $async,
    $calc,
    $mutable,
    Component,
    WithId,
} from '@captainpants/sweeter-core';
import {
    Column,
    Container,
    Label,
    Row,
    Select,
} from '@captainpants/sweeter-gummybear';
import { EditorRoot } from '../../../packages/sweeter-arktype-web/build';
import { AnyTypeConstraint } from '@captainpants/arktype-modeling';

export const Example: Component = (_props, _init) => {
    const typeName = $mutable<keyof typeof exampleData>('StringOnly');
    const type = $calc(() => exampleData[typeName.value]);

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
                    return $calc(() => {
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
