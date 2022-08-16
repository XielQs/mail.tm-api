import axios, { AxiosResponse } from 'axios';
import getError from '../utils/getError';
import { Mail } from '../types/common';
import MailCache from './MailCache';

export default class Mails {
	cache = new MailCache();

	fetch(id: string): Promise<Mail> {
		return new Promise(async (resolve, reject) => {
			const response: AxiosResponse = await axios.get(`/messages/${id}`).catch(err => err.response);

			if (response.status === 200) {
				this.cache.set(id, response.data);
				resolve(response.data);
			}

			reject(getError(response));
		});
	}

	fetchAll(): Promise<Mail[]> {
		return new Promise(async (resolve, reject) => {
			const response: AxiosResponse = await axios.get('/messages').catch(err => err.response);

			if (response.status === 200) {
				response.data.forEach((mail: Mail) => this.cache.set(mail.id, mail));
				resolve(response.data);
			}

			reject(getError(response));
		});
	}
}
