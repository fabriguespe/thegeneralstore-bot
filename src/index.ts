import { run, HandlerContext } from "@xmtp/message-kit";
import { handler as agent } from "./handlers/agent.js";
import { handleNotion } from "./handlers/notion.js";
import { downloadPage } from "./lib/notion.js";
import { handlePoap } from "./handlers/poap.js";
import { clearChatHistory } from "./handlers/agent.js";
import fs from "fs";

setupFiles();
run(async (context: HandlerContext) => {
  const {
    typeId,
    content: { content: text },
  } = context.message;

  if (typeId === "text") {
    console.log(text);
    if (text.startsWith("/update")) {
      await handleNotion(context);
      clearChatHistory();
      return;
    } else if (text.startsWith("/poap list")) {
      await handlePoap(context);
      return;
    } else await agent(context);
  }
});

async function setupFiles() {
  if (!fs.existsSync(".data/db.json")) {
    const dbfile = fs.readFileSync("src/data/db.json", "utf8");
    fs.writeFileSync(".data/db.json", dbfile);
    console.log("DB file created");
  }

  const page = await downloadPage();
  fs.writeFileSync("src/data/notion_prompt.md", page);
  console.log("Notion DB updated");
}
