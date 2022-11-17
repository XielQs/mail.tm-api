import UserAccount from './UserAccount';
import EventEmitter from 'node:events';
import EventSource from 'eventsource';
import Mails from '../classes/Mails';
import Config from './Config';

export default interface AccountClass<Listening> extends UserAccount, EventEmitter {
  mails: Mails
  config: Config
  _eventSource: Listening extends true ? EventSource : undefined
}
