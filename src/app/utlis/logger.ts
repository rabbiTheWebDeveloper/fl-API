import dayjs from "dayjs";
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const log = isDev
  ? pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
        },
      },
      timestamp: () => `,"time":"${dayjs().format()}"`,
    })
  : pino({
      timestamp: () => `,"time":"${dayjs().format()}"`,
    });

export { log };
