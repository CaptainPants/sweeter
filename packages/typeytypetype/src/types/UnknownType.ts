import { descend } from '@captainpants/sweeter-utilities';
import { BaseType } from './BaseType.js';
import { type Type } from './Type.js';

export interface RealUnknonType extends Type<unknown> {}

export class UnknownType extends BaseType<unknown> {
    public constructor() {
        super();
        this.displayName = 'unknown';
    }

    public override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number,
    ): value is string {
        return true;
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return 'uknown';
    }

    public override doCreateDefault(depth: number): unknown {
        return undefined;
    }
}
