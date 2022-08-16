import { Mail as MailType } from '../types/common';
import getError from './getError';
import axios from 'axios';

export default class Mail implements MailType {
	readonly id: string;
	readonly accountId: string;
	readonly msgid: string;
	readonly from: { address: string; name: string };
	readonly to: { address: string; name: string }[];
	readonly subject: string;
	readonly intro: string;
	readonly seen: boolean;
	readonly isDeleted: boolean;
	readonly hasAttachment: boolean;
	readonly downloadUrl: string;
	readonly size: number;
	readonly createdAt: string;
	readonly updatedAt: string;

	constructor(mail: MailType) {
		Object.assign(this, mail);
	}

	fetch(): Promise<this> {
		return new Promise(async (resolve, reject) => {
			if (this.isDeleted) {
				reject('Mail is deleted');
			}

			const response = await axios.get(`/messages/${this.id}`).catch(err => err.response);

			if (response.status === 200) {
				Object.assign(this, response.data);
			} else {
				reject(getError(response));
			}

			resolve(this);
		});
	}

	delete(): Promise<this> {
		return new Promise(async (resolve, reject) => {
			if (this.isDeleted) {
				reject('Mail is already deleted');
			}

			const response = await axios.delete(`/messages/${this.id}`).catch(err => err.response);

			if (response.status === 204) {
				Object.assign(this, { isDeleted: true });
			} else {
				reject(getError(response));
			}

			resolve(this);
		});
	}

	update(data: { [key: string]: string | boolean | number }): Promise<this> {
		return new Promise(async (resolve, reject) => {
			const response = await axios.patch(`/messages/${this.id}`, data).catch(err => err.response);

			if (response.status === 200) {
				Object.assign(this, response.data);
			} else {
				reject(getError(response));
			}

			resolve(this);
		});
	}
}
