import { Agent, run } from "@xmtp/message-kit";
import { downloadPage } from "./plugins/notion.js";
import fs from "fs";
import { faucet } from "./skills/faucet.js";
import { notion } from "./skills/notion.js";
import { poap } from "./skills/poap.js";

setupFiles();
const agent: Agent = {
  name: "Poap Bot",
  description: "Get your POAP.",
  tag: "@store",
  skills: [faucet, notion, poap],
  systemPrompt: await getPrompt(),
};
run(agent);

async function getPrompt() {
  if (fs.existsSync(".data/prompt.md"))
    return fs.readFileSync(".data/prompt.md", "utf8");
  else return fs.readFileSync("src/prompt.md", "utf8");
}
async function setupFiles() {
  if (!fs.existsSync(".data")) {
    fs.mkdirSync(".data");
  }
  if (!fs.existsSync(".data/db.json")) {
    const dbfile = fs.readFileSync("src/data/db.json", "utf8");
    fs.writeFileSync(".data/db.json", dbfile);
    console.log("DB file created");
  }

  const page = await downloadPage();
  fs.writeFileSync("src/prompt.md", page);
  console.log("Notion DB updated");
}
