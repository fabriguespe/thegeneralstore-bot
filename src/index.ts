import "dotenv/config";
import HandlerContext from "./lib/handler-context";
import run from "./lib/runner.js";
import { updateCacheForSender } from "./lib/cache.js";

const inMemoryCache = new Map<
  string,
  { step: number; lastInteraction: number }
>();

run(async (context: HandlerContext) => {
  const { message } = context;

  const { content, senderAddress } = message;

  // Update or reset the cache entry for this sender
  const { step, reset } = updateCacheForSender(
    inMemoryCache,
    senderAddress,
    content,
    ["stop", "unsubscribe", "cancel"]
  );

  if (!step) {
    // send the first message
    await context.reply(
      "Welcome to the Eth CC General Store powered by ENS + XMTP, where web3 builders can get supplies, anytime, day or night."
    );
    // send the second message
    await context.reply(
      "Below is our menu. Let us know the number of the item you want, and it's yours. If it's a digital good, our bot will deliver those items right to your wallet.\n\nMenu:\n1. Chewing Gum\n2. TicTacs\n3. Chapstick\n4. RedBull\n5. Iced Coffee\n\n✍️ (reply with the number of the item you want)"
    );

    inMemoryCache.set(senderAddress, { step: 1, lastInteraction: Date.now() });
  } else if (step === 1) {
    const validOptions = ["1", "2", "3", "4", "5"];
    if (!validOptions.includes(content)) {
      await context.reply(
        "Invalid option selected. Please enter a valid option (1, 2, 3, 4, or 5)\n\nIf you'd like to restart the bot, you can do so at any time by saying 'stop'."
      );
      return;
    }

    // Process the order here
    // This is a placeholder for order processing logic
    // For example, you might want to store the order in Redis or another database
    // and then trigger any necessary actions to fulfill the order.

    await context.reply(
      "Your order was successfully placed. Thank you for shopping with us!"
    );

    // Optionally, move to the next step or reset the step for future interactions
    // inMemoryCache.set(senderAddress, 2); // Move to next step
    // or
    inMemoryCache.delete(senderAddress); // Reset the step for future interactions
  }
});
