import { program } from "commander";
import { getDependencyGraph } from "./readStuff.ts";

interface Options {
    target: string;
}

program
    .version("1.0.0")
    .description("watch-tree")
    .requiredOption<string>('--target <target>', 'The name of the script to run on each project', value => value)
    .action(async (options: Options) => {
        const graph = await getDependencyGraph();
        console.log(JSON.stringify(graph, undefined, 4));
    });

const res = program.parse();