import { HandlerContext } from "@xmtp/message-kit";
import { textGeneration } from "../lib/openai.js";
import fs from "fs";
import { SUPPORTED_NETWORKS } from "../lib/learnweb3.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chatHistories: Record<string, any[]> = {};

export async function handler(context: HandlerContext) {
  if (!process?.env?.OPEN_AI_API_KEY) {
    console.log("No OPEN_AI_API_KEY found in .env");
    return;
  }

  const {
    group,
    message: { content, sender },
  } = context;

  try {
    const { content: userPrompt } = content;

    const { reply, history } = await textGeneration(
      userPrompt,
      await getSystemPrompt(sender.address),
      chatHistories[sender.address]
    );

    if (!group) chatHistories[sender.address] = history;

    const messages = reply.split("\n").filter((message) =>
      message
        ?.replace(/(\*\*|__)(.*?)\1/g, "$2")
        ?.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$2")
        ?.replace(/^#+\s*(.*)$/gm, "$1")
        ?.replace(/`([^`]+)`/g, "$1")
        ?.replace(/^`|`$/g, "")
        ?.trim()
    );
    console.log("messages", reply, messages);
    for (const message of messages) {
      if (message.startsWith("/")) {
        const response = await context.intent(message);
        //Add the response to the chat history
        console.log("response", response);

        if (response && response.message) {
          let msg = response?.message
            ?.replace(/(\*\*|__)(.*?)\1/g, "$2")
            ?.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$2")
            ?.replace(/^#+\s*(.*)$/gm, "$1")
            ?.replace(/`([^`]+)`/g, "$1")
            ?.replace(/^`|`$/g, "")
            ?.trim();

          chatHistories[sender.address].push({
            role: "system",
            content: msg,
          });

          await context.send(response.message);
        }
      } else {
        await context.send(message);
      }
    }
  } catch (error) {
    console.error("Error during OpenAI call:", error);
    await context.send("An error occurred while processing your request.");
  }
}

async function getSystemPrompt(sender: string) {
  let page = await fs.readFileSync(
    path.resolve(__dirname, "../../src/notion_prompt.md"),
    "utf8"
  );
  page = page.replace("{ADDRESS}", sender);
  page = page.replace("{NETWORKS}", SUPPORTED_NETWORKS.join(", "));
  return page;
}

export async function clearChatHistory(sender: string) {
  chatHistories[sender] = [];
}
