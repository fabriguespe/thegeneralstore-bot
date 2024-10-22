import { HandlerContext } from "@xmtp/message-kit";
import { textGeneration } from "../lib/openai.js";
import fs from "fs";
import { SUPPORTED_NETWORKS } from "../lib/learnweb3.js";
import path from "path";
import { fileURLToPath } from "url";
import { responseParser } from "../lib/openai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let chatHistories: Record<string, any[]> = {};

export async function handler(context: HandlerContext) {
  if (!process?.env?.OPEN_AI_API_KEY) {
    console.log("No OPEN_AI_API_KEY found in .env");
    return;
  }

  const {
    message: {
      content: { content, params },
      sender,
    },
    group,
  } = context;

  try {
    let userPrompt = params?.prompt ?? content;

    const { reply, history } = await textGeneration(
      userPrompt,
      await generateSystemPrompt(sender.address),
      chatHistories[sender.address]
    );
    if (!group) chatHistories[sender.address] = history; // Update chat history for the user

    await processResponseWithIntent(reply, context, sender.address);
  } catch (error) {
    console.error("Error during OpenAI call:", error);
    await context.send("An error occurred while processing your request.");
  }
}

async function processResponseWithIntent(
  reply: string,
  context: any,
  senderAddress: string
) {
  let messages = reply
    .split("\n")
    .map((message: string) => responseParser(message))
    .filter((message): message is string => message.length > 0);

  for (const message of messages) {
    if (message.startsWith("/")) {
      const response = await context.intent(message);
      if (response && response.message) {
        let msg = responseParser(response.message);

        chatHistories[senderAddress]?.push({
          role: "system",
          content: msg,
        });

        await context.send(response.message);
      }
    } else {
      await context.send(message);
    }
  }
}

async function generateSystemPrompt(sender: string) {
  let page = await fs.readFileSync(
    path.resolve(__dirname, "../../src/data/notion_prompt.md"),
    "utf8"
  );
  page = page.replace("{ADDRESS}", sender);
  page = page.replace("{NETWORKS}", SUPPORTED_NETWORKS.join(", "));
  return page;
}

export async function clearChatHistory() {
  chatHistories = {};
}
