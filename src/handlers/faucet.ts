import { HandlerContext } from "@xmtp/message-kit";
import { getRedisClient } from "../lib/redis.js";
import { FIVE_MINUTES, LearnWeb3Client, Network } from "../lib/learnweb3.js";
import { clearChatHistory } from "./agent.js";

export async function handleFaucet(context: HandlerContext) {
  const { message } = context;
  const redisClient = await getRedisClient();
  const {
    content: { command, params },
    sender,
  } = message;

  // Initialize LearnWeb3Client
  const learnWeb3Client = new LearnWeb3Client();

  // Fetch supported networks from Redis cache or API
  let supportedNetworks: Network[];
  const cachedSupportedNetworksData = await redisClient.get(
    "supported-networks"
  );
  supportedNetworks = JSON.parse(
    cachedSupportedNetworksData!
  ).supportedNetworks;

  if (command === "networks") {
    if (
      !cachedSupportedNetworksData ||
      Date.now() >
        parseInt(JSON.parse(cachedSupportedNetworksData).lastSyncedAt) +
          FIVE_MINUTES
    ) {
      console.log("Cleared cache");
      const updatedSupportedNetworksData = await learnWeb3Client.getNetworks();
      await redisClient.set(
        "supported-networks",
        JSON.stringify({
          lastSyncedAt: Date.now(),
          supportedNetworks: updatedSupportedNetworksData,
        })
      );
      supportedNetworks = updatedSupportedNetworksData;
    } else {
      supportedNetworks = JSON.parse(
        cachedSupportedNetworksData!
      ).supportedNetworks;
    }

    supportedNetworks = supportedNetworks.filter(
      (n) =>
        !n.networkId.toLowerCase().includes("starknet") &&
        !n.networkId.toLowerCase().includes("fuel") &&
        !n.networkId.toLowerCase().includes("mode")
    );

    const networkList = supportedNetworks.map((n, index) => {
      return `${index + 1}. ${n.networkId
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())}`;
    });

    return {
      message: `Available networks:\n\n${networkList.join("\n")}`,
      code: 200,
    };
  } else if (command === "faucet") {
    const { network } = params;
    const selectedNetwork = supportedNetworks.find(
      (n) => n.networkId === network
    );

    if (!selectedNetwork) {
      await context.send("Invalid network. Please select a valid option.");
      return;
    }

    await context.send(
      "Your testnet tokens are being processed. Please wait a moment for the transaction to process."
    );

    const result = await learnWeb3Client.dripTokens(
      selectedNetwork.networkId,
      sender.address
    );

    if (!result.ok) {
      await context.send(
        `❌ Sorry, there was an error processing your request:\n\n"${result.error!}"`
      );
      // Clear any in-memory cache or state related to the prompt
      clearChatHistory();
      return;
    }

    await context.send("Here's your transaction receipt:");
    await context.send(
      `${process.env.FRAME_BASE_URL}?txLink=${result.value}&networkLogo=${
        selectedNetwork?.networkLogo
      }&networkName=${selectedNetwork?.networkName.replaceAll(
        " ",
        "-"
      )}&tokenName=${selectedNetwork?.tokenName}&amount=${
        selectedNetwork?.dripAmount
      }`
    );
    // Clear any in-memory cache or state related to the prompt
    clearChatHistory();
  } else {
    await context.send("Unknown command. Please use 'list' or 'drip'.");
  }
}
