<center>

# mail.tm-api

[![gamerboytr - mail.tm-api](https://img.shields.io/static/v1?label=gamerboytr&message=mail.tm-api&color=blue&logo=github)](https://github.com/gamerboytr/mail.tm-api "Go to GitHub repo") [![stars - mail.tm-api](https://img.shields.io/github/stars/gamerboytr/mail.tm-api?style=social)](https://github.com/gamerboytr/mail.tm-api) [![forks - mail.tm-api](https://img.shields.io/github/forks/gamerboytr/mail.tm-api?style=social)](https://github.com/gamerboytr/mail.tm-api)

[![GitHub release](https://img.shields.io/github/release/gamerboytr/mail.tm-api?include_prereleases=&sort=semver&color=blue)](https://github.com/gamerboytr/mail.tm-api/releases/) [![License](https://img.shields.io/badge/License-MIT-blue)](#license) [![issues - mail.tm-api](https://img.shields.io/github/issues/gamerboytr/mail.tm-api)](https://github.com/gamerboytr/mail.tm-api/issues)

</center>

⚡ A powerful library to use the Mail.TM and Mail.GW api to receive email

## Installation

```bash
$ npm install mail.tm-api
# Or
$ yarn add mail.tm-api
# Or
$ pnpm install mail.tm-api
```

## Getting Started

- Note: All functions are async/await

### Account

#### Create Account

There is a bunch of way to create an account

```javascript
const Mail = require('mail.tm-api');

const account = await Mail.createAccount();
// Or you can specify the mail address & password
const account = await Mail.createAccount('ADDRESS', 'PASSWORD');
// Example: Mail.createAccount('George', 'mySuperDuperPass')
```

You can create account with only domain

```js
const domain = await Mail.fetchDomains({ getRandomDomain: true });

const account = await Mail.createAccount(domain, 'PASSWORD');
// Without password
const account = await Mail.createAccount(domain);
```

#### Login Account

```js
const MailTM = require('mail.tm-api');

const account = await MailTM.loginAccount('ADDRESS@DOMAIN', 'PASSWORD');

// Login using JWT

const account = await MailTM.loginAccount('TOKEN');
```

Note: If you have a token, you can use it instead of the address & password

#### Fetch Account Info

```js
console.log(await account.fetch());
// { id: 'ID', address: 'ADDRESS@DOMAIN', ... }
```

#### Delete Account

```js
console.log(await account.delete());
// true
```

### Domains

#### Fetch domains

```js
const Mail = require('mail.tm-api');

console.log(await Mail.fetchDomains());
// [{ id: 'DOMAIN_ID', domain: 'DOMAIN' }]

// Fetch a specific page

console.log(await Mail.fetchDomains({ page: 2 }));
// [{ id: 'DOMAIN_ID', domain: 'DOMAIN' }]

// Get random domain
console.log(await Mail.fetchDomains({ getRandomDomain: true }));
```

### Configure Class

```js
const MailTM = require('mail.tm-api');

MailTM.setConfig({
 // Props Here
});
```

#### Available props

- **mailService** _[Optional & 'mail.tm' | 'mail.gw']_ **=** 'mail.tm': Change mail service

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

// Fetch a specific page

console.log(await account.emails.fetchAll(2));
// [{ id: 'MAIL_ID', accountId: 'ACCOUNT_ID', ... }, ...]
```

#### Listen for new emails

```js
account.on('newMail', email => {
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

#### Download a email

```js
console.log(await account.emails.cache.get('MAIL_ID').download('PATH.eml'));
// PATH.eml

// Or

console.log(await (await account.emails.fetch('MAIL_ID')).download('PATH.eml'));
// PATH.eml
```

### License

Released under [MIT](/LICENSE) by [@gamerboytr](https://github.com/gamerboytr).
