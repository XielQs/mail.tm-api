'use strict';
import getError from './utils/getError';
import { Domain } from './types/common';
import Account from './classes/Account';
import Config from './types/Config';
import axios from 'axios';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = 'https://api.mail.tm';

const CONFIG: Config = {
	disableListening: false
};

let domains: Domain[] = [];

export function fetchDomains(): Promise<Domain[]> {
	return new Promise(async (resolve, reject) => {
		const response = await axios.get('/domains?page=1').catch(err => err.response);

		if (response.status === 200) {
			domains = response.data;
		} else {
			reject(getError(response));
		}

		resolve(domains);
	});
}

export function createAccount(address?: string, password?: string): Promise<Account> {
	return new Promise(async (resolve, reject) => {
		await fetchDomains().catch(reject);

		if (!address) {
			address = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '@' + domains[Math.floor(Math.random() * domains.length)].domain;
		}

		if (!password) {
			password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		}

		const response = await axios.post('/accounts', { address, password }).catch(err => err.response);

		if (response.status === 201) {
			resolve(await new Account(Object.assign(response.data, { password }), CONFIG));
		}

		reject(getError(response));
	});
}

export function loginAccount(addressOrToken: string, password?: string): Promise<Account> {
	return new Promise(async (resolve, reject) => {
		let token: string = '';
		if (!password) {
			token = addressOrToken;
		}
		if (!token && (!addressOrToken || !password)) {
			throw new Error('Token or credentials are required');
		}

		if (addressOrToken && password) {
			const tokenResponse = await axios.post('/token', { addressOrToken, password }).catch(err => err.response);
			const response = await axios.get('/me', { headers: { Authorization: `Bearer ${tokenResponse.data.token}` } }).catch(err => err.response);

			if (response.status === 200) {
				resolve(await new Account(Object.assign(response.data, { token: tokenResponse.data.token, password }), CONFIG));
			}

			reject(getError(response));
		} else {
			const response = await axios.get('/me', { headers: { Authorization: `Bearer ${token}` } }).catch(err => err.response);

			if (response.status === 200) {
				resolve(await new Account(Object.assign(response.data, { token }), CONFIG));
			}

			reject(getError(response));
		}
	});
}

export function setConfig(config: Config) {
	Object.assign(CONFIG, config);
}
