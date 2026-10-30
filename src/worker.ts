import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { xAck, xAutoClaim, xreadGroup } from "../redis/redis_function";
import { prismaClient } from "../schema";
import axios, { AxiosError } from "axios";
import { cloneSourceFileData } from "typescript/unstable/ast";
export const CONSUMER_GROUP_ID = process.env.CONSUMER_GROUP_ID!;
export const REGION_ID = process.env.REGION_ID!;
enum STATUS {
  "UP",
  "DOWN",
  "UNKOWN",
}
async function worker() {
  while (true) {
    const cliamed = await xAutoClaim();

    for (const event of cliamed.messages) {
      if (!event) continue;
      await processEventFunction(event as any);
    }
    // xreadGroup

    const result = await xreadGroup("india", "india-1");
    if (typeof result == "string") {
      continue;
    }
    console.log(JSON.stringify(result));
    for (const stream of result) {
      for (const event of stream.messages) {
        // save db
        await processEventFunction(event);
      }
    }
  }
}
worker();

export async function processEventFunction(event: {
  id: string;
  message: {
    id: string;
    url: string;
  };
}) {
  try {
    // await prismaClient.$transaction(
    //   async (tx) => {
    const inserted = await prismaClient.processedEvent.createMany({
      data: [{ Event: event.id }],
      skipDuplicates: true,
    });

    if (inserted.count === 0) {
      await xAck(event.id);
      return;
    }
    const result = await fetching_Request(event.message.url, event.message.id);
    await prismaClient.website_Ticks.create({
      data: {
        response_time: result.response_time,
        status: result.status,
        website_id: result.id,
        region_id: "68b48a2b-d7da-427e-9c05-66bff398a5cb",
      },
    });

    // acknowledment
    await xAck(event.id);
  } catch (err) {
    console.log("Processed fail to consumer the event", err);
  }
}
export async function fetching_Request(url: string, id: string) {
  const currentTime = Date.now();

  return axios
    .get(url, { timeout: 5000 })
    .then(async () => {
      const endTime = Date.now();
      return {
        status: "UP" as const,
        response_time: endTime - currentTime,
        id,
      };
    })
    .catch(async () => {
      const endTime = Date.now();

      return {
        status: "DOWN" as const,
        response_time: endTime - currentTime,
        id,
      };
    });
}
