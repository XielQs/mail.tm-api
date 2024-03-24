import type { CreateAxiosDefaults } from 'axios'

export default interface IConfig {
  mailService?: 'mail.tm' | 'mail.gw'
  axiosOptions?: CreateAxiosDefaults
}
