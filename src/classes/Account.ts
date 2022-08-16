import AccountType from '../types/AccountClass';
import UserAccount from '../types/UserAccount';
import EventListener from './EventListener';
import getError from '../utils/getError';
import EventEmitter from 'node:events';
import EventSource from 'eventsource';
import Config from '../types/Config';
import Mails from './Mails';
import axios from 'axios';

export default class Account extends EventEmitter implements AccountType {
	mails = new Mails();
	_eventSource?: EventSource;
	config: Config;
	id: string;
	address: string;
	quota: number;
	used: number;
	isDisabled: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	token: string;
	password?: string | undefined;

	constructor(account: UserAccount, config: Config = {}) {
		super();

		// @ts-ignore
		return new Promise(async resolve => {
			Object.assign(this, { config });
			Object.assign(this, account);
			await this.fetch();
			await this.mails.fetchAll();
			EventListener(this);
			resolve(this);
		});
	}

	fetch(): Promise<this> {
		return new Promise(async (resolve, reject) => {
			if (!this.token) {
				const tokenResponse = await axios.post('/token', { address: this.address, password: this.password }).catch(err => err.response);

				if (tokenResponse.status === 200) {
					this.token = tokenResponse.data.token;
					axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
				} else {
					reject(getError(tokenResponse));
				}
			} else {
				axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
			}

			const accountResponse = await axios.get('/me').catch(err => err.response);
			if (accountResponse.status === 200) {
				Object.assign(this, accountResponse.data, { password: this.password, token: this.token });
				resolve(this);
			}

			reject(getError(accountResponse));
		});
	}

	delete(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			const response = await axios.delete(`/accounts/${this.id}`).catch(err => err.response);

			if (response.status === 204) {
				this._eventSource?.close();
				resolve(true);
			}

			reject(getError(response));
		});
	}
}
