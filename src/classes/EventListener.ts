import UserAccount from '../types/UserAccount';
import formatDates from '../utils/formatDates';
import { Mail } from '../types/common';
import EventSource from 'eventsource';
import AccountClass from './Account';

export default function EventListener (Account: AccountClass): void {
  const eventSource = new EventSource(`https://mercure.${Account.config.mailService ?? 'mail.tm'}/.well-known/mercure?topic=/accounts/${Account.id}`, { headers: { Authorization: `Bearer ${Account.token}`, Accept: 'application/json' } });

  eventSource.onmessage = event => {
    const data = JSON.parse(event.data);
    const jsonData = Object.keys(data)
      .filter(key => !['@context', '@id', '@type'].includes(key))
      .reduce((acc, cur) => ({ ...acc, [cur]: data[cur] }), {}) as UserAccount | Mail;

    switch (data['@type']) {
      case 'Account':
        if (jsonData.isDeleted) {
          eventSource.close();
        }
        Object.assign(Account, formatDates(jsonData as UserAccount));
        Account.emit('account', jsonData as UserAccount);
        break;
      case 'Message':
        Account.mails.cache.set(jsonData.id, jsonData as Mail);
        Account.emit('newMail', jsonData as Mail);
        break;
    }
  };

  Object.defineProperty(Account, '_eventSource', { value: eventSource, configurable: true, writable: true, enumerable: false });
}
