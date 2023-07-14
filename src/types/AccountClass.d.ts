import { EventEmitter } from 'node:events';
import UserAccount from './UserAccount';
import { AxiosInstance } from 'axios';
import EventSource from 'eventsource';
import Mails from '../classes/Mails';
import Config from './Config';

export default interface Account extends UserAccount, EventEmitter {
  mails: Mails
  config: Config
  _eventSource: EventSource
  api: AxiosInstance
}
