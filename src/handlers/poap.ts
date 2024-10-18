import { HandlerContext } from "@xmtp/message-kit";
import { downloadPoapTable, updatePoapAddress } from "../lib/notion.js";

export async function handlePoap(context: HandlerContext) {
  const {
    message: {
      content: { command, params },
    },
  } = context;
  console.log("Poap command", command);
  if (command == "poap") {
    // Destructure and validate parameters for the ens command
    const { address } = params;

    if (!address) {
      await context.send(
        "Missing required parameters. Please provide address."
      );
      return;
    }
    const poapTable = await downloadPoapTable();
    const poap = poapTable.find((poap: any) => poap.address === address);
    if (poap?.url) {
      await context.send(`This poap has already been delivered: ${poap.url}`);
    } else {
      let randomPoap = poapTable[Math.floor(Math.random() * poapTable.length)];
      await updatePoapAddress(randomPoap?.id, address);
      await context.send(`This is your POAP: ${randomPoap?.url}`);
    }
  }
}
