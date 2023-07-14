import { Mail as MailType } from '../types/common';
import Mail from '../utils/Mail';
import Account from './Account';

export default class MailCache extends Map<string, Mail> {
  account: Account;

  public constructor (account: Account) {
    super();

    Object.defineProperty(this, 'account', { value: account, configurable: true, writable: false, enumerable: false });
  }

  public set (id: string, mail: MailType): this {
    return super.set(id, new Mail(mail, this.account));
  }
}
