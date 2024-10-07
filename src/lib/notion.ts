import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
const pageId = process.env.NOTION_PAGE_ID;

export async function updateDB() {
  await notion.pages.update({
    page_id: pageId as string,
    properties: {
      RSVP: {
        type: "select",
        select: {
          name: "No",
        },
      },
    },
  });
}
export async function downloadPage() {
  const blocks = await notion.blocks.children.list({
    block_id: pageId as string,
  });
  const markdown = blocks.results
    .map((block: any) => {
      switch (block.type) {
        case "paragraph":
          return block.paragraph.rich_text
            .map((text: any) => text.plain_text)
            .join("");
        case "heading_1":
          return `# ${block.heading_1.rich_text
            .map((text: any) => text.plain_text)
            .join("")}`;
        case "heading_2":
          return `## ${block.heading_2.rich_text
            .map((text: any) => text.plain_text)
            .join("")}`;
        case "heading_3":
          return `### ${block.heading_3.rich_text
            .map((text: any) => text.plain_text)
            .join("")}`;
        case "bulleted_list_item":
          return `- ${block.bulleted_list_item.rich_text
            .map((text: any) => text.plain_text)
            .join("")}`;
        // Add more cases for other block types as needed

        default:
          return "";
      }
    })
    .join("\n\n");
  return markdown;
}

export async function createDB() {
  /*
  const page = await notion.pages.create({
    parent: {
      database_id: pageId as string,
    },
    properties: {
      Name: {
        type: "title",
        title: [
          {
            type: "text",
            text: { content: user.name as string },
          },
        ],
      },
      Company: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: user.company as string },
          },
        ],
      },
      Role: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: user.role as string },
          },
        ],
      },
      Preference: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: user.preference as string },
          },
        ],
      },
      Status: {
        type: "select",
        select: {
          name: "Waitlist",
        },
      },
      Address: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: sender.address as string },
          },
        ],
      },
    },
  });*/
}
