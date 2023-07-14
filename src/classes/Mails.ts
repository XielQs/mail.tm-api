import getError from '../utils/getError';
import { Mail } from '../types/common';
import MailCache from './MailCache';
import Account from './Account';

export default class Mails {
  cache: MailCache;
  account: Account;

  public constructor (account: Account) {
    Object.defineProperty(this, 'account', { value: account, configurable: true, writable: false, enumerable: false });
    Object.defineProperty(this, 'cache', { value: new MailCache(account), configurable: true, writable: false, enumerable: false });
  }

  public async fetch (id: string): Promise<Mail> {
    return await new Promise(async (resolve, reject) => {
      const response = await this.account.api.get(`/messages/${id}`).catch(e => e.response ?? e);

      if (response.status === 200) {
        this.cache.set(id, response.data);
        resolve(response.data);
        return;
      }

      reject(getError(response));
    });
  }

  public async fetchAll (page: number = 1): Promise<Mail[]> {
    return await new Promise(async (resolve, reject) => {
      const response = await this.account.api.get(`/messages?page=${page}`).catch(e => e.response ?? e);

      if (response.status === 200) {
        response.data.forEach((mail: Mail) => this.cache.set(mail.id, mail));
        resolve(response.data);
        return;
      }

      reject(getError(response));
    });
  }
}
