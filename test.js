
import assert from "node:assert/strict";
import { upvote, getTop, redis } from "./leaderboard.js";

async function test() {
  try {
    const target = "post:50";

    // Upvote the target post 50 times
    for (let i = 0; i < 50; i++) {
      await upvote(target);
    }

    // Fetch the top 10 posts
    const topPosts = await getTop(10);

    console.log("Top 10:");

    topPosts.forEach((post, index) => {
      console.log(
        `#${index + 1} ${post.id} score=${post.score} ` +
        `${post.title} (${post.author})`
      );
    });

    // Verify that the target reached the top 10
    assert.ok(
      topPosts.some((post) => post.id === target),
      "Target post did not reach the top 10"
    );

    console.log(`PASS ✅ ${target} reached the top 10`);
  } finally {
    await redis.quit();
  }
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
