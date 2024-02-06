import {
    $calc,
    $if,
    $peek,
    $val,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { EditorSizesContext } from '../context/EditorSizesContext.js';
import {
    type ContextualValueCalculationContext,
    type Model,
    type ObjectModel,
    type PropertyModel,
    asRigidObject,
    cast,
    categorizeProperties,
    type RigidObjectType,
    StandardLocalValues,
} from '@captainpants/typeytypetype';
import { AmbientValuesContext } from '../context/AmbientValuesContext.js';
import { DraftHook } from '../hooks/DraftHook.js';
import { type EditorProps } from '../types.js';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { PropertyEditorPart } from './PropertyEditorPart.js';
import { Row, Column, Label, Box } from '@captainpants/sweeter-gummybear';
import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';
import { IconProviderContext } from '../icons/context/IconProviderContext.js';

export function RigidObjectEditor(
    { model, replace, local, idPath, indent, isRoot }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $calc(() => {
        return cast($val(model), asRigidObject);
    });

    const ambient = init.getContext(AmbientValuesContext);
    const { indentWidth } = init.getContext(EditorSizesContext);
    const childIndent = $calc(() => $val(isRoot) ? $val(indent) : $val(indent) + 1);

    const idGenerator = init.idGenerator;

    const { draft } = init.hook(
        DraftHook<
            ObjectModel<Record<string, unknown>>,
            ObjectModel<Record<string, unknown>>
        >,
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
                const res = await typedModel
                    .peek()
                    .type.validate(converted.value);
                return res.success ? null : res.error;
            },
        },
    );

    const updatePropertyValue = async (
        propertyModel: PropertyModel<unknown>,
        value: Model<unknown>,
    ): Promise<void> => {
        const newDraft = await draft
            .peek()
            .setPropertyValue(propertyModel.name, value, true);

        draft.update(newDraft);
    };

    const calculationContext: ContextualValueCalculationContext = {
        ambient,
        local,
    };

    // TODO: this is ugly, can we get the models to have the Rigid/Map type and avoid this?
    const owner = $calc(() => draft.value.value);

    const type = $calc(
        () =>
            draft.value.type as unknown as RigidObjectType<
                Record<string, unknown>
            >,
    );

    const { Child } = init.getContext(IconProviderContext);

    const content = $calc(() => {
        // AVOID SUBSCRIBING TO SIGNALS AT ROOT
        // As it will rebuild the structure completely, and you will lose element focus/selection etc.
        // We necessarily subscribe to the type signal, as we use its structure to build the editor structure.

        const categorizedProperties = categorizeProperties(
            // SIGNAL HERE
            type.value,
            (property) => {
                const id = idGenerator.next(property.name);

                return {
                    property: property,
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
                            const propertyModel = draft.value.getPropertyModel(
                                property.name,
                            );
                            assertNotNullOrUndefined(propertyModel);

                            return (
                                propertyModel.definition.getLocalValue(
                                    StandardLocalValues.Visible,
                                    typedModel.value,
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
                    <div class={styles.category} key={`cat-${categoryIndex}`}>
                        {anyCategories ? (
                            <Row>
                                <Column xl="auto">
                                    <Label
                                        style={{
                                            'font-weight': 'bold',
                                        }}
                                        class={styles.categoryHeader}
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
                                        class={styles.property}
                                        key={`prop-${property.name}`}
                                    >
                                        <Column xs={4}>
                                            <Label for={id}>
                                                {property.definition
                                                    .displayName ??
                                                    property.name}
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
                                                        draft.value.getPropertyModel(
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

    return $calc(() => {
        return (
            <Box level={$calc(() => $val(indent))} class={styles.editorOuter}>
                <div class={styles.editorIndentContainer}>
                    {$if(
                        $calc(() => !$val(isRoot)),
                        () => (
                            <div
                                class={styles.editorIndent}
                                style={{ width: `${indentWidth}px` }}
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
}

const styles = {
    editorOuter: new GlobalCssClass({
        className: 'RigidObjectEditor-EditorOuter',
        content: stylesheet`
            display: flex;
            flex-direction: column;
            margin: 10px 0 10px 0;
        `,
    }),
    editorPropertyDisplayName: new GlobalCssClass({
        className: 'RigidObjectEditor-EditorPropertyDisplayName',
        content: stylesheet`
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
