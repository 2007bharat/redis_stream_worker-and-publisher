import express from "express";
import { prismaClient } from "../schema";
const app = express();

app.get("/getDatabase", async (req, res) => {
  const result = await prismaClient.website_Ticks.findMany({
    where: { region_id: "68b48a2b-d7da-427e-9c05-66bff398a5cb" },
  });

  res.json({
    success: true,
    message: result,
  });
});

app.listen("5000", () => {
  console.log("port start");
});
