import * as lockfile from 'lockfile';
import * as fs from 'fs';
declare var process: any;

const dbLocation = `${process.cwd()}/db.json`;
const lockLocation = `${process.cwd()}/db.lock`;

const accessProperty = (data: any, path: string, defaultValue: any = null): any => {
  const pathPart = path.split('.');

  if (undefined === data[pathPart[0]]) {
    return defaultValue;
  }

  return 1 === pathPart.length
    ? data[pathPart[0]]
    : accessProperty(data[pathPart[0]], pathPart.slice(1).join('.'), defaultValue);
};

export const get = (data: string, key: string) => {
  const parsedData = JSON.parse(data);

  return accessProperty(parsedData, key);
};

export const readFile = async () => {
  return new Promise<string>((resolve: any, reject: any) => {
    lockfile.lock(lockLocation, {wait: 1000}, function(er) {
      if (er) {
        throw er;
      }
      fs.readFile(dbLocation, 'utf8', (error: Error, file: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(file);
        }

        lockfile.unlock(lockLocation, function(er) {
          if (er) {
            throw er;
          }
        });
      });
    });
  });
};

export const writeFile = async (file: string) => {
  return new Promise<void>((resolve: any, reject: any) => {
    lockfile.lock(lockLocation, {wait: 100}, function(er) {
      if (er) {
        throw er;
      }
      fs.writeFile(dbLocation, file, (error: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });

      lockfile.unlock(lockLocation, function(er) {
        if (er) {
          throw er;
        }
      });
    });
  });
};
