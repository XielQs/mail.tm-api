import type { EventEmitter } from 'node:events'
import type UserAccount from './IUserAccount'
import type { AxiosInstance } from 'axios'
import type EventSource from 'eventsource'
import type Mails from '../classes/Mails'
import type Config from './IConfig'

export default interface IAccount extends UserAccount, EventEmitter {
  mails: Mails
  config: Config
  _eventSource: EventSource
  api: AxiosInstance
}
