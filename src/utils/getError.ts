import MailTMError from '../errors/MailTMError'
import type { AxiosResponse } from 'axios'

function check (value: any): boolean {
  return value !== null && value !== undefined
}

export default function getError<Response extends AxiosResponse> (response: Response): MailTMError | Response {
  // @ts-expect-error - Response can be AxiosError
  if (check(response.cause)) {
    return response
  } else if (check(response.data)) {
    return check(response.data.detail) ? new MailTMError(response.data.detail) : check(response.data.message) ? new MailTMError(response.data.message) : response
  } else {
    return new MailTMError(`Request failed with status ${response.status}`)
  }
}
