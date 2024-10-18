import { run, HandlerContext } from "@xmtp/message-kit";
import { handler as agent } from "./handlers/agent.js";
import { handleNotion } from "./handlers/notion.js";
import { downloadPage } from "./lib/notion.js";
import fs from "fs";

const page = await downloadPage();
fs.writeFileSync("src/notion_prompt.md", page);
console.log("Notion DB updated");
run(async (context: HandlerContext) => {
  const {
    typeId,
    content: { content: text },
  } = context.message;

  if (typeId === "text") {
    if (text.startsWith("/update")) {
      await handleNotion(context);
      return;
    } else await agent(context);
  }
});
