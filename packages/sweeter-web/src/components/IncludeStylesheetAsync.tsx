/* @jsxImportSource .. */

import {
    $derived,
    $val,
    Async,
    type Component,
    type Lazy,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';

import { type StylesheetInclude } from '../styles/index.js';

import { IncludeStylesheet } from './IncludeStylesheet.js';

export type IncludeStylesheetAsyncProps = PropertiesMightBeSignals<{
    stylesheet: Lazy<StylesheetInclude>;
}>;

export const IncludeStylesheetAsync: Component<IncludeStylesheetAsyncProps> = ({
    stylesheet,
}) => {
    return $derived(() => {
        return (
            <Async loadData={() => $val(stylesheet).promise}>
                {(stylesheet) => {
                    return <IncludeStylesheet stylesheet={stylesheet} />;
                }}
            </Async>
        );
    });
};
