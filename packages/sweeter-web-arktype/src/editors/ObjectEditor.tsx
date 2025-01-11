import { Type } from 'arktype';

import {
    asObject,
    cast,
    categorizeFixedProperties,
    type ContextualValueCalculationContext,
    createDefault,
    introspect,
    StandardAssociatedValueKeys,
    type UnknownModel,
    type UnknownObjectModel,
    UnknownType,
    validate,
} from '@captainpants/sweeter-arktype-modeling';
import {
    $derived,
    $if,
    $lastGood,
    $mapByIdentity,
    $mutable,
    $peek,
    $val,
    $wrap,
    type ComponentInit,
    LocalizerHook,
} from '@captainpants/sweeter-core';
import {
    assertNotNullOrUndefined,
    defaultCompare,
} from '@captainpants/sweeter-utilities';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { Box, Column, Label, Row } from '@captainpants/sweeter-web-gummybear';

import { IconButton } from '../components/IconButton.js';
import { AmbientValuesContext } from '../context/AmbientValuesContext.js';
import { EditorSizesContext } from '../context/EditorSizesContext.js';
import { DraftHook } from '../hooks/DraftHook.js';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';
import { type EditorProps } from '../types.js';

import { KnownPropertyEditorPart } from './KnownPropertyEditorPart.js';
import { MapElementEditorPart } from './MapElementEditorPart.js';
import { ObjectEditorAddMappedModal } from './ObjectEditorAddMappedModal.js';
import { ObjectEditorRenameMappedModal } from './ObjectEditorRenameMappedModal.js';

