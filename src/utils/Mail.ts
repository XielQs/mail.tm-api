import { Mail as MailType } from '../types/common';
import MailTMError from '../errors/MailTMError';
import getError from './getError';
import request from './request';
import fs from 'node:fs';

export default class Mail implements MailType {
  readonly id: string;
  readonly accountId: string;
  readonly msgid: string;
  readonly from: { address: string, name: string };
  readonly to: Array<{ address: string, name: string }>;
  readonly subject: string;
  readonly intro: string;
  readonly seen: boolean;
  readonly isDeleted: boolean;
  readonly hasAttachments: boolean;
  readonly downloadUrl: string;
  readonly size: number;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor (mail: MailType) {
    Object.assign(this, mail);
  }

  async fetch (): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      if (this.isDeleted) {
        reject(new MailTMError('Mail is deleted'));
        return;
      }

      const response = await request().get(`/messages/${this.id}`).catch(err => err.response);

      if (response.status === 200) {
        Object.assign(this, response.data);
      } else {
        reject(getError(response));
        return;
      }

      resolve(this);
    });
  }

  async delete (): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      if (this.isDeleted) {
        reject(new MailTMError('Mail is already deleted'));
        return;
      }

      const response = await request().delete(`/messages/${this.id}`).catch(err => err.response);

      if (response.status === 204) {
        Object.defineProperty(this, 'isDeleted', { value: true });
      } else {
        reject(getError(response));
        return;
      }

      resolve(this);
    });
  }

  async setIsSeen (seen: boolean = true): Promise<this> {
    return await new Promise(async (resolve, reject) => {
      const response = await request().patch(`/messages/${this.id}`, { seen }).catch(err => err.response);

      if (response.status === 200) {
        Object.assign(this, response.data);
      } else {
        reject(getError(response));
        return;
      }

      resolve(this);
    });
  }

  async download<Path extends string = ''> (path?: Path): Promise<Path> {
    return await new Promise(async (resolve, reject) => {
      if (path === null || path === undefined) {
        path = `${this.id}.eml` as Path;
      }

      if (typeof this.downloadUrl !== 'string') {
        reject(new MailTMError('Download url not available!'));
        return;
      }

      const response = await request().get(this.downloadUrl, { headers: { Accept: 'text/html' } }).catch(e => e.response);

      if (typeof response.data !== 'string') {
        reject(getError(response));
        return;
      }

      fs.writeFileSync(path, response.data, 'utf-8');

      resolve(path);
    });
  }
}
