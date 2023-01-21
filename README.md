# Chargeflow Activity

An online e-commerce system built in Node.js, AWS SAM, and MongoDB

## Lambda Functions

- GetProductCatalogFunction
  -- List all available products
- CheckoutFunction
  -- Creates order upon checkout.
- CheckoutFunction
  -- Sends email with order summary to user after creation of order

### Development

Installation:

```sh
npm install
```

Add the following to .env:

```sh
mongoDBURI=
databaseName=
gmailUsername=
gmailPassword=
mailSender=
```

Run project locally

```sh
npm run build
npm run start
```

Run unit tests

```sh
npm test
```

Deploy project

```sh
npm run deploy
```
