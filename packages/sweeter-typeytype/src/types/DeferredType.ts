import { descend } from '../utility/descend.js';

import { BaseType } from './BaseType.js';
import { type Type } from './Type.js';

export class DeferredType<T> extends BaseType<T> {
    public constructor(name: string) {
        super();
        this.name = name;
        this.type = null;
    }

    public type: Type<T> | null;

    public getUnderlyingType(): Type<T> {
        if (this.type === null) throw new Error('Model not provided.');
        return this.type;
    }

    public override doMatches(
        value: unknown,
        deep: boolean,
        depth: number,
    ): value is T {
        return this.getUnderlyingType().doMatches(value, deep, descend(depth));
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return this.name ?? '<unknown>';
    }

    public override doCreateDefault(depth: number): T {
        return this.getUnderlyingType().createDefault(descend(depth));
    }
}
