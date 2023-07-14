import axios, { AxiosInstance } from 'axios';

let endpoint = 'https://api.mail.tm'

export default function request (service?: 'mail.tm' | 'mail.gw'): AxiosInstance {
  if (service !== undefined && ['mail.tm', 'mail.gw'].includes(service)) {
    endpoint = `https://api.${service}`;
  }

  const instance = axios.create({
    baseURL: endpoint,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Connection: 'close',
      'User-Agent': 'MailTM API - NodeJS'
    }
  });

  return instance;
};
