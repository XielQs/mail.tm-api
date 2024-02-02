import type IUserAccount from '../types/IUserAccount'
import formatDates from '../utils/formatDates'
import type { IMail } from '../types/common'
import type AccountClass from './Account'
import EventSource from 'eventsource'
import type Mail from '../utils/Mail'

export default function EventListener (Account: AccountClass): void {
  const eventSource = new EventSource(`https://mercure.${Account.config.mailService ?? 'mail.tm'}/.well-known/mercure?topic=/accounts/${Account.id}`, { headers: { Authorization: `Bearer ${Account.token}`, Accept: 'application/json' } })

  eventSource.onmessage = event => {
    const data = JSON.parse(event.data)
    const jsonData = Object.keys(data)
      .filter(key => !['@context', '@id', '@type'].includes(key))
      .reduce((acc, cur) => ({ ...acc, [cur]: data[cur] }), {}) as IUserAccount | IMail

    switch (data['@type']) {
      case 'Account':
        if ((jsonData as IUserAccount).isDeleted) {
          eventSource.close()
        }
        Object.assign(Account, formatDates(jsonData as IUserAccount))
        Account.emit('account', jsonData as IUserAccount)
        break
      case 'Message':
        Account.mails.cache.set(jsonData.id, jsonData as Mail<true>)
        Account.emit('newMail', jsonData as Mail<true>)
        break
    }
  }

  Object.defineProperty(Account, '_eventSource', { value: eventSource, configurable: true, writable: true, enumerable: false })
}
