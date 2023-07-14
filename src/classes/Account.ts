import MailTMError from '../errors/MailTMError';
import AccountType from '../types/AccountClass';
import formatDates from '../utils/formatDates';
import UserAccount from '../types/UserAccount';
import EventListener from './EventListener';
import { EventEmitter } from 'node:events';
import getError from '../utils/getError';
import request from '../utils/request';
import { AxiosInstance } from 'axios';
import { Mail } from '../types/common';
import EventSource from 'eventsource';
import Config from '../types/Config';
import Mails from './Mails';

declare interface Account {
  addListener (event: 'newMail', listener: (mail: Mail) => void): this
  addListener (event: 'account', listener: (account: UserAccount) => void): this
  on (event: 'newMail', listener: (mail: Mail) => void): this
  on (event: 'account', listener: (account: UserAccount) => void): this
  once (event: 'newMail', listener: (mail: Mail) => void): this
  once (event: 'account', listener: (account: UserAccount) => void): this
}

class Account extends EventEmitter implements AccountType {
  public mails: Mails;
  public api: AxiosInstance;
  public _eventSource: EventSource;
  public readonly config: Config;
  public readonly id: string;
  public readonly address: string;
  public readonly quota: number;
  public readonly used: number;
  public readonly isDisabled: boolean;
  public readonly isDeleted: boolean;
  public readonly createdAtTimestamp: string;
  public readonly updatedAtTimestamp: string;
  public token: string;
  public readonly password?: string | undefined;

  public constructor (account: UserAccount, config: Config = {}) {
    super();

    Object.defineProperty(this, 'api', { value: request(), configurable: true, writable: false, enumerable: false });
    Object.defineProperty(this, 'mails', { value: new Mails(this), configurable: true, writable: false, enumerable: true });
    Object.defineProperty(this, 'config', { value: config, enumerable: false, writable: false, configurable: false });
    Object.assign(this, formatDates(account));
  }

  public async fetch (): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      if (this.token === null || this.token === undefined) {
        if (this.password === null || this.password === undefined || this.address === null || this.address === undefined) {
          reject(new MailTMError('Account email address and password or token required'));
        }

        const tokenResponse = await this.api.post('/token', { address: this.address, password: this.password }).catch(e => e.response ?? e);

        if (tokenResponse.status === 200) {
          this.token = tokenResponse.data.token;
          this.api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
        } else {
          reject(getError(tokenResponse));
          return;
        }
      } else {
        this.api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      }

      const accountResponse = await this.api.get('/me').catch(e => e.response ?? e);
      if (accountResponse.status === 200) {
        Object.assign(this, formatDates(accountResponse.data), { password: this.password, token: this.token });
        resolve(this);
        return;
      }

      reject(getError(accountResponse));
    });
  }

  public async delete (): Promise<boolean> {
    return await new Promise(async (resolve, reject) => {
      const response = await this.api.delete(`/accounts/${this.id}`).catch(e => e.response ?? e);

      if (response.status === 204) {
        this._eventSource?.close();
        resolve(true);
        return;
      }

      reject(getError(response));
    });
  }

  public addListener (event: string, listener: (...args: any) => void): this {
    const events = ['account', 'newMail']

    if (!events.includes(event)) {
      return this
    }

    if (this._eventSource === undefined || this._eventSource === null) {
      EventListener(this as Account);
    }

    return super.addListener(event, listener);
  }

  public on (event: string, listener: (...args: any) => void): this {
    return this.addListener(event, listener);
  }

  public once (event: string, listener: (...args: any) => void): this {
    const events = ['account', 'newMail']

    if (!events.includes(event)) {
      return this
    }

    if (this._eventSource === undefined || this._eventSource === null) {
      EventListener(this as Account);
    }

    return super.once(event, listener);
  }

  public prependListener (event: string, listener: (...args: any) => void): this {
    const events = ['account', 'newMail']

    if (!events.includes(event)) {
      return this
    }

    if (this._eventSource === undefined || this._eventSource === null) {
      EventListener(this as Account);
    }

    return super.prependListener(event, listener);
  }

  public prependOnceListener (event: string, listener: (...args: any) => void): this {
    const events = ['account', 'newMail']

    if (!events.includes(event)) {
      return this
    }

    if (this._eventSource === undefined || this._eventSource === null) {
      EventListener(this as Account);
    }

    return super.prependOnceListener(event, listener);
  }

  public get createdAt (): Date {
    return new Date(this.createdAtTimestamp)
  }

  public get updatedAt (): Date {
    return new Date(this.updatedAtTimestamp)
  }
}

export default Account
