import { createTheme } from '@captainpants/sweeter-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    $async,
    $mutable,
    Suspense,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { exampleData } from '@captainpants/typeytypetype-example-data';
import { EditorRoot } from '@captainpants/sweeter-typeytypetype-web';

const { IncludeThemeStylesheets } = createTheme({});

// eslint-disable-next-line @typescript-eslint/ban-types
export function App(props: {}, init: ComponentInit): JSX.Element {
    return (
        <Suspense fallback={() => 'Loading...'}>
            {() => (
                <>
                    <IncludeThemeStylesheets />
                    <h1>Simple Example</h1>
                    {$async(exampleData.StringFieldOnly, (model) => {
                        const state = $mutable(model.peek());

                        return (
                            <EditorRoot<unknown>
                                model={state}
                                replace={(newValue) => {
                                    state.value = newValue;
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
