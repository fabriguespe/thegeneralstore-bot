import { run, HandlerContext } from "@xmtp/message-kit";

//Tracks conversation steps
const inMemoryCacheStep = new Map<string, number>();

//List of words to stop or unsubscribe.
const stopWords = ["stop", "unsubscribe", "cancel", "list"];

run(async (context: HandlerContext) => {
  const { content, sender } = context.message;
  const { content: text } = content;

  const senderAddress = sender.address;
  //Handles unsubscribe and resets step
  if (stopWords.some((word) => text.toLowerCase().includes(word))) {
    inMemoryCacheStep.set(senderAddress, 0);
  }

  const cacheStep = inMemoryCacheStep.get(senderAddress) || 0;

  if (cacheStep === 0) {
    // send the first message
    await context.send(
      "Welcome to The General Store powered by ENS + XMTP, where web3 builders can get supplies, anytime, day or night."
    );
    // send the second message
    await context.send(
      "Below is our menu. Let us know the number of the item you want, and it's yours. If it's a digital good, our bot will deliver those items right to your wallet.\n\nMenu:\n1. Chewing Gum\n2. TicTacs\n3. Chapstick\n4. RedBull\n5. Iced Coffee\n\n✍️ (reply with the number of the item you want)"
    );

    //  await context.send(
    //  "Want faucets? Head to faucetbot.eth : Delivers Faucet funds to devs on Testnet"
    //);

    inMemoryCacheStep.set(senderAddress, 1);
  } else if (cacheStep === 1) {
    const validOptions = ["1", "2", "3", "4", "5"];
    if (!validOptions.includes(text)) {
      await context.send(
        "Invalid option selected. Please enter a valid option (1, 2, 3, 4, or 5)\n\nIf you'd like to restart the bot, you can do so at any time by saying 'stop'."
      );
      return;
    }

    await context.send(
      "Your order was successfully placed. Thank you for shopping with us!"
    );

    inMemoryCacheStep.delete(senderAddress);
  }
});
