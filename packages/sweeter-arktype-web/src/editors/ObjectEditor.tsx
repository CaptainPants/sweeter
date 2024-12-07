import {
    $calc,
    $if,
    $lastGood,
    $peek,
    $val,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { EditorSizesContext } from '../context/EditorSizesContext.js';
import {
    type ContextualValueCalculationContext,
    cast,
    categorizeProperties,
    StandardLocalValues,
    type UnknownPropertyModel,
    type UnknownModel,
    validate,
    asObject,
    type UnknownObjectModel,
} from '@captainpants/arktype-modeling';
import { AmbientValuesContext } from '../context/AmbientValuesContext.js';
import { DraftHook } from '../hooks/DraftHook.js';
import { type EditorProps } from '../types.js';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { PropertyEditorPart } from './PropertyEditorPart.js';
import { Row, Column, Label, Box } from '@captainpants/sweeter-gummybear';
import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';

export function ObjectEditor(
    { model, replace, local, idPath, indent, isRoot }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $lastGood(() => {
        return cast($val(model), asObject);
    });

    const ambient = init.getContext(AmbientValuesContext);
    const { indentWidth } = init.getContext(EditorSizesContext);
    const childIndent = $calc(() => $val(indent) + 1);

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
        propertyModel: UnknownPropertyModel,
        value: UnknownModel,
    ): Promise<void> => {
        const newDraft = await draft
            .peek()
            .unknownSetProperty(propertyModel.name, value);

        draft.value = newDraft;
    };

    const calculationContext: ContextualValueCalculationContext = {
        ambient,
        local,
    };

    const owner = $calc(() => draft.value.value);

    const type = $calc(() => draft.value.type);

    const { Child } = init.getContext(IconProviderContext);

    const content = $calc(() => {
        // AVOID SUBSCRIBING TO SIGNALS AT ROOT
        // As it will rebuild the structure completely, and you will lose element focus/selection etc.
        // We necessarily subscribe to the type signal, as we use its structure to build the editor structure.

        const categorizedProperties = categorizeProperties(
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

        const content = categorizedProperties.map(
            ({ category, properties }, categoryIndex) => {
                const propertyVisiblePerProperty = $calc(() => {
                    const individualVisibility = properties.map(
                        ({ property }) => {
                            const propertyModel =
                                draft.value.unknownGetProperty(property.name);
                            assertNotNullOrUndefined(propertyModel);

                            return (
                                propertyModel.valueModel.type
                                    .annotations()
                                    ?.getAssociatedValue(
                                        StandardLocalValues.Visible,
                                        propertyModel.valueModel.value,
                                        calculationContext,
                                    ) !== false
                            ); // likely values are notFound and false
                        },
                    );

                    return individualVisibility;
                });

                const anyVisibleInCategory = $calc(() =>
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
                                $calc(
                                    () =>
                                        propertyVisiblePerProperty.value[
                                            index
                                        ] ?? true,
                                ),
                                () => (
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
                                            <PropertyEditorPart
                                                id={id}
                                                owner={owner}
                                                propertyModel={$calc(
                                                    // NOTE: this depends on draft.value, so if that value changes it will get a new PropertyModel
                                                    // No other signals are referenced
                                                    () =>
                                                        draft.value.unknownGetProperty(
                                                            property.name,
                                                        )!,
                                                )}
                                                updateValue={
                                                    updatePropertyValue
                                                }
                                                indent={childIndent}
                                                ownerIdPath={idPath}
                                            />
                                        </Column>
                                    </Row>
                                ),
                            );
                        })}
                    </div>
                ));
            },
        );

        return content;
    });

    return (
        <Box level={indent} class={css.editorOuter}>
            <div class={css.editorIndentContainer}>
                {$if(
                    $calc(() => !$val(isRoot)),
                    () => (
                        <div
                            class={css.editorIndent}
                            style={{ width: `${indentWidth}px` }}
                        >
                            <Child />
                        </div>
                    ),
                )}
                <div class={css.editorContainer}>{content}</div>
            </div>
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
};
