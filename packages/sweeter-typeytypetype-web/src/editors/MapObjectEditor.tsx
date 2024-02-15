import {
    $calc,
    $if,
    $lastGood,
    $peek,
    $val,
    LocalizerHook,
    type Component,
} from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { EditorSizesContext } from '../context/EditorSizesContext.js';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { DraftHook, IconButton } from '../index.js';
import {
    asMap,
    cast,
    isUnionType,
    type MapObjectModel,
    type Model,
} from '@captainpants/typeytypetype';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import {
    Box,
    Column,
    Label,
    Row,
} from '../../../sweeter-gummybear/build/index.js';
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

    const { Child } = init.getContext(IconProviderContext);

    const { localize } = init.hook(LocalizerHook);

    const allowedTypes = $calc(() => {
        const elementType = draft.value.getItemType();

        if (isUnionType(elementType)) {
            return elementType.types;
        } else {
            return [elementType];
        }
    });

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

    const remove = async (name: string): Promise<void> => {
        const copy = await draft.peek().deleteProperty(name);

        draft.update(copy);
    };

    const content = $calc(() => {
        const entries = draft.value.getEntries();

        // TODO: rename button, column sizes
        const mappedProperties = entries.map(([name, value]) => ({
            property: value,
            render: () => {
                const id = idGenerator.next(name);

                return (
                    <Row>
                        <Column>
                            <Label for={id}>{name}</Label>
                        </Column>
                        <Column>
                            <MapElementEditorPart
                                id={idGenerator.next(name)}
                                propertyName={name}
                                elementModel={value}
                                updateElement={updatePropertyValue}
                                indent={childIndent}
                                ownerIdPath={idPath}
                            />
                        </Column>
                        <Column>
                            <IconButton
                                icon="Delete"
                                hoverable
                                onLeftClick={() => {
                                    void remove(name);
                                }}
                            />
                        </Column>
                    </Row>
                );
            },
        }));

        return mappedProperties.map(({ render }) => (
            <div class={css.property}>{render()}</div>
        ));
    });

    // TODO: add button
    return (
        <Box level={indent} class={css.editorOuter}>
            {propertyDisplayName && (
                <div class={css.editorPropertyDisplayName}>
                    {propertyDisplayName}
                </div>
            )}
            <div class={css.editorIndentContainer}>
                {$if(
                    $calc(() => !$val(isRoot)),
                    () => (
                        <div
                            class={css.editorIndent}
                            style={{ width: indentWidth }}
                        >
                            <Child />
                        </div>
                    ),
                )}
                <div class={css.editorContainer}>{content}</div>
                <div>
                    {$calc(() =>
                        allowedTypes.value.map((allowedType, index) => {
                            const title =
                                allowedTypes.value.length === 1
                                    ? localize('Add')
                                    : localize('Add {0}', [
                                          allowedType.getBestDisplayName(),
                                      ]);
                            return (
                                <IconButton
                                    icon="Add"
                                    text={title}
                                    onLeftClick={() => {
                                        // TODO: open a popoup to collect the key of the new item
                                    }}
                                />
                            );
                        }),
                    )}
                </div>
            </div>
        </Box>
    );
};

const css = {
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
