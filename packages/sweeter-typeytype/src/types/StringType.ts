import { descend } from '../utility/descend.js';

import { BaseType } from './BaseType.js';

export class StringType extends BaseType<string> {
    public constructor() {
        super();
        this.displayName = 'string';
    }

    public override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number,
    ): value is string {
        return typeof value === 'string';
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return 'string';
    }

    public override doCreateDefault(depth: number): string {
        return '';
    }
}
