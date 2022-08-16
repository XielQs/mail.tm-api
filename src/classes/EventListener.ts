import UserAccount from '../types/UserAccount';
import EventSource from 'eventsource';
import { Mail } from '../types/common';
import AccountClass from './Account';

export default function (Account: AccountClass) {
	if (Account.config.disableListening) {
		return;
	}

	Account._eventSource = new EventSource(`https://mercure.mail.tm/.well-known/mercure?topic=/accounts/${Account.id}`, { headers: { Authorization: `Bearer ${Account.token}`, Accept: 'application/json' } });

	Account._eventSource.onmessage = event => {
		const data = JSON.parse(event.data);
		const jsonData = Object.keys(data)
			.filter(key => !['@context', '@id', '@type'].includes(key))
			.reduce((acc, cur) => ({ ...acc, [cur]: data[cur] }), {}) as UserAccount | Mail;

		switch (data['@type']) {
			case 'Account':
				Object.assign(Account, jsonData);
				break;
			case 'Message':
				Account.mails.cache.set(jsonData.id, jsonData as Mail);
				Account.emit('newMail', jsonData as Mail);
				break;
		}
	};
}
