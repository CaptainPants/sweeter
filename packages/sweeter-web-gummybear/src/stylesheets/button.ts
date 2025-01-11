import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';

import { themeStructure } from '../theme/themeStructure.js';

import { tags, variants } from './markers.js';

export const button = new GlobalCssClass({
    className: 'button',
    content: stylesheet`
        background-color: white;
        padding: .375rem .75rem;
        margin: 4px;
        cursor: pointer;

        border: solid #e0e0e0 2px;
        border-radius: 0.375rem;

        transition: 
            color .15s ease-in-out,
            background-color .15s ease-in-out,
            border-color .15s ease-in-out,
            box-shadow .15s ease-in-out;
        
        ${Object.entries(themeStructure.buttonVariants).map(
            ([key, buttonVariant]) => {
                const variant =
                    themeStructure.variants[
                        key as keyof typeof themeStructure.variants
                    ];
                assertNotNullOrUndefined(variant);

                const variantTag =
                    variants[key as keyof typeof themeStructure.variants];
                assertNotNullOrUndefined(variantTag);

                return stylesheet`
                    &.${variantTag} {
                        background-color: var(${variant.color.cssVar});
                        border-color: var(${variant.color.cssVar});
                        color: var(${buttonVariant.textColor.cssVar});

                        &:hover {
                            background-color: var(${variant.hoverColor.cssVar});
                            border-color: var(${variant.hoverColor.cssVar});
                        }

                        &.${tags.disabled} {
                            opacity: 0.8;
                        }
                        
                        &.${tags.outline} {
                            background-color: transparent;
                            color: inherit;
                        }
                    }
                `;
            },
        )}
    `,
});
