import {
    $calc,
    $if,
    $lastGood,
    $peek,
    $val,
    type Component,
} from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { EditorSizesContext } from '../context/EditorSizesContext.js';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { DraftHook } from '../index.js';
import {
    asMap,
    cast,
    type MapObjectModel,
    type Model,
} from '@captainpants/typeytypetype';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import { Box } from '../../../sweeter-gummybear/build/index.js';
import { MapElementEditorPart } from './MapElementEditorPart.js';

export const MapObjectEditor: Component<EditorProps> = (
    {
        model,
        replace,
        indent,
        idPath,
        isRoot,
        propertyDisplayName,
    }: Readonly<EditorProps>,
    init,
): JSX.Element => {
    const typedModel = $lastGood(() => cast($val(model), asMap));

    const { indentWidth } = init.getContext(EditorSizesContext);
    const childIndent = $calc(() => $val(indent) + 1);

    const idGenerator = init.idGenerator;

    const { draft } = init.hook(
        DraftHook<MapObjectModel<unknown>, MapObjectModel<unknown>>,
        {
            model: typedModel,
            convertIn: (model) => model,
            convertOut: (draft) => {
                return { success: true, result: draft };
            },
            onValid: async (validated) => {
                await $peek(replace)(validated);
            },
            validate: async (converted) => {
                const res = await typedModel
                    .peek()
                    .type.validate(converted.value);
                return res.success ? null : res.error;
            },
        },
    );

    const updatePropertyValue = async (
        name: string,
        propertyModel: Model<unknown>,
    ): Promise<void> => {
        const newDraft = await draft
            .peek()
            .setProperty(name, propertyModel, true);

        draft.update(newDraft);
    };

    const content = $calc(() => {
        const entries = draft.value.getEntries();

        // TODO: rename and delete buttons
        const mappedProperties = entries.map(([name, value]) => ({
            property: value,
            render: () => {
                return (
                    <MapElementEditorPart
                        id={idGenerator.next(name)}
                        propertyName={name}
                        elementModel={value}
                        updateElement={updatePropertyValue}
                        indent={childIndent}
                        ownerIdPath={idPath}
                    />
                );
            },
        }));

        return mappedProperties.map(({ render }) => (
            <div class={styles.property}>{render()}</div>
        ));
    });

    const { Child } = init.getContext(IconProviderContext);

    // TODO: add button
    return $calc(() => {
        return (
            <Box level={indent} class={styles.editorOuter}>
                {propertyDisplayName && (
                    <div class={styles.editorPropertyDisplayName}>
                        {propertyDisplayName}
                    </div>
                )}
                <div class={styles.editorIndentContainer}>
                    {$if(
                        $calc(() => !$val(isRoot)),
                        () => (
                            <div
                                class={styles.editorIndent}
                                style={{ width: indentWidth }}
                            >
                                <Child />
                            </div>
                        ),
                    )}
                    <div class={styles.editorContainer}>{content}</div>
                </div>
            </Box>
        );
    });
};

const styles = {
    editorOuter: new GlobalCssClass({
        className: 'MapObjectEditor-EditorOuter',
        content: stylesheet`
            display: flex;
            flex-direction: column;
            margin: 10px 0 10px 0;
        `,
    }),
    editorPropertyDisplayName: new GlobalCssClass({
        className: 'MapObjectEditor-EditorPropertyDisplayName',
        content: stylesheet`
            line-height: 2;
        `,
    }),
    editorIndentContainer: new GlobalCssClass({
        className: 'MapObjectEditor-EditorIndentContainer',
        content: stylesheet`
            display: flex;
            flex-direction: row;
        `,
    }),
    editorIndent: new GlobalCssClass({
        className: 'MapObjectEditor-EditorIndentContainer',
    }),
    editorContainer: new GlobalCssClass({
        className: 'MapObjectEditor-EditorContainer',
        content: stylesheet`
            flex: 1;
        `,
    }),

    property: new GlobalCssClass({
        className: 'MapObjectEditor-Property',
    }),
};
