import { descend } from '../utility/descend.js';

import { BaseType } from './BaseType.js';

export class NumberType extends BaseType<number> {
    public constructor() {
        super();
        this.displayName = 'number';
    }

    public override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number,
    ): value is number {
        return typeof value === 'number';
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return 'number';
    }

    public override doCreateDefault(depth: number): number {
        return 0;
    }
}
