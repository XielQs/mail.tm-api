import axios, { type CreateAxiosDefaults, type AxiosInstance } from 'axios'

let endpoint = 'https://api.mail.tm'
let options: CreateAxiosDefaults = {}

export default function request (service?: 'mail.tm' | 'mail.gw', axiosOptions?: CreateAxiosDefaults): AxiosInstance {
  if (service !== undefined && ['mail.tm', 'mail.gw'].includes(service)) {
    endpoint = `https://api.${service}`
  }
  if (axiosOptions !== undefined) {
    options = axiosOptions
  }

  const instance = axios.create({
    ...options,
    baseURL: endpoint,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Connection: 'close',
      'User-Agent': 'MailTM API - NodeJS'
    }
  })

  return instance
}
