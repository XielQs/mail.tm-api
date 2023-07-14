import randomString from './utils/randomString';
import MailTMError from './errors/MailTMError';
import getError from './utils/getError';
import { Domain } from './types/common';
import Account from './classes/Account';
import { AxiosResponse } from 'axios';
import request from './utils/request';
import Config from './types/Config';
import formatDates from './utils/formatDates';

const CONFIG: Config = {
  mailService: 'mail.tm'
};

let domains: Domain[] = [];

/**
 * Fetches available domains from server
 */
export async function fetchDomains<Random extends boolean = false> ({ page = 1, getRandomDomain = false as Random }: { page?: number, getRandomDomain?: Random } | undefined = {}): Promise<Random extends true ? Domain : Domain[]> {
  return await new Promise(async (resolve, reject) => {
    const response = await request().get(`/domains?page=${page}`).catch(e => e.response ?? e);
    if (response.status === 200) {
      domains = response.data.map((domain: Domain) => {
        domain = formatDates(domain)
        Object.defineProperty(domain, 'createdAt', { get: () => new Date(domain.createdAtTimestamp) })
        Object.defineProperty(domain, 'updatedAt', { get: () => new Date(domain.updatedAtTimestamp) })
        return domain
      });
      if (getRandomDomain === true) {
        resolve(domains[Math.floor(Math.random() * domains.length)] as Random extends true ? Domain : Domain[]);
      } else {
        resolve(domains as Random extends true ? Domain : Domain[]);
      }
    } else {
      reject(getError(response));
    }
  });
}

/**
 * Creates an account
 * @example
 * const account = await createAccount();
 * console.log(account.email);
 */
export async function createAccount (address?: string, password?: string): Promise<Account> {
  return await new Promise(async (resolve, reject) => {
    await fetchDomains().catch(reject);

    if (typeof address !== 'string') {
      address = `${randomString(16)}@${domains[Math.floor(Math.random() * domains.length)].domain}`;
    }

    if (address.split('@').length === 1) {
      if (domains.some(domain => domain.domain === address)) {
        address = `${randomString(16)}@${address}`;
      } else {
        address += `@${domains[Math.floor(Math.random() * domains.length)].domain}`;
      }
    }

    if (typeof password !== 'string') {
      password = randomString(16);
    }

    const response = await request().post('/accounts', { address, password }).catch(e => e.response ?? e);

    if (response.status === 201) {
      const account = new Account(Object.assign(response.data, { password }), CONFIG);
      await account.fetch().catch(reject);
      await account.mails.fetchAll().catch(reject);
      resolve(account);
      return;
    }

    reject(getError(response));
  });
}

/**
 * Logs into an existing account
 * @example
 * const account = await loginAccount("mySuperSecretToken"); // Login with account token
 * console.log(account.email);
 * // Or
 * const account = await loginAccount("myEmail@domain.com", "mySuperSecretPassword");
 * console.log(account.email);
 */
export async function loginAccount (addressOrToken: string, password?: string): Promise<Account> {
  return await new Promise(async (resolve, reject) => {
    await fetchDomains().catch(reject);

    if (typeof addressOrToken !== 'string') {
      throw new MailTMError('Token or credentials are required');
    }

    if (typeof password === 'string') {
      const tokenResponse = await request().post('/token', { address: addressOrToken, password }).catch(e => e.response ?? e) as AxiosResponse<{ token?: string }>;

      if (tokenResponse.status !== 200 || typeof tokenResponse.data.token !== 'string' || tokenResponse.data.token === '') {
        reject(getError(tokenResponse));
        return;
      }

      const response = await request().get('/me', { headers: { Authorization: `Bearer ${tokenResponse.data.token}` } }).catch(e => e.response ?? e);

      if (response.status === 200) {
        const account = new Account(Object.assign(response.data, { token: tokenResponse.data.token, password }), CONFIG);
        await account.fetch().catch(reject);
        await account.mails.fetchAll().catch(reject);
        resolve(account);
        return;
      }

      reject(getError(response));
    } else {
      const response = await request().get('/me', { headers: { Authorization: `Bearer ${addressOrToken}` } }).catch(e => e.response ?? e);

      if (response.status === 200) {
        const account = new Account(Object.assign(response.data, { token: addressOrToken }), CONFIG);
        await account.fetch().catch(reject);
        await account.mails.fetchAll().catch(reject);
        resolve(account);
        return;
      }

      reject(getError(response));
    }
  });
}

export function setConfig (config: Config): void {
  // @ts-expect-error
  if (config.disableListening !== undefined) {
    process.emitWarning('Config property <disableListening> is deprecated', 'Warning')
  }

  request(config.mailService);
  Object.assign(CONFIG, config);
}
