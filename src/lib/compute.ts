import type { ComputeTarget } from "@/tools/types";

export type ComputeRequest<TInput> = {
  target: ComputeTarget;
  input: TInput;
};

/**
 * Future CPU-heavy tools can switch `computeTarget` to `worker` or `wasm`
 * and load a dedicated module from `src/lib/workers` without changing routes.
 * Character Counter stays on the main thread by design.
 */
export function assertMainThreadCompute(target: ComputeTarget): void {
  if (target !== "main") {
    throw new Error(`Compute target "${target}" is not implemented in this phase.`);
  }
}
