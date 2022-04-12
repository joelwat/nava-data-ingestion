import process from 'process';

import {
  Api,
} from './api';

import {
  InitService,
} from './init';

(async function main() {
  console.log('AppModule init');

  const initService = new InitService();

  try {
    const schemas = await initService.getSchemas();
    const fileData = await initService.getData(schemas);

    console.log('schemas:', schemas);
    console.log('fileData:', fileData);

    const api = new Api();

    const rVals = api.send(fileData);

    await Promise.all(rVals.map((p) => {
      return p.then(((result) => {
        console.log('status:', result.status);
        console.log('data:', result.data);
        console.log();

        return Promise.resolve(result);
      }))
      .catch((err) => console.error(err));
    }));
  } catch (err) {
    console.error(err);
  }

  process.exit(0);
})();
