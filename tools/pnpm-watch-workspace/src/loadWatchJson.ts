import { ArkErrors, type } from "arktype";
import path from "node:path";
import fs from 'node:fs/promises';
import { parse, type ParseError } from "jsonc-parser";

import { checkFileExists } from "./checkFileExists.ts";

export const watchConfigFileJsonSchema = type({
    'groups?': type.Record(type.string, type({
        'projects': type.string.array()
    })),
    'projects?': type.Record(type.string, type({
        'successPattern?': 'string'
    }))
});

export type WatchConfigFileJson = type.infer<typeof watchConfigFileJsonSchema>;

export async function loadWatchJson(workspaceRoot: string): Promise<WatchConfigFileJson> {
    const candidate = path.join(workspaceRoot, 'pnpm-watch-workspace.json');

    if (!await checkFileExists(candidate)) {
        return {};
    }

    const content = await fs.readFile(candidate, { encoding: 'utf-8' });

    const errors: ParseError[] = [];
    const parsed = parse(content, errors);

    if (errors.length > 0) {
        throw new Error(`Error parsing pnpm-watch-workspace.json: ${errors.join(', ')}`);
    }

    const processed = watchConfigFileJsonSchema(parsed);

    if (processed instanceof ArkErrors) {
        throw new Error(processed.message);
    }

    return processed;
}