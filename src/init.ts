import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Column } from './interface';
import { MysteryObject } from './interface';

type Schemas = { [key: string]: Column[] };

export class InitService {
  async getSchemas() {
    const schemas: { [key: string]: Column[] } = {};
    const schemasPath = path.join(`${__dirname}/../schemas`);

    try {
      const dirRval = await fs.readdir(schemasPath);
      console.log(dirRval);

      for (const file of dirRval) {
        const exists = await fs.stat(path.join(schemasPath, file));

        if (exists.isFile()) {
          const contents = await fs.readFile(path.join(schemasPath, file));
          const parsed: Column[] = parse(contents, {
            columns: ['name', 'width', 'type'],
            cast: (val, ctx) => {
              if (ctx.column === 'width') {
                return Number(val);
              }

              return val;
            },
          });

          schemas[file.substring(0, file.lastIndexOf('.'))] = parsed;
        }
      }
    } catch (err) {
      console.log('ERROR!!!', err);

      process.exit(1);
    }

    return schemas;
  }

  async getData(schemas: Schemas) {
    const data: MysteryObject[] = [];
    const dataPath = path.join(`${__dirname}/../data`);

    try {
      const dirRval = await fs.readdir(dataPath);
      console.log(dirRval);

      for (const file of dirRval) {
        const fileKey = file.substring(0, file.lastIndexOf('.'));
        const exists = await fs.stat(path.join(dataPath, file));

        if (exists.isFile()) {
          await fs.readFile(path.join(dataPath, file))
            .then((buffer) =>
              buffer
                .toString()
                .split('\n')
                .forEach((line) => {
                  const parsedColumn: MysteryObject = {};
                  const schema = schemas[fileKey];
                  let pos = 0;

                  line = line.trim();

                  if (line.length !== 0) {
                    schema.forEach((column) => {
                      const start = pos;
                      const end = pos + column.width;
                      let value: string | number | boolean = line.slice(
                        start,
                        end,
                      );

                      if (column.type === 'INTEGER') {
                        value = Number(value);
                      } else if (column.type === 'BOOLEAN') {
                        value = this.convertToBoolean(value);
                      } else {
                        value = value.trim();
                      }

                      parsedColumn[column.name] = value;

                      pos = pos + column.width;
                    });

                    data.push(parsedColumn);
                  }
                }),
            )
            .catch((err) => console.error(err));
        }
      }
    } catch (err) {
      console.log('ERROR!!!',err);

      process.exit(1);
    }

    return data;
  }

  convertToBoolean(str: string): boolean {
    const falseVals = ['false', '0', 'no'];
    const trueVals = ['true', '1', 'yes'];

    if (falseVals.includes(str)) {
      return false;
    } else if (trueVals.includes(str)) {
      return true;
    }

    throw new Error('Invalid value for boolean');
  }
}
