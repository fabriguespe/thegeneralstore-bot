import "dotenv/config";
import { run, HandlerContext } from "@xmtp/botkit";

//Tracks conversation steps
const inMemoryCacheStep = new Map<string, number>();

//List of words to stop or unsubscribe.
const stopWords = ["stop", "unsubscribe", "cancel", "list"];

run(async (context: HandlerContext) => {
  const { content, senderAddress } = context.message;
  const lowerContent = content.toLowerCase();

  //Handles unsubscribe and resets step
  if (stopWords.some((word) => lowerContent.includes(word))) {
    inMemoryCacheStep.set(senderAddress, 0);
  }

  const cacheStep = inMemoryCacheStep.get(senderAddress) || 0;
  let message = "";
  if (cacheStep === 0) {
    // send the first message
    await context.reply(
      "Welcome to the Eth CC General Store powered by ENS + XMTP, where web3 builders can get supplies, anytime, day or night."
    );
    // send the second message
    await context.reply(
      "Below is our menu. Let us know the number of the item you want, and it's yours. If it's a digital good, our bot will deliver those items right to your wallet.\n\nMenu:\n1. Chewing Gum\n2. TicTacs\n3. Chapstick\n4. RedBull\n5. Iced Coffee\n\n✍️ (reply with the number of the item you want)"
    );

    inMemoryCacheStep.set(senderAddress, 1);
  } else if (cacheStep === 1) {
    const validOptions = ["1", "2", "3", "4", "5"];
    if (!validOptions.includes(content)) {
      await context.reply(
        "Invalid option selected. Please enter a valid option (1, 2, 3, 4, or 5)\n\nIf you'd like to restart the bot, you can do so at any time by saying 'stop'."
      );
      return;
    }

    await context.reply(
      "Your order was successfully placed. Thank you for shopping with us!"
    );

    inMemoryCacheStep.delete(senderAddress);
  }
});
