
import { redis } from "./leaderboard.js";

async function seed() {
  await redis.del("trending:posts");

  const pipeline = redis.pipeline();

  for (let i = 1; i <= 100; i++) {
    const id = `post:${i}`;

    // Store post information
    pipeline.hset(
      `${id}:meta`,
      "title",
      `Post number ${i}`,
      "author",
      `@user${i}`
    );

    // Store ranking score
    pipeline.zadd(
      "trending:posts",
      Math.floor(Math.random() * 50),
      id
    );
  }

  await pipeline.exec();

  console.log("Seeded 100 posts.");

  await redis.quit();
}

seed().catch(async (error) => {
  console.error(error);
  await redis.quit();
  process.exitCode = 1;
});
