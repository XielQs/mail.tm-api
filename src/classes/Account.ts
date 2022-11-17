import AccountType from '../types/AccountClass';
import UserAccount from '../types/UserAccount';
import EventListener from './EventListener';
import getError from '../utils/getError';
import EventEmitter from 'node:events';
import request from '../utils/request';
import EventSource from 'eventsource';
import Config from '../types/Config';
import Mails from './Mails';
import MailTMError from '../errors/MailTMError';

export default class Account<Listening extends boolean = true> extends EventEmitter implements AccountType<Listening> {
  mails: Mails;
  _eventSource: Listening extends true ? EventSource : undefined;
  config: Config;
  id: string;
  address: string;
  quota: number;
  used: number;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  token: string;
  password?: string | undefined;

  constructor (account: UserAccount, config: Config = {}) {
    super();

    Object.defineProperty(this, 'mails', { value: new Mails(), configurable: true, writable: false, enumerable: true });
    Object.defineProperty(this, 'config', { value: config, enumerable: false, writable: false, configurable: false });
    Object.assign(this, account);
    if (config.disableListening !== true) {
      EventListener(this as Account<true>);
    }
  }

  async fetch (): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      if (this.token === null || this.token === undefined) {
        if (this.password === null || this.password === undefined || this.address === null || this.address === undefined) {
          reject(new MailTMError('Account email address and password or token required'));
        }

        const tokenResponse = await request().post('/token', { address: this.address, password: this.password }).catch(err => err.response);

        if (tokenResponse.status === 200) {
          this.token = tokenResponse.data.token;
          request().defaults.headers.common.Authorization = `Bearer ${this.token}`;
        } else {
          reject(getError(tokenResponse));
          return;
        }
      } else {
        request().defaults.headers.common.Authorization = `Bearer ${this.token}`;
      }

      const accountResponse = await request().get('/me').catch(err => err.response);
      if (accountResponse.status === 200) {
        Object.assign(this, accountResponse.data, { password: this.password, token: this.token });
        resolve(this);
        return;
      }

      reject(getError(accountResponse));
    });
  }

  async delete (): Promise<boolean> {
    return await new Promise(async (resolve, reject) => {
      const response = await request().delete(`/accounts/${this.id}`).catch(err => err.response);

      if (response.status === 204) {
        this._eventSource?.close();
        resolve(true);
        return;
      }

      reject(getError(response));
    });
  }
}
