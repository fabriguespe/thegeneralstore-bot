//@ts-nocheck//
//@ts-ignore
/*
import { handlePoap } from "../src/handlers/poap";
import { HandlerContext } from "@xmtp/message-kit";

const sender = {
  address: "0x4d94653E5D167ca16E7861F02088Aa207b06C49E",
  inboxId: "1",
  username: "test",
  accountAddresses: [],
};

describe("handlePoap", () => {
  it("should notify if POAP is already delivered", async () => {
    const mockContext: HandlerContext = {
      message: {
        content: {
          command: "poap",
          params: { address: sender.address },
        },
        sender: sender,
      },
      send: jest.fn(),
    };

    await handlePoap(mockContext);
    console.log(mockContext.send.mock.calls);
    expect(mockContext.send).toHaveBeenCalledWith(
      expect.stringContaining("This poap has already been delivered:")
    );
  });

  const randomAddress = generateRandomAddress();
  it("should deliver a new POAP if not already delivered", async () => {
    const mockContext: HandlerContext = {
      message: {
        content: {
          command: "poap",
          params: { address: randomAddress },
        },
        sender: {
          address: randomAddress,
          inboxId: "1",
          username: "test",
          accountAddresses: [],
        },
      },
      send: jest.fn(),
    };

    await handlePoap(mockContext);
    console.log(mockContext.send.mock.calls);
    expect(mockContext.send).toHaveBeenCalledWith(
      expect.stringContaining("This is your POAP:")
    );
  });
});

function generateRandomAddress() {
  return "0x" + Math.random().toString(16).slice(2, 40);
}
*/
