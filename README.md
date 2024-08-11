# TheGeneralStore Bot 🛍️🪥

> 💬 **Try it:** Message `thegeneralstore.eth`

## Development

To kickstart the tutorial, you'll need to clone the repository containing the bot code. Follow these steps:

```bash
git clone https://github.com/fabriguespe/thegeneralstore-bot.git
cd thegeneralstore-bot
# copy env variables template
cp .env.example .env
```

**Set the variables**

```bash
KEY= # the private key of the bot
XMTP_ENV= # set to production or dev network
```

**Run the bot**

```bash
# install dependencies
yarn install

# to run with hot-reload
yarn build:watch
yarn start:watch
```

## Messaging apps 💬

Test the bots in messaging apps

- [Converse](https://getconverse.app/): Own your conversations. Works with Frames (Transactions TBA)
- [Coinbase Wallet](https://www.coinbase.com/wallet): Your key to the world of crypto. (Frame support TBA)

## Documentation 📚

To learn more about MessageKit, to go the [docs](https://message-kit.vercel.app)

---

Made with ❤️ by [Ephemera](https://ephemerahq.com)
