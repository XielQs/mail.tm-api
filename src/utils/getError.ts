import { AxiosResponse } from 'axios';

export default function getError(response: AxiosResponse): string {
	if (response.data) {
		return response.data.detail ?? response.data.message;
	} else {
		return `Request failed with status ${response.status}`;
	}
}
