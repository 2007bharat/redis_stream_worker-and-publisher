import { xAddBulk } from "../redis/redis_function";
import { prismaClient } from "../schema";

async function pusherToQueue() {
  // database to fetch to all
  const response = await prismaClient.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });
  console.log("repsonse found");
  console.log(JSON.stringify(response));
  // then push to queue to Add bUlk
  type EventType = { url: string; id: string };

  await xAddBulk(
    response.map((event: EventType): EventType => {
      return { url: event.url, id: event.id };
    }),
  );
}

setInterval(pusherToQueue, 5 * 1000);
pusherToQueue();
