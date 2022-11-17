import { Mail as MailType } from '../types/common';
import Mail from '../utils/Mail';

export default class MailCache extends Map<string, Mail> {
  set (id: string, mail: MailType): this {
    return super.set(id, new Mail(mail));
  }
}
