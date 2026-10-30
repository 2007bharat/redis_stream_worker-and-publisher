import axios from "axios";
import { prismaClient } from "./schema";

function fetching_Request() {
  return new Promise<void>((resolve, reject) => {
    axios
      .get("https://www.google.com", { timeout: 5000 })
      .then(async () => {
        await prismaClient.$connect().catch((err) => reject(err));
        resolve();
      })

      .catch(async () => {
        await prismaClient.$disconnect().catch((err) => reject(err));
        resolve();
      });
  });
}
