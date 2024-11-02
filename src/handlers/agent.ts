import { HandlerContext } from "@xmtp/message-kit";
import { textGeneration } from "../lib/openai.js";
import fs from "fs";
import { SUPPORTED_NETWORKS } from "../lib/learnweb3.js";
import { getUserInfo } from "../lib/resolver.js";
import { processResponseWithSkill } from "../lib/openai.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  } = context;

  try {
    let userPrompt = params?.prompt ?? content;
    const userInfo = await getUserInfo(sender.address);
    if (!userInfo) {
      console.log("User info not found");
      return;
    }
    const { reply } = await textGeneration(
      sender.address,
      userPrompt,
      await generateSystemPrompt(sender.address)
    );
    await processResponseWithSkill(sender.address, reply, context);
  } catch (error) {
    console.error("Error during OpenAI call:", error);
    await context.reply("An error occurred while processing your request.");
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
