import {
    $calc,
    $if,
    $lastGood,
    $peek,
    $val,
    LocalizerHook,
    type Component,
    $mutable,
} from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { EditorSizesContext } from '../context/EditorSizesContext.js';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { DraftHook, IconButton } from '../index.js';
import {
    asObject,
    cast,
    introspect,
    validate,
    UnknownModel,
    UnknownObjectModel,
    createDefault,
    AnyTypeConstraint,
} from '@captainpants/arktype-modeling';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import { Box, Label } from '../../../sweeter-gummybear/build/index.js';
import { MapElementEditorPart } from './MapElementEditorPart.js';
import { MapObjectEditorAddModal } from './MapObjectEditorAddModal.js';
import { MapObjectEditorRenameModal } from './MapObjectEditorRenameModal.js';

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
    const typedModel = $lastGood(() => cast($val(model), asObject));

    const { indentWidth } = init.getContext(EditorSizesContext);
    const childIndent = $calc(() => $val(indent) + 1);

    const idGenerator = init.idGenerator;

    const { Child } = init.getContext(IconProviderContext);

    const { localize } = init.hook(LocalizerHook);

    const catchallAllowedTypes = $calc(() => {
        const catchallType = draft.value.unknownGetCatchallType();

        if (!catchallType) {
            return undefined;
        }
        const options = introspect.tryGetUnionTypeInfo(catchallType)?.branches;
        if (options) {
            return options;
        } else {
            return [catchallType];
        }
    });

    const { draft } = init.hook(
        DraftHook<UnknownObjectModel, UnknownObjectModel>,
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
                const res = await validate(
                    typedModel.peek().type,
                    converted.value,
                );
                return res.success ? null : res.error;
            },
        },
    );

    const updatePropertyValue = async (
        name: string | symbol,
        propertyModel: UnknownModel,
    ): Promise<void> => {
        const newDraft = await draft
            .peek()
            .unknownSetProperty(name, propertyModel, true);

        draft.update(newDraft);
    };

    const onAdd = async (name: string, type: AnyTypeConstraint) => {
        const propertyModel = createDefault(type);

        const newDraft = await draft
            .peek()
            .unknownSetProperty(name, propertyModel, true);

        draft.update(newDraft);
    };

    const onMoveProperty = async (from: string, to: string) => {
        const newDraft = await draft.peek().moveProperty(from, to, true);

        draft.update(newDraft);
    };

    const remove = async (name: string | symbol): Promise<void> => {
        const copy = await draft.peek().deleteProperty(name);

        draft.update(copy);
    };

    const renameKey = $mutable<string | null>(null);

    const startRename = (name: string) => {
        renameKey.value = name;
    };

    const content = $calc(() => {
        const entries = draft.value.unknownGetProperties();

        // TODO: rename button, column sizes
        const mappedProperties = entries.map(({ name, valueModel }) => ({
            property: valueModel,
            render: () => {
                const id = idGenerator.next(String(name));

                return (
                    <div>
                        <div class={css.propertyName}>
                            <Label for={id}>{String(name)}</Label>
                            {typeof name !== 'symbol' && <IconButton
                                icon="Edit"
                                onLeftClick={() => startRename(name)}
                            />}
                        </div>
                        <div>
                            <MapElementEditorPart
                                id={idGenerator.next(String(name))}
                                propertyName={name}
                                elementModel={valueModel}
                                updateElement={updatePropertyValue}
                                indent={childIndent}
                                ownerIdPath={idPath}
                            />
                        </div>
                        <div class={css.deleteButtonRow}>
                            <IconButton
                                icon="Delete"
                                hoverable
                                onLeftClick={() => {
                                    void remove(name);
                                }}
                            />
                        </div>
                    </div>
                );
            },
        }));

        return mappedProperties.map(({ render }) => (
            <div class={css.property}>{render()}</div>
        ));
    });

    return (
        <Box level={indent} class={css.editorOuter}>
            <div class={css.editorIndentContainer}>
                {$calc(() => {
                    if (renameKey.value) {
                        const visible = $mutable(true);

                        // Note that a self to self doesn't do a
                        // validate but does trigger onFinished
                        const validate = async (to: string) => {
                            const property = draft.value.unknownGetProperty(to);
                            if (property !== undefined) {
                                return 'Property is already defined';
                            }

                            return null;
                        };

                        return (
                            <MapObjectEditorRenameModal
                                from={renameKey.value}
                                isOpen={visible}
                                validate={(_from, to) => validate(to)}
                                onCancelled={() => {
                                    renameKey.value = null;
                                }}
                                onFinished={async (from, to) => {
                                    await onMoveProperty(from, to);
                                    renameKey.value = null;
                                }}
                            />
                        );
                    }
                    return null;
                })}
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
                <div>
                    <div class={css.editorContainer}>{content}</div>
                    <div>
                        {$calc(() => {
                            const catchallAllowedTypesResolved =
                                catchallAllowedTypes.value;
                            if (!catchallAllowedTypesResolved) {
                                return <></>;
                            }

                            return catchallAllowedTypesResolved.map(
                                (allowedType, index) => {
                                    const title =
                                        catchallAllowedTypesResolved.length ===
                                        1
                                            ? localize('Add')
                                            : localize('Add {0}', [
                                                  allowedType
                                                      .annotations()
                                                      ?.getBestDisplayName(),
                                              ]);

                                    const isOpen = $mutable(false);

                                    const validate = async (name: string) => {
                                        const property =
                                            draft.value.unknownGetProperty(
                                                name,
                                            );
                                        if (property !== undefined) {
                                            return 'Property is already defined';
                                        }

                                        return null;
                                    };

                                    return (
                                        <>
                                            <MapObjectEditorAddModal
                                                isOpen={isOpen}
                                                type={allowedType}
                                                validate={validate}
                                                onCancelled={() =>
                                                    (isOpen.value = false)
                                                }
                                                onFinished={onAdd}
                                            />
                                            <IconButton
                                                icon="Add"
                                                text={title}
                                                onLeftClick={() => {
                                                    isOpen.value = true;
                                                }}
                                            />
                                        </>
                                    );
                                },
                            );
                        })}
                    </div>
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
    editorIndentContainer: new GlobalCssClass({
        className: 'MapObjectEditor-EditorIndentContainer',
        content: stylesheet`
            display: flex;
            flex-direction: row;
        `,
    }),
    editorIndent: new GlobalCssClass({
        className: 'MapObjectEditor-EditorIndent',
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
    propertyName: new GlobalCssClass({
        className: 'MapObjectEditor-PropertyName',
        content: stylesheet`
            display: flex;
            flex-direction: row;
            align-items: center;
        `,
    }),
    deleteButtonRow: new GlobalCssClass({
        className: 'MapObjectEditor-DeleteButtonRow',
        content: stylesheet`
             display: flex;
             flex-direction: row-reverse;
        `,
    }),
};
