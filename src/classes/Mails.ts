import type { IMail } from '../types/common'
import getError from '../utils/getError'
import type Account from './Account'
import MailCache from './MailCache'
import Mail from '../utils/Mail'

export default class Mails {
  cache!: MailCache
  account!: Account

  public constructor (account: Account) {
    Object.defineProperty(this, 'account', { value: account, configurable: true, writable: false, enumerable: false })
    Object.defineProperty(this, 'cache', { value: new MailCache(account), configurable: true, writable: false, enumerable: false })
  }

  public async fetch (id: string): Promise<Mail<false>> {
    return await new Promise(async (resolve, reject) => {
      const response = await this.account.api.get(`/messages/${id}`).catch(e => e.response ?? e)

      if (response.status === 200) {
        this.cache.set(id, response.data)
        resolve(new Mail<false>(response.data, this.account))
        return
      }

      reject(getError(response))
    })
  }

  public async fetchAll (page: number = 1): Promise<Array<Mail<false>>> {
    return await new Promise(async (resolve, reject) => {
      const response = await this.account.api.get(`/messages?page=${page}`).catch(e => e.response ?? e)

      if (response.status === 200) {
        response.data.forEach((mail: IMail) => this.cache.set(mail.id, mail))
        resolve(response.data.map((mail: IMail) => new Mail<false>(mail, this.account)))
        return
      }

      reject(getError(response))
    })
  }
}
