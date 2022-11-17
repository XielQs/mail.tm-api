export default class MailTMError extends Error {
  constructor (message?: string) {
    super(message);

    this.name = this.constructor.name;
  }
}
