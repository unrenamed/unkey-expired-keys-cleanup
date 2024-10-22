import { createExpiredApiKey } from "./unkey";
import Progress from "cli-progress";
import { PromisePool } from "@supercharge/promise-pool";

const SIZE: number = 500;
const BATCH_SIZE: number = 50;

(async function seed() {
  const progressBar = new Progress.SingleBar(
    { clearOnComplete: true },
    Progress.Presets.shades_classic
  );

  console.log(`Seeding 🌱..`);
  progressBar.start(SIZE, 0, {
    speed: "N/A",
  });

  const { errors } = await PromisePool.withConcurrency(BATCH_SIZE)
    .for(Array.from({ length: SIZE }))
    .process(async () => {
      await createExpiredApiKey();
      progressBar.increment();
    });

  progressBar.stop();

  // Handle any errors that may have occurred during the process
  if (errors.length > 0) {
    console.error(`Errors occurred: ${errors.length}`);
    errors.forEach((error) => console.error(error));
  }

  console.log(`Seeding finished 🏁`);
})();
