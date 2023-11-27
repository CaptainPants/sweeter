/* @jsxImportSource .. */

import {
    $calc,
    $val,
    Async,
    type Component,
    type Lazy,
} from '@captainpants/sweeter-core';
import type { GlobalCssStylesheet } from '../styles/index.js';
import { IncludeStylesheet } from './IncludeStylesheet.js';

export interface IncludeStylesheetAsyncProps {
    stylesheet: Lazy<GlobalCssStylesheet>;
}

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
