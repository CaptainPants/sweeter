import { ExecutorContext } from "@nx/devkit";

import { WatchAndReturnExecutorSchema } from "./schema";
import executor from "./watch-and-return";

const options: WatchAndReturnExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false,
  projectGraph: {
    nodes: {},
    dependencies: {},
  },
  projectsConfigurations: {
    projects: {},
    version: 2,
  },
  nxJsonConfiguration: {},
};

describe("WatchAndReturn Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
