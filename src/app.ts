import express from 'express';
import routers from './router';
import config from './config';
import log4js, {Configuration} from 'log4js';
import mongoose, {ConnectOptions} from 'mongoose';
import cors from 'cors';
import constants from "src/commons/constants";


export default async () => {
  const app = express();

  log4js.configure(config.log4js as Configuration);

  // to disable caching of requests returning 304 instead of 200
  app.disable('etag');

  app.use(express.json({limit: '1mb'}));

  app.use((req, _, next) => {
    const dateReviver = (_: string, value: unknown) => {
      if (value && typeof value === 'string') {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (dateRegex.test(value)) {
          return new Date(value);
        }
      }
      return value;
    };

    req.body = JSON.parse(JSON.stringify(req.body), dateReviver);
    next();
  });

  app.use(constants.PATH.BLANK, routers);

  const port = config.app.port as number;
  const address = config.app.address as string;
  app.listen(port, address, () => {
    log4js.getLogger().info(`Example app listening on port ${address}:${port}`);
  });

  const mongoAddress = config.mongo.address as string;
  await mongoose.connect(mongoAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
  } as ConnectOptions);

  app.use(cors());
  return app;
};
