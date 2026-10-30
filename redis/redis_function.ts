import { createClient, ErrorReply } from "redis";
export const STREAM_NAME = "betteruptime:website";
type XAddBulkType = { url: string; id: string };
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

async function xAdd<Params1 extends string, Params2 extends string>(
  url: Params1,
  id: Params2,
) {
  await client.xAdd(STREAM_NAME, "*", {
    url: url,
    id: id,
  });
}

export async function xAddBulk(website: XAddBulkType[]) {
  for (let a = 0; a < website.length; a++) {
    await xAdd<string, string>(website[a]?.url!, website[a]?.id!);
  }
}

// async function xCreateGroup() {
//   try {
//     await client.XGROUP_CREATE(STREAM_NAME, CONSUMER_GROUP_ID, "0", {
//       MKSTREAM: true,
//     });
//   } catch (err) {
//     if (err instanceof ErrorReply)
//       console.log("Group already exist", err.message);
//   }
// }
// xCreateGroup();
type MessageType = Awaited<
  Promise<
    {
      name: any;
      messages: [{ id: string; message: { id: string; url: string } }];
    }[]
  >
>;

export async function xreadGroup(
  CONSUMER_GROUP_ID: string,
  REGION_ID: string,
): Promise<
  | {
      name: any;
      messages: [{ id: string; message: { id: string; url: string } }];
    }[]
  | string
> {
  const result: MessageType | null = await client.xReadGroup(
    CONSUMER_GROUP_ID,
    REGION_ID,
    {
      key: STREAM_NAME,
      id: ">",
    },
    {
      COUNT: 1000,
    },
  );
  if (result == null) {
    return "No event found";
  }
  return result;
}

export async function xAck(id: string) {
  await client.xAck(STREAM_NAME, "india", id);
}
// type AutoClaimType = Awaited<Awaited<Promise<typeof xAutoClaim>>>;
let cursor = "0-0";
export async function xAutoClaim() {
  const result = await client.xAutoClaim(
    STREAM_NAME,
    "india",
    "india-2",
    10000,
    cursor,
    {
      COUNT: 10,
    },
  );
  cursor = result.nextId;
  console.log("CursorID " + result.nextId);
  return result;
}
