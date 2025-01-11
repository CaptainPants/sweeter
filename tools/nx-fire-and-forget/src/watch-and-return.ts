import { PromiseExecutor } from "@nx/devkit";
import { WatchAndReturnExecutorSchema } from "./schema";

const runExecutor: PromiseExecutor<WatchAndReturnExecutorSchema> = async (
  options,
) => {
    throw new Error("TEST");
  console.log("Executor ran for WatchAndReturn", options);
  return {
    success: true,
  };
};

export default runExecutor;
