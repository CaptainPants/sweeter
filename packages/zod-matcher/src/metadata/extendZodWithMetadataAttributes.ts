import { z } from 'zod';
import { attributes } from "./attributes";
import { labels } from './labels';

export function extendZodWithMetadataAttributes(zod: typeof z) {
    zod.ZodType.prototype.withAttr = function (key, value) {
        attributes.set(this, key, value);
        return this;
    }

    zod.ZodType.prototype.getAttr = function (key) {
        return attributes.get(this, key);
    }

    zod.ZodType.prototype.withLabel = function (name) {
        labels.set(this, name, true);
        return this;
    }

    zod.ZodType.prototype.removeLabel = function (name) {
        labels.set(this, name, false);
        return this;
    }

    zod.ZodType.prototype.hasLabel = function (name) {
        return labels.has(this, name);
    }
}