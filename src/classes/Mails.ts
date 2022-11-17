import getError from '../utils/getError';
import { Mail } from '../types/common';
import request from '../utils/request';
import MailCache from './MailCache';

export default class Mails {
  cache: MailCache;

  constructor () {
    Object.defineProperty(this, 'cache', { value: new MailCache(), configurable: true, writable: false, enumerable: false });
  }

  async fetch (id: string): Promise<Mail> {
    return await new Promise(async (resolve, reject) => {
      const response = await request().get(`/messages/${id}`).catch(err => err.response);

      if (response.status === 200) {
        this.cache.set(id, response.data);
        resolve(response.data);
        return;
      }

      reject(getError(response));
    });
  }

  async fetchAll (page: number = 1): Promise<Mail[]> {
    return await new Promise(async (resolve, reject) => {
      const response = await request().get(`/messages?page=${page}`).catch(err => err.response);

      console.log(response);

      if (response.status === 200) {
        response.data.forEach((mail: Mail) => this.cache.set(mail.id, mail));
        resolve(response.data);
        return;
      }

      reject(getError(response));
    });
  }
}
