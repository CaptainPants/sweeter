import { type Project } from "./types.ts";

export function filterProjects(projects: Project[], target: string): Project[] {
    const filtered = projects.filter(x => x.scripts.includes(target));
    const remainingProjectNames = new Set(filtered.map(x => x.name));

    const removedFromScripts = filtered.map(
        x => {
            if (x.scripts.some(x => remainingProjectNames.has(x))) {
                return {
                    ...x,
                    workspaceDependencies: x.workspaceDependencies.filter(x => remainingProjectNames.has(x))
                }
            }
            return x;
        }
    );

    return removedFromScripts;
}