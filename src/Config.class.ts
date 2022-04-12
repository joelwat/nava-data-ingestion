import {
  config,
} from 'dotenv';


export class Config {
  requiredKeys: string[] = [
    'API_URL',
  ];

  apiUrl!: string;

  constructor() {
    const envVars = config().parsed;

    if (envVars === undefined) {
      throw new Error('Failed to load .env file.');
    }

    this.requiredKeys.forEach((key) => {
      if (envVars[key] === undefined) {
        throw new Error(`'${envVars[key]}' is not set and is required.`);
      }
    });

    this.apiUrl = envVars.API_URL;
  }
}
