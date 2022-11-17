import MailTMError from '../errors/MailTMError';
import { AxiosResponse } from 'axios';

export default function getError<Response extends AxiosResponse> (response: Response): MailTMError | Response {
  if (response.data !== null) {
    return response.data.detail !== null && response.data.detail !== undefined ? new MailTMError(response.data.detail) : response.data.message !== null && response.data.message !== undefined ? new MailTMError(response.data.message) : response;
  } else {
    return new MailTMError(`Request failed with status ${response.status}`);
  }
}
