// import express, { type Request } from "express";
// import Redis from "ioredis";
// const app = express();
// const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// const secodn = redis.client;

// app.use(express.json());
// const BANNER_NAME = "banner:all";
// app.post("/website", async (req: Request<{}, {}, { url: string }>, res) => {
//   const url = req.body.url;
//   if (url == null) {
//     res.json({
//       false: false,
//     });
//     return;
//   }
//   console.log(url);
//   res.json({
//     url,
//   });
// });
// function getPhoneOtp<T extends string>(phone: T) {
//   return `otp:${phone}`;
// }
// app.get("/create/:phone", async (req, res) => {
//   const phone = req.params.phone;
//   const otpGenerator = Math.floor(100000 + Math.random() * 900000).toString();
//   const otp_Key = getPhoneOtp<string>(phone);
//   await redis.set(otp_Key, otpGenerator, "EX", 3000);
//   res.json({
//     "Phone-no": phone,
//     otp: otpGenerator,
//   });
// });
// app.get("/otpchecker", async (req, res) => {
//   const { phone, otp } = req.query;
//   const result = await redis.get(getPhoneOtp<string>(phone as string));
//   if (otp == null) {
//     return res.json({
//       message: "Otp are not found",
//     });
//   }
//   if (result !== otp) {
//     return res.json({
//       message: "OTP are not matched",
//     });
//   }
//   res.json({
//     message: "Otp is confirmed",
//   });
// });
// app.get("/check/:phone", async (req, res) => {
//   const phone = req.params.phone;
//   const otp_Key = getPhoneOtp<string>(phone);
//   const result = await redis.ttl(otp_Key);
//   res.json({
//     expireIn: result,
//   });
// });
// app.get("/redis", async (req, res) => {
//   const message = await redis.ping();
//   res.json({
//     message,
//   });
// });

// app
//   .route("/banner")
//   .post(async (req, res) => {
//     const banner = req.body.banner || "Welcome to my site";

//     const message = await redis.set(BANNER_NAME, banner);
//     res.json({
//       success: true,
//     });
//   })
//   .get(async (req, res) => {
//     const success = await redis.get(BANNER_NAME);
//     if (!success) {
//       return res.json({
//         message: success,
//       });
//     }

//     res.json({
//       message: success,
//     });
//   })
//   .delete(async (req, res) => {
//     const del_Banner = await redis.del(BANNER_NAME);

//     if (!del_Banner) {
//       return res.json({
//         message: del_Banner,
//       });
//     }
//     res.json({
//       message: !!del_Banner,
//     });
//   });

// (function () {
//   app.listen(3000, () => {
//     console.log("Port is Listening on 3000");
//     console.log(redis.status);
//   });
// })();
