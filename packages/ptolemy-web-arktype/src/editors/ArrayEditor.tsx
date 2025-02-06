import {
    type AnyTypeConstraint,
    asArray,
    cast,
    createDefault,
    introspect,
    type UnknownArrayModel,
    validate,
} from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $if,
    $lastGood,
    $mapByIndex,
    $val,
    type Component,
    type ComponentInit,
    LocalizerHook,
} from '@serpentis/ptolemy-core';
import { GlobalCssClass, stylesheet } from '@serpentis/ptolemy-web';
import { SortableHandle, SortableList } from '@serpentis/ptolemy-web-stardust';

import { IconButton } from '../components/IconButton.js';
import { DraftHook } from '../hooks/DraftHook.js';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import { type EditorProps } from '../types.js';

import { ElementEditorPart } from './ElementEditorPart.js';
import { ValidationDisplay } from './ValidationDisplay.js';

export const ArrayEditor: Component<EditorProps> = (
    { model, replace, idPath, indent },
    init: ComponentInit,
) => {
    const typedModel = $lastGood(() => {
        return cast($val(model), asArray);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<UnknownArrayModel, UnknownArrayModel>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await replace.peek()(validated);
            },
            convertIn: (model) => {
                return model;
            },
            convertOut: (draft) => ({
                success: true,
                result: draft,
            }),
            validate: async (converted) => {
                const res = await validate(
                    typedModel.peek().type,
                    converted.value,
                );
                return res.success ? null : res.error;
            },
        },
    );

    const updateElementValue = async (
        index: number,
        value: unknown,
    ): Promise<void> => {
        const newDraft = await draft.peek().unknownSetIndex(index, value);

        draft.value = newDraft;
    };

    const add = async (type: AnyTypeConstraint): Promise<void> => {
        const copy = await draft
            .peek()
            .unknownSpliceElements(
                draft.peek().value.length,
                0,
                [createDefault(type)],
                false,
            );

        draft.value = copy;
    };

    const remove = async (index: number): Promise<void> => {
        const copy = await draft
            .peek()
            .unknownSpliceElements(index, 1, [], false);

        draft.value = copy;
    };

    const move = async (oldIndex: number, newIndex: number): Promise<void> => {
        const copy = await draft.peek().moveElement(oldIndex, newIndex);

        draft.value = copy;
    };

    const allowedTypes = $derived(() => {
        const elementType = draft.value.unknownGetElementType();

        const unionTypeInfo = introspect.tryGetUnionTypeInfo(elementType);
        if (unionTypeInfo) {
            return unionTypeInfo.branches;
        } else {
            return [elementType];
        }
    });

    const { localize } = init.hook(LocalizerHook);

    const { DragHandle, Delete } = init.getContext(IconProviderContext);

    return (
        <>
            <SortableList
                onSortEnd={(oldIndex, newIndex) =>
                    void move(oldIndex, newIndex)
                }
                useHandle
            >
                {$mapByIndex(
                    $derived(() => draft.value.unknownGetElements()),
                    (item, index) => {
                        return (
                            <div class={css.item}>
                                <SortableHandle>
                                    <div class={css.SortableHandle}>
                                        <DragHandle />
                                    </div>
                                </SortableHandle>
                                <div class={css.itemInputArea}>
                                    <ElementEditorPart
                                        index={index}
                                        elementModel={item}
                                        updateElement={updateElementValue}
                                        indent={indent}
                                        ownerIdPath={idPath}
                                    />
                                </div>
                                <div
                                    class={css.deleteIcon}
                                    onclick={(evt) => {
                                        if (evt.button === 0) {
                                            void remove(index);
                                        }
                                    }}
                                >
                                    <Delete hoverable />
                                </div>
                            </div>
                        );
                    },
                )}
            </SortableList>
            {$if(
                $derived(() => (validationErrors.value?.length ?? 0) > 0),
                () => (
                    <div>
                        <ValidationDisplay errors={validationErrors} />
                    </div>
                ),
            )}
            <div>
                {$derived(() =>
                    allowedTypes.value.map((allowedType) => {
                        const title =
                            allowedTypes.value.length === 1
                                ? localize('Add')
                                : localize('Add {0}', [
                                      allowedType
                                          .annotations()
                                          ?.getBestDisplayName(),
                                  ]);
                        return (
                            <IconButton
                                icon="Add"
                                text={title}
                                onLeftClick={() => {
                                    void add(allowedType);
                                }}
                            />
                        );
                    }),
                )}
            </div>
        </>
    );
};

const css = {
    editorPropertyDisplayName: new GlobalCssClass({
        className: 'ArrayEditor-EditorPropertyDisplayName',
        content: stylesheet`
            line-height: 2;
        `,
    }),
    item: new GlobalCssClass({
        className: 'ArrayEditor-Item',
        content: stylesheet`
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            margin: 10;
        `,
    }),
    itemInputArea: new GlobalCssClass({
        className: 'ArrayEditor-Item',
        content: stylesheet`
            flex: 1;
        `,
    }),
    SortableHandle: new GlobalCssClass({
        className: 'ArrayEditor-SortableHandle',
        content: stylesheet`
            cursor: move;
            margin: 12;
        `,
    }),
    deleteIcon: new GlobalCssClass({
        className: 'ArrayEditor-DeleteIcon',
        content: stylesheet`
            cursor: pointer;
            margin: 12;
        `,
    }),
} as const;
