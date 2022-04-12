import process from 'process';

import {
  InitService,
} from './init';

(async function main() {
  console.log('AppModule init');

    const initService = new InitService();

    try {
      const schemas = await initService.getSchemas();
      console.log(schemas);
      const fileData = await initService.getData(schemas);
      console.log(fileData);
    } catch (err) {
      console.error(err);
    }

    // while (true) {};
  process.exit(0);
})();
