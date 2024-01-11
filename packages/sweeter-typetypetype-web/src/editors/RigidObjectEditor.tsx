import {
    $calc,
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
    StandardLocalValues,
    asRigidObject,
    cast,
    categorizeProperties,
    type PropertyDefinition,
} from '@captainpants/typeytypetype';
import { AmbientValuesContext } from '../context/AmbientValuesContext.js';
import { DraftHook } from '../hooks/DraftHook.js';
import { type EditorProps } from '../types.js';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { PropertyEditorPart } from './PropertyEditorPart.js';
import { ImmutableLazyCache } from '../utilities/ImmutableLazyCache.js';

export function RigidObjectEditor(
    {
        propertyDisplayName,
        model,
        replace,
        local,
        idPath,
        indent,
        isRoot,
    }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $calc(() => {
        return cast($val(model), asRigidObject);
    });

    const ambient = init.getContext(AmbientValuesContext);
    const { indentWidth } = init.getContext(EditorSizesContext);

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

    const owner = $calc(() => draft.value.value);

    // Keep the PropertyEditorPart instances for each property that hasn't changed
    // we might even want to consider doing this based on property name, as then
    // we can just update based on the value of the property changing
    const getRenderer = new ImmutableLazyCache(
        (_: PropertyDefinition<unknown>, name: string) => {
            return () => (
                <PropertyEditorPart
                    owner={owner}
                    propertyModel={$calc(
                        () => draft.value.getPropertyModel(name)!,
                    )}
                    updateValue={updatePropertyValue}
                    indent={indent}
                    ownerIdPath={idPath}
                />
            );
        },
    );

    const categorizedProperties = $calc(() => {
        const properties = draft.value.getProperties().filter(
            (propertyModel) =>
                propertyModel.definition.getLocalValue(
                    StandardLocalValues.Visible,
                    typedModel.value,
                    calculationContext,
                ) !== true, // likely values are notFound and false
        );

        return categorizeProperties(properties, (propertyModel) => ({
            property: propertyModel,
            render: getRenderer.get(
                $val(propertyModel).definition,
                propertyModel.name,
            ),
        }));
    });

    const addIndent = !isRoot;

    return $calc(() => {
        return (
            <div class={styles.editorOuter}>
                {propertyDisplayName && (
                    <div class={styles.editorPropertyDisplayName}>
                        {propertyDisplayName}
                    </div>
                )}
                <div class={styles.editorIndentContainer}>
                    {addIndent && (
                        <div
                            class={styles.editorIndent}
                            style={{ width: indentWidth }}
                        >
                            &gt;
                        </div>
                    )}
                    <div class={styles.editorContainer}>
                        {categorizedProperties.value.map(
                            ({ category, properties }, categoryIndex) => {
                                return (
                                    <div
                                        class={styles.category}
                                        key={`cat-${categoryIndex}`}
                                    >
                                        {categorizedProperties.value.length >
                                        0 ? (
                                            <div class={styles.categoryHeader}>
                                                {category}
                                            </div>
                                        ) : undefined}
                                        {properties.map(
                                            ({ property, render }) => {
                                                return (
                                                    <div
                                                        class={styles.property}
                                                        key={`prop-${property.name}`}
                                                    >
                                                        {render()}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                );
                            },
                        )}
                    </div>
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
