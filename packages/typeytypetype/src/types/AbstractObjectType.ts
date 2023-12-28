import { descend } from '@captainpants/sweeter-utilities';
import { ObjectType } from './ObjectType.js';
import { type PropertyDefinition } from './PropertyDefinition.js';
import { type Type } from './Type.js';
import { Types } from './Types.js';

export class AbstractObjectType extends ObjectType<Record<string, unknown>> {
    public constructor() {
        super();
    }

    #expando = Types.unknown();

    public override doMatches(
        value: unknown,
        deep: boolean,
        depth: number,
    ): value is Record<string, unknown> {
        return typeof value === 'object' || value !== null;
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return 'object';
    }

    public override staticGetPropertyDefinition<Key extends string>(
        key: Key,
    ): PropertyDefinition<unknown> | null {
        return null;
    }

    public override getExpandoType(): Type<unknown> | undefined {
        return this.#expando;
    }

    public override doCreateDefault(depth: number): Record<string, unknown> {
        // Create without a prototype
        // This would be ideal for all instances we're looking at (for safety)
        // but impractical as it would require us to copy all our model objects
        return {};
    }
}
