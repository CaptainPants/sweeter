import {
    type ArrayModel,
    asArray,
    cast,
    type Type,
    isUnionType,
} from '@captainpants/typeytypetype';
import { DraftHook } from '../hooks/DraftHook.js';
import {
    $calc,
    $peek,
    $val,
    LocalizerHook,
    type ComponentInit,
    $foreach,
    $if,
    $lastGood,
} from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { SortableHandle, SortableList } from '@captainpants/sweeter-gummybear';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { ElementEditorPart } from './ElementEditorPart.js';
import { ValidationDisplay } from './ValidationDisplay.js';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import { IconButton } from '../components/IconButton.js';

export function ArrayEditor(
    {
        model,
        replace,
        propertyDisplayName,
        idPath,
        indent,
    }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $lastGood(() => {
        return cast($val(model), asArray);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<ArrayModel<unknown>, ArrayModel<unknown>>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await $peek(replace)(validated);
            },
            convertIn: (model) => {
                return model;
            },
            convertOut: (draft) => ({
                success: true,
                result: draft,
            }),
            validate: async (converted) => {
                const res = await typedModel
                    .peek()
                    .type.validate(converted.value);
                return res.success ? null : res.error;
            },
        },
    );

    const updateElementValue = async (
        index: number,
        value: unknown,
    ): Promise<void> => {
        const newDraft = await draft
            .peek()
            .spliceElements(index, 1, [value], true);

        draft.update(newDraft);
    };

    const add = async (type: Type<unknown>): Promise<void> => {
        const copy = await draft
            .peek()
            .spliceElements(
                draft.peek().value.length,
                0,
                [type.createDefault()],
                false,
            );

        draft.update(copy);
    };

    const remove = async (index: number): Promise<void> => {
        const copy = await draft.peek().spliceElements(index, 1, [], false);

        draft.update(copy);
    };

    const move = async (oldIndex: number, newIndex: number): Promise<void> => {
        const copy = await draft.peek().moveElement(oldIndex, newIndex);

        draft.update(copy);
    };

    const allowedTypes = $calc(() => {
        const elementType = draft.value.getElementType();

        if (isUnionType(elementType)) {
            return elementType.types;
        } else {
            return [elementType];
        }
    });

    const { localize } = init.hook(LocalizerHook);

    const { DragHandle, Delete } = init.getContext(IconProviderContext);

    return (
        <>
            <SortableList onSortEnd={move}>
                {$foreach(
                    $calc(() => draft.value.getElements()),
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
                $calc(() => (validationErrors.value?.length ?? 0) > 0),
                () => (
                    <div>
                        <ValidationDisplay errors={validationErrors} />
                    </div>
                ),
            )}
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
                                onClick={() => {
                                    void add(allowedType);
                                }}
                            />
                        );
                    }),
                )}
            </div>
        </>
    );
}

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
