/* @jsxImportSource .. */

import {
    $calc,
    $val,
    Async,
    type PropertiesMightBeSignals,
    type Component,
    type Lazy,
} from '@captainpants/sweeter-core';
import { type StylesheetInclude } from '../styles/index.js';
import { IncludeStylesheet } from './IncludeStylesheet.js';

export type IncludeStylesheetAsyncProps = PropertiesMightBeSignals<{
    stylesheet: Lazy<StylesheetInclude>;
}>;

export const IncludeStylesheetAsync: Component<IncludeStylesheetAsyncProps> = ({
    stylesheet,
}) => {
    return $calc(() => {
        return (
            <Async loadData={() => $val(stylesheet).promise}>
                {(stylesheet) => {
                    return <IncludeStylesheet stylesheet={stylesheet} />;
                }}
            </Async>
        );
    });
};
