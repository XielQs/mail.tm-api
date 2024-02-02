import type { IMail } from '../types/common'
import type Account from './Account'
import Mail from '../utils/Mail'

export default class MailCache extends Map<string, Mail<false>> {
  account!: Account

  public constructor (account: Account) {
    super()

    Object.defineProperty(this, 'account', { value: account, configurable: true, writable: false, enumerable: false })
  }

  public set (id: string, mail: IMail): this {
    return super.set(id, new Mail(mail, this.account))
  }
}
