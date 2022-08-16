import EventSource from 'eventsource';
import UserAccount from './UserAccount';
import Config from './Config';

export default interface AccountClass extends UserAccount, EventEmitter {
	mails: Mails;
	config: Config;
	_eventSource?: EventSource;
}
