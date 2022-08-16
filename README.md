# mail.tm-api

A powerful library to use the Mail.TM api to receive email

## Installation

```bash
$ npm install mail.tm-api
```

## Getting Started

- Note: All functions are async/await

### Account

#### Create Account

```javascript
const MailTM = require('mail.tm-api');

const account = await MailTM.createAccount();
// Or you can specify the mail address & password
const availableDomains = await MailTM.fetchDomains();
const account = await MailTM.createAccount('ADDRESS@' + availableDomains[0].domain, 'PASSWORD');
```

#### Login Account

```js
const MailTM = require('mail.tm-api');

const account = await MailTM.loginAccount('ADDRESS@DOMAIN', 'PASSWORD');

// Using with token

const account = await MailTM.loginAccount('TOKEN');
```

Note: If you have a token, you can use it instead of the address & password

### Fetch Account Info

```js
console.log(await account.fetch());
// { id: 'ID', address: 'ADDRESS@DOMAIN', ... }
```

### Delete Account

```js
console.log(await account.delete());
// true
```

### Configure Class

```js
const MailTM = require('mail.tm-api');

MailTM.setConfig({
 // Props Here
});
```

#### Available props

- **disableListening** _[Optional & Boolean]_ **=** false: Disable listening for new emails

### Emails

#### Get a cached email

```js
console.log(account.emails.cache.get('MAIL_ID'));
// { id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ... }
```

Note: account.emails.cache is a Map object, you can use all Map methods

#### Fetch a email

```js
console.log(await account.emails.fetch('MAIL_ID'));
// { id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ... }

// Or

console.log(await account.emails.cache.get('MAIL_ID').fetch());
// { id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ... }
```

#### Fetch all emails

```js
console.log(await account.emails.fetchAll());
// [{ id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ... }, ...]
```

#### Listen for new emails

```js
account.on('newEmail', email => {
 console.log(email);
 // { id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ... }
});

// Or

account.addListener('newEmail', email => {
 console.log(email);
 // { id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ... }
});
```

#### Delete a email

```js
console.log(await account.emails.cache.get('MAIL_ID').delete());
// { id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ..., isDeleted: true }

// Or

console.log(await (await account.emails.fetch('MAIL_ID')).delete());
// { id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ..., isDeleted: true }
```

### License

Licensed under the MIT License

Copyright (c) 2022 GamerboyTR
