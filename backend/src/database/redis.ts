import Redis from "ioredis";
import { config } from "dotenv";

config();

const redis = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB),
});

// redis.on("connect", () => {
//   console.log("Conexión a Redis establecida correctamente.");
// });

redis.on("error", (error) => {
  console.error("Error en la conexión a Redis:", error);
});

// console.log(process.env.STAGE);
// if (process.env.STAGE === "dev") {
//   afterAll(async () => {
//     await redis.quit();
//   });
// }
export default redis;
