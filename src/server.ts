import app from "./app";
import { log } from "./app/utlis/logger";
const PORT=5000

const startServer =async ():Promise<void> => {
    try {
        app.listen(5000, () => {
          log.info(`🌐 Server started on port ${PORT}`);
        });
      } catch (err: any) {
        log.error(err.message);
      }



}

startServer()