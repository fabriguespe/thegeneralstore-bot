import type { SkillGroup } from "@xmtp/message-kit";
import { handlePoap } from "./handlers/poap.js";
import { handleFaucet } from "./handlers/faucet.js";
import { handleNotion } from "./handlers/notion.js";

export const skills: SkillGroup[] = [
  {
    name: "Poap Bot",
    description: "Get your POAP.",
    tag: "@store",
    skills: [
      {
        skill: "/poap [address]",
        handler: handlePoap,
        examples: ["/poap 0x1234567890123456789012345678901234567890"],
        description: "Get your POAP.",
        params: {
          address: {
            type: "string",
          },
        },
      },
      {
        skill: "/list",
        handler: handlePoap,
        examples: ["/list"],
        description: "List all POAPs.",
        params: {},
      },
      {
        skill: "/faucet [address] [network]",
        handler: handleFaucet,
        examples: [
          "/faucet 0x1234567890123456789012345678901234567890 sepolia",
        ],
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
        skill: "/networks",
        handler: handleFaucet,
        examples: ["/networks"],
        description: "Get the list of supported networks.",
        params: {},
      },
      {
        skill: "/update",
        handler: handleNotion,
        examples: ["/update"],
        description: "Update your Notion prompt.",
        params: {},
      },
    ],
  },
];
