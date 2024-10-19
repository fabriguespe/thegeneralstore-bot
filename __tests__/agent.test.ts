//@ts-nocheck

import { handler } from "../src/handlers/agent";
import { HandlerContext } from "@xmtp/message-kit";

const sender = {
  address: "0x4d94653E5D167ca16E7861F02088Aa207b06C49E",
  inboxId: "1",
  username: "test",
  accountAddresses: [],
};

describe("Agent Handler", () => {
  it("should return the correct welcome message", async () => {
    const mockContext: HandlerContext = {
      group: null,
      message: {
        content: { content: "hi" },
        sender: { address: sender.address },
      },
      intent: jest.fn(),
      send: jest.fn(),
    };

    await handler(mockContext);

    console.log(mockContext.send.mock.calls);
    expect(mockContext.send).toHaveBeenCalledWith(
      expect.stringContaining(
        "Welcome to The General Store powered by ENS + XMTP"
      ) && expect.stringContaining("Deodorant")
    );
  });
});
