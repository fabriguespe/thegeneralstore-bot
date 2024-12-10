import { Skill, XMTPContext } from "@xmtp/message-kit";
import { downloadPage } from "../plugins/notion.js";
import fs from "fs";

export const notion: Skill[] = [
  {
    skill: "update",
    handler: handleNotion,
    examples: ["/update"],
    description: "Update your Notion prompt.",
  },
];

export async function handleNotion(context: XMTPContext) {
  const {
    message: {
      content: { skill },
    },
  } = context;

  if (skill === "update") {
    const page = await downloadPage();
    fs.writeFileSync("src/prompt.md", page);
    await context.reply("Notion DB updated");
  }
}
