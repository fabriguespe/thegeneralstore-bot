import { run, HandlerContext } from "@xmtp/message-kit";
import { handler as agent } from "./handlers/agent.js";
import { handleNotion } from "./handlers/notion.js";

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
