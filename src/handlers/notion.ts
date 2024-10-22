import { HandlerContext } from "@xmtp/message-kit";
import { downloadPage } from "../lib/notion.js";
import fs from "fs";

export async function handleNotion(context: HandlerContext) {
  const {
    message: {
      content: { content: text, command },
      sender,
    },
  } = context;

  if (command === "update") {
    const page = await downloadPage();
    fs.writeFileSync("src/data/notion_prompt.md", page);
    await context.reply("Notion DB updated");
  }
}
