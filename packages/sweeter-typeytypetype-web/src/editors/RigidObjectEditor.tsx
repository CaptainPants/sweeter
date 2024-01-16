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
import { Row, Column, Label } from '@captainpants/sweeter-gummybear';
import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';

export function RigidObjectEditor(
    { model, replace, local, idPath, indent, isRoot }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $calc(() => {
        return cast($val(model), asRigidObject);
    });

    const ambient = init.getContext(AmbientValuesContext);
    const { indentWidth } = init.getContext(EditorSizesContext);

    const baseId = init.nextId();
    asRigidObject;
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

    const content = $calc(() => {
        // AVOID SUBSCRIBING TO SIGNALS AT ROOT
        // As it will rebuild the structure completely, and you will lose element focus/selection etc.
        // We necessarily subscribe to the type signal, as we use its structure to build the editor structure.

        const categorizedProperties = categorizeProperties(
            // SIGNAL HERE
            type.value,
            (property) => {
                const id = baseId + '_' + property.name;

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
                                ) !== true
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
                        {properties.map(({ property, id }, index) => {
                            return $if(
                                $calc(
                                    () =>
                                        propertyVisiblePerProperty.value[
                                            index
                                        ] ?? false,
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
                                                indent={indent}
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

    const addIndent = !isRoot;

    return $calc(() => {
        return (
            <div class={styles.editorOuter}>
                <div class={styles.editorIndentContainer}>
                    {addIndent && (
                        <div
                            class={styles.editorIndent}
                            style={{ width: indentWidth }}
                        >
                            &gt;
                        </div>
                    )}
                    <div class={styles.editorContainer}>{content}</div>
                </div>
            </div>
        );
    });
}

const styles = {
    editorOuter: new GlobalCssClass({
        className: 'editorOuter',
        content: stylesheet`
            display: flex;
            flex-direction: column;
            margin: 10px 0 10px 0;
        `,
    }),
    editorPropertyDisplayName: new GlobalCssClass({
        className: 'editorPropertyDisplayName',
        content: stylesheet`
            line-height: 2;
        `,
    }),
    editorIndentContainer: new GlobalCssClass({
        className: 'editorIndentContainer',
        content: stylesheet`
            display: flex;
            flex-direction: row;
        `,
    }),
    editorIndent: new GlobalCssClass({
        className: 'editorIndent',
        content: stylesheet`
            padding-top: 14;
            padding-left: 8;
            svg: {
                opacity: 0.25;
            }
        `,
    }),
    editorContainer: new GlobalCssClass({
        className: 'editorContainer',
        content: stylesheet`
            flex: 1;
        `,
    }),
    categoryHeader: new GlobalCssClass({
        className: 'categoryHeader',
        content: stylesheet` 
            font-weight: 'bold';
            line-height: 2;
        `,
    }),
    category: new GlobalCssClass({ className: 'category' }),
    property: new GlobalCssClass({ className: 'property' }),
};
