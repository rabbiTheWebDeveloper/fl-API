import dayjs from "dayjs";
import pino from "pino";

const log = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss",
    },
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export { log };
