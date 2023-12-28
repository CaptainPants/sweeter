import { descend } from '@captainpants/sweeter-utilities';
import { BaseType } from './BaseType.js';

abstract class ConstantBaseType<T> extends BaseType<T> {
    public constructor(value: T, displayName: string) {
        super();
        this.value = value;
        this.displayName = displayName;
    }

    public readonly value: T;

    public override doMatches(
        value: unknown,
        _deep: boolean,
        _depth: number,
    ): value is T {
        return value === this.value;
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return JSON.stringify(this.value);
    }

    public override doCreateDefault(depth: number): T {
        return this.value;
    }

    public override get isConstant(): boolean {
        return true;
    }
}

export class UndefinedConstantType extends ConstantBaseType<undefined> {
    public constructor() {
        super(undefined, 'undefined');
    }
}

export class NullConstantType extends ConstantBaseType<null> {
    public constructor() {
        super(null, 'null');
    }
}

export class BooleanConstantType<
    TBoolean extends boolean,
> extends ConstantBaseType<TBoolean> {
    public constructor(value: TBoolean) {
        super(value, value ? 'true' : 'false');
    }
}

export class StringConstantType<
    TString extends string,
> extends ConstantBaseType<TString> {
    public constructor(value: TString) {
        super(value, value);
    }
}

export class NumberConstantType<
    TNumber extends number,
> extends ConstantBaseType<TNumber> {
    public constructor(value: TNumber) {
        super(value, String(value));
    }
}
