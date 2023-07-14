import { Mail as MailType } from '../types/common';
import MailTMError from '../errors/MailTMError';
import Account from '../classes/Account';
import formatDates from './formatDates';
import getError from './getError';
import request from './request';
import fs from 'node:fs';

export default class Mail implements MailType {
  public account: Account;
  public readonly id: string;
  public readonly accountId: string;
  public readonly msgid: string;
  public readonly from: { address: string, name: string };
  public readonly to: Array<{ address: string, name: string }>;
  public readonly subject: string;
  public readonly intro: string;
  public readonly seen: boolean;
  public readonly isDeleted: boolean;
  public readonly hasAttachments: boolean;
  public readonly downloadUrl: string;
  public readonly size: number;
  public readonly createdAtTimestamp: string;
  public readonly updatedAtTimestamp: string;

  public constructor (mail: MailType, account: Account) {
    Object.defineProperty(this, 'account', { value: account, configurable: true, writable: false, enumerable: false });
    Object.assign(this, formatDates(mail));
  }

  public async fetch (): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      if (this.isDeleted) {
        reject(new MailTMError('Mail is deleted'));
        return;
      }

      const response = await request().get(`/messages/${this.id}`).catch(e => e.response ?? e);

      if (response.status === 200) {
        Object.assign(this, formatDates(response.data));
      } else {
        reject(getError(response));
        return;
      }

      resolve(this);
    });
  }

  public async delete (): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      if (this.isDeleted) {
        reject(new MailTMError('Mail is already deleted'));
        return;
      }

      const response = await request().delete(`/messages/${this.id}`).catch(e => e.response ?? e);

      if (response.status === 204) {
        Object.defineProperty(this, 'isDeleted', { value: true });
      } else {
        reject(getError(response));
        return;
      }

      resolve(this);
    });
  }

  public async setIsSeen (seen: boolean = true): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      const response = await request().patch(`/messages/${this.id}`, { seen }).catch(e => e.response ?? e);

      if (response.status === 200) {
        Object.assign(this, formatDates(response.data));
      } else {
        reject(getError(response));
        return;
      }

      resolve(this);
    });
  }

  public async download<Path extends string = ''> (path?: Path): Promise<Path> {
    return await new Promise(async (resolve, reject) => {
      if (path === null || path === undefined) {
        path = `${this.id}.eml` as Path;
      }

      if (typeof this.downloadUrl !== 'string') {
        reject(new MailTMError('Download url not available!'));
        return;
      }

      const response = await request().get(this.downloadUrl, { headers: { Accept: 'text/html' } }).catch(e => e.response ?? e);

      if (typeof response.data !== 'string') {
        reject(getError(response));
        return;
      }

      fs.writeFileSync(path, response.data, 'utf-8');

      resolve(path);
    });
  }

  public get createdAt (): Date {
    return new Date(this.createdAtTimestamp)
  }

  public get updatedAt (): Date {
    return new Date(this.updatedAtTimestamp)
  }
}
