import { deleteApiKey, getAllApiKeys } from "./unkey";
import Progress from "cli-progress";
import { PromisePool } from "@supercharge/promise-pool";

const SIZE: number = 25; // Limit for fetching keys
const CONCURRENCY_LIMIT: number = SIZE; // Set the concurrency limit to match the size

(async function cleanup() {
  const progressBar = new Progress.SingleBar(
    { stopOnComplete: true, clearOnComplete: true },
    Progress.Presets.shades_classic
  );

  const now = new Date().getTime();
  let { result, error } = await getAllApiKeys({ limit: SIZE });
  if (error) {
    console.error(`Error fetching initial keys: ${error.message}`);
    return;
  }

  const { total, keys } = result!;
  let loadErrors: string[] = [];
  let deleteErrors: string[] = [];
  let failedDeletions = 0;
  let keysDeleted = 0;

  // Function to handle deletion safely
  const safeDelete = async (keyId: string) => {
    try {
      await deleteApiKey(keyId);
      keysDeleted++;
      progressBar.increment();
    } catch (err) {
      deleteErrors.push(
        `Failed to delete key "${keyId}": ${(err as Error).message}`
      );
      failedDeletions++;
    }
  };

  console.log("Deleting expired keys ✂️..");
  progressBar.start(total, 0, {
    speed: "N/A",
  });

  // Process initial keys
  await PromisePool.withConcurrency(CONCURRENCY_LIMIT)
    .for(keys)
    .process(async (key) => {
      if (key.expires && key.expires < now) {
        await safeDelete(key.id);
      }
    });

  let cursor = result!.cursor;
  while (cursor) {
    ({ result, error } = await getAllApiKeys({ limit: SIZE, cursor }));

    if (error) {
      loadErrors.push(
        `Error fetching keys with cursor ${cursor}: ${error.message}`
      );
      break;
    }

    // Process fetched keys
    await PromisePool.withConcurrency(CONCURRENCY_LIMIT)
      .for(result?.keys || [])
      .process(async (key) => {
        if (key.expires && key.expires < now) {
          await safeDelete(key.id);
        }
      });

    cursor = result?.cursor;
  }

  progressBar.stop();

  console.log("Operation completed 🏁");
  console.log(`Keys deleted 🎉: ${keysDeleted}`);
  console.log(`Failed deletions 😞: ${failedDeletions}`);

  // Handle load errors that may have occurred during the process
  if (loadErrors.length > 0) {
    console.error(`Keys loading errors occurred: ${loadErrors.length}`);
    loadErrors.forEach((error) => console.error(error));
  }

  // Handle delete errors that may have occurred during the process
  if (deleteErrors.length > 0) {
    console.error(`Keys deleting errors occurred: ${deleteErrors.length}`);
    deleteErrors.forEach((error) => console.error(error));
  }
})();
