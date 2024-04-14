import "dotenv/config";
import { Wallet } from "ethers";
import HandlerContext from "./handler-context";
import run from "./runner.js";
const inMemoryCache = new Map<string, number>();

run(async (context: HandlerContext) => {
  const { message } = context;
  const wallet = new Wallet(process.env.KEY!);

  const { content, senderAddress } = message;

  if (senderAddress?.toLowerCase() === wallet.address?.toLowerCase()) {
    // safely ignore this message
    return;
  }

  // get the current step we're in
  const step = inMemoryCache.get(senderAddress);

  // check if the message is an unsubscribe message
  if (content?.toLowerCase() === "stop") {
    inMemoryCache.delete(senderAddress); // Reset the step for future interactions
    return;
  }
  if (!step) {
    // send the first message
    await context.reply(
      "Welcome to the Eth CC General Store powered by ENS + XMTP, where web3 builders can get supplies, anytime, day or night."
    );
    // send the second message
    await context.reply(
      "Below is our menu. Let us know the number of the item you want, and it's yours. If it's a digital good, our bot will deliver those items right to your wallet.\n\nMenu:\n1. Chewing Gum\n2. TicTacs\n3. Chapstick\n4. RedBull\n5. Iced Coffee\n\n✍️ (reply with the number of the item you want)"
    );

    inMemoryCache.set(senderAddress, 1);
  } else if (step === 1) {
    const validOptions = ["1", "2", "3", "4", "5"];
    if (!validOptions.includes(content)) {
      await context.reply(
        "Invalid option selected. Please enter a valid option (1, 2, 3, 4, or 5)"
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

// The cron job sections remain unchanged
