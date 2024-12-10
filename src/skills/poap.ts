import { Skill, XMTPContext } from "@xmtp/message-kit";
import { db } from "../plugins/db.js";

export const poap: Skill[] = [
  {
    skill: "poap",
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
  },
];

export async function handlePoap(context: XMTPContext) {
  const {
    message: {
      content: { skill, params },
    },
  } = context;
  await db.read();

  if (skill == "list") {
    const poapTable = db?.data?.poaps;
    const claimed = poapTable.filter((poap) => poap.Address);
    return {
      code: 200,
      message: `You have claimed ${claimed.length} POAPs out of ${poapTable.length}`,
    };
  } else if (skill == "poap") {
    const { address } = params;
    await db.read();
    const poapTable = db?.data?.poaps;
    const poap = poapTable.find((poap) => poap.Address == address);

    if (!poap) {
      const emptyPoap = poapTable.find((poap) => !poap.Address);
      if (emptyPoap) {
        db?.data?.poaps?.push({ URL: emptyPoap?.URL, Address: address });
        //?user_address=${address}`
        return {
          code: 200,
          message: `Here is your POAP ${emptyPoap?.URL}`,
        };
      } else {
        return {
          code: 200,
          message: "No more POAPs available",
        };
      }
    } else {
      //?user_address=${address}`
      return {
        code: 200,
        message: `You have already claimed this POAP ${poap?.URL}`,
      };
    }
  }
}