export function ObjectEditor(
    { model, replace, local, idPath, indent, isRoot }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $lastGood(() => {
        return cast($val(model), asObject);
    });

    const ambient = init.getContext(AmbientValuesContext);
    const { indentWidth } = init.getContext(EditorSizesContext);
    const childIndent = $derived(() => $val(indent) + 1);

    const idGenerator = init.idGenerator;

    const { draft } = init.hook(
        DraftHook<UnknownObjectModel, UnknownObjectModel>,
        {
            model: typedModel,
            convertIn: (model) => model,
            convertOut: (draft) => {
                return {
                    success: true,
                    result: draft,
                };
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
        property: string | symbol,
        value: UnknownModel,
    ): Promise<void> => {
        const newDraft = await draft.peek().unknownSetProperty(property, value);

        draft.value = newDraft;
    };

    const onAdd = async (name: string, type: UnknownType) => {
        const propertyModel = createDefault(type);

        const newDraft = await draft
            .peek()
            .unknownSetProperty(name, propertyModel);

        draft.value = newDraft;
    };

    const onMoveProperty = async (from: string, to: string) => {
        const newDraft = await draft.peek().moveProperty(from, to, true);

        draft.value = newDraft;
    };

    const remove = async (name: string | symbol): Promise<void> => {
        const copy = await draft.peek().deleteProperty(name);

        draft.value = copy;
    };

    const renameKey = $mutable<string | null>(null);

    const startRename = (name: string) => {
        renameKey.value = name;
    };

    const calculationContext: ContextualValueCalculationContext = {
        ambient,
        local,
    };

    const type = $derived(() => draft.value.type);
    const mappedKeys = $derived(() =>
        introspect.tryGetObjectTypeInfo(type.value)?.getMappedKeys(),
    );

    const { Child } = init.getContext(IconProviderContext);

    const { localize } = init.hook(LocalizerHook);

    const fixedContent = $derived(() => {
        // AVOID SUBSCRIBING TO SIGNALS AT ROOT
        // As it will rebuild the structure completely, and you will lose element focus/selection etc.
        // We necessarily subscribe to the type signal, as we use its structure to build the editor structure.

        const categorizedProperties = categorizeFixedProperties(
            // SIGNAL HERE
            type.value,
            (property) => {
                const id = idGenerator.next(String(property.name));

                return {
                    property,
                    id,
                };
            },
        );

        const anyCategories = categorizedProperties.length > 0;

        const result = categorizedProperties.map(
            ({ category, properties }, categoryIndex) => {
                const propertyVisiblePerProperty = $derived(() => {
                    const individualVisibility = properties.map(
                        ({ property }) => {
                            const propertyModel =
                                draft.value.unknownGetProperty(property.name);
                            assertNotNullOrUndefined(propertyModel);

                            const visibility =
                                propertyModel.valueModel.type
                                    .annotations()
                                    ?.getAssociatedValue(
                                        StandardAssociatedValueKeys.property_visible,
                                        $wrap(propertyModel.valueModel),
                                        calculationContext,
                                    ) !== false;

                            return visibility; // likely values are notFound and false
                        },
                    );

                    return individualVisibility;
                });

                const anyVisibleInCategory = $derived(() =>
                    propertyVisiblePerProperty.value.some((x) => x),
                );

                // If no properties in the category are visible the whole category should be hidden
                return $if(anyVisibleInCategory, () => (
                    <div class={css.category} key={`cat-${categoryIndex}`}>
                        {anyCategories ? (
                            <Row>
                                <Column xl="auto">
                                    <Label
                                        style={{
                                            'font-weight': 'bold',
                                        }}
                                        class={css.categoryHeader}
                                        fillWidth
                                    >
                                        {category}
                                    </Label>
                                </Column>
                            </Row>
                        ) : undefined}
                        {/* Note that properties is based on the definition and not the model,
                            so will not be re-calculated when the model is updated. */}
                        {properties.map(({ property, id }, index) => {
                            return $if(
                                $derived(
                                    () =>
                                        propertyVisiblePerProperty.value[
                                            index
                                        ] ?? true,
                                ),
                                () => {
                                    const value = $derived(
                                        // NOTE: this depends on draft.value
                                        () => {
                                            const res =
                                                draft.value.unknownGetProperty(
                                                    property.name,
                                                )?.valueModel;
                                            assertNotNullOrUndefined(res);
                                            return res;
                                        },
                                    );
                                    return (
                                        <Row
                                            class={css.property}
                                            key={`prop-${String(property.name)}`}
                                        >
                                            <Column xs={4}>
                                                <Label for={id}>
                                                    {property.propertyType
                                                        .annotations()
                                                        ?.displayName() ??
                                                        String(property.name)}
                                                </Label>
                                            </Column>
                                            <Column xs={8}>
                                                <KnownPropertyEditorPart
                                                    id={id}
                                                    property={property.name}
                                                    value={value}
                                                    updateValue={
                                                        updatePropertyValue
                                                    }
                                                    indent={childIndent}
                                                    ownerIdPath={idPath}
                                                />
                                            </Column>
                                        </Row>
                                    );
                                },
                            );
                        })}
                    </div>
                ));
            },
        );

        return result;
    });

    // TODO: this is subscribing to draft.value, which means that any changes will cause it to be rebuilt
    // this should come through $mapByIdentity (ideally).
    const mappedContent = $mapByIdentity(
        $derived(() => {
            const props = [...draft.value.unknownGetProperties('mapped')];
            props.sort((x, y) => defaultCompare(x.name, y.name));
            return props;
        }),
        (x) => x.name,
        (property) => {
            const propertyName = property.name;
            const id = idGenerator.next('prop_' + propertyName.toString());

            return (
                <div class={css.property}>
                    <div>
                        <div class={css.propertyName}>
                            <Label for={id}>{String(propertyName)}</Label>
                            {typeof propertyName !== 'symbol' && (
                                <IconButton
                                    icon="Edit"
                                    onLeftClick={() =>
                                        startRename(propertyName)
                                    }
                                />
                            )}
                        </div>
                        <div>
                            <MapElementEditorPart
                                id={id}
                                property={propertyName}
                                value={property.valueModel}
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
                                    void remove(propertyName);
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        },
    );

    const content = (
        <>
            {$if(
                $derived(() => !$val(isRoot)),
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
                <div class={css.editorContainer}>{fixedContent}</div>
                <div class={css.editorContainer}>{mappedContent}</div>
                <div>
                    {$derived(() => {
                        if (renameKey.value) {
                            const visible = $mutable(true);

                            // Note that a self to self doesn't do a
                            // validate but does trigger onFinished
                            const validate = (to: string) => {
                                const property =
                                    draft.value.unknownGetProperty(to);
                                if (property !== undefined) {
                                    return Promise.resolve(
                                        'Property is already defined',
                                    );
                                }

                                return Promise.resolve(null);
                            };

                            return (
                                <ObjectEditorRenameMappedModal
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
                    {$derived(() => {
                        // ADD BUTTON
                        if (!mappedKeys.value) {
                            return <></>;
                        }

                        const stringKeys = [
                            ...mappedKeys.value.entries(),
                        ].filter(
                            (tuple): tuple is [Type<string>, UnknownType] =>
                                introspect.isStringType(tuple[0]),
                        );

                        return stringKeys.map(([keyType, valueType]) => {
                            const title =
                                stringKeys.length === 1
                                    ? localize('Add')
                                    : localize('Add {0}', [
                                          keyType
                                              .annotations()
                                              ?.getBestDisplayName(),
                                      ]);

                            const isOpen = $mutable(false);

                            const validate = (name: string) => {
                                const property =
                                    draft.value.unknownGetProperty(name);
                                if (property !== undefined) {
                                    return Promise.resolve(
                                        'Property is already defined',
                                    );
                                }

                                return Promise.resolve(null);
                            };

                            return (
                                <>
                                    <ObjectEditorAddMappedModal
                                        isOpen={isOpen}
                                        keyType={keyType}
                                        valueType={valueType}
                                        validate={validate}
                                        onCancelled={() =>
                                            (isOpen.value = false)
                                        }
                                        onFinished={async (name, type) => {
                                            isOpen.value = false; // hide the modal
                                            await onAdd(name, type);
                                        }}
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
                        });
                    })}
                </div>
            </div>
        </>
    );

    return (
        <Box level={indent} class={css.editorOuter}>
            <div class={css.editorIndentContainer}>{content}</div>
        </Box>
    );
}

const css = {
    editorOuter: new GlobalCssClass({
        className: 'RigidObjectEditor-EditorOuter',
        content: stylesheet`
            display: flex;
            flex-direction: column;
            margin: 10px 0 10px 0;
        `,
    }),
    editorIndentContainer: new GlobalCssClass({
        className: 'RigidObjectEditor-EditorIndentContainer',
        content: stylesheet`
            display: flex;
            flex-direction: row;
        `,
    }),
    editorIndent: new GlobalCssClass({
        className: 'RigidObjectEditor-EditorIndent',
        content: stylesheet`
            padding-top: 14px;
            padding-left: 8px;
            svg: {
                opacity: 0.25;
            }
        `,
    }),
    editorContainer: new GlobalCssClass({
        className: 'RigidObjectEditor-EditorContainer',
        content: stylesheet`
            flex: 1;
        `,
    }),
    categoryHeader: new GlobalCssClass({
        className: 'RigidObjectEditor-CategoryHeader',
        content: stylesheet` 
            font-weight: 'bold';
            line-height: 2;
        `,
    }),
    category: new GlobalCssClass({ className: 'category' }),
    property: new GlobalCssClass({ className: 'property' }),
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
