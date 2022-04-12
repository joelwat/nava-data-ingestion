import axios, {
  AxiosInstance,
} from 'axios';

import {
  config,
} from './config';

import {
  MysteryObject,
} from './interface';

export class Api {
  axios: AxiosInstance;

  constructor() {
      this.axios = axios.create({
        baseURL: config.apiUrl,
        responseType: 'json',
      });
  }

  send(data: MysteryObject[]) {
    return data.map((row) => this.axios.post<MysteryObject>('/measures', row));
  }
}
