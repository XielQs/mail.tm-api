import axios, { AxiosInstance } from 'axios';

const instance = axios.create({
  baseURL: 'https://api.mail.tm',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Connection: 'close',
    'User-Agent': 'MailTM API - NodeJS'
  }
});

export default function request (service?: string): AxiosInstance {
  if (service !== null && service !== undefined) {
    instance.defaults.baseURL = `https://api.${service}`;
  }
  return instance;
};
