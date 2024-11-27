# React Native Demo Wallet

## API

This examples uses [Vercel Serverless Functions](https://vercel.com/docs/functions) to handle the Turnkey API requests.

- [Expo API Routes](https://docs.expo.dev/router/reference/api-routes/)

### One-Click Deploy

You can deploy this example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/node-hello-world&project-name=node-hello-world&repository-name=node-hello-world)

### OR Clone and Deploy

```bash
git clone https://github.com/vercel/examples/tree/main/solutions/node-hello-world
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```

Then deploy the app to Vercel:

```bash
vercel deploy
```

### Notes:

- Added `origin` to the app config to allow the API routes to work on native.

```json
{
  "plugins": [
    {
      "origin": "https://wallet.tx.xyz"
    }
  ]
}
```
