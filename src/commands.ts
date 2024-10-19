import type { CommandGroup } from "@xmtp/message-kit";
import { handlePoap } from "./handlers/poap.js";
import { handleFaucet } from "./handlers/faucet.js";
import { handleNotion } from "./handlers/notion.js";

export const commands: CommandGroup[] = [
  {
    name: "Poap Bot",
    description: "Get your POAP.",
    triggers: ["/poap"],
    commands: [
      {
        command: "/poap [address]",
        handler: handlePoap,
        description: "Get your POAP.",
        params: {
          address: {
            type: "string",
          },
        },
      },
      {
        command: "/poap list",
        handler: handlePoap,
        description: "List all POAPs.",
        params: {},
      },
    ],
  },
  {
    name: "Faucet",
    description: "Get some testnet tokens.",
    triggers: ["/faucet", "/networks"],
    commands: [
      {
        command: "/faucet [address] [network]",
        handler: handleFaucet,
        description: "Get some testnet tokens.",
        params: {
          address: {
            type: "string",
          },
          network: {
            type: "string",
          },
        },
      },
      {
        command: "/networks",
        handler: handleFaucet,
        description: "Get the list of supported networks.",
        params: {},
      },
    ],
  },
  {
    name: "Notion",
    description: "Update your Notion prompt.",
    triggers: ["/update"],
    commands: [
      {
        command: "/update",
        handler: handleNotion,
        description: "Update your Notion prompt.",
        params: {},
      },
    ],
  },
];
