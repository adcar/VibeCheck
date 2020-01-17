# VibeCheck

## Set up VibeCheck locally

### Dependencies

Make sure you have NodeJS 10+ installed with NPM.

```
$ node --version
v12.13.0
$ npm --version
6.12.0
```

### Obtaining a Bot token

You will need to go to [discordapp.com/developers/applications](https://discordapp.com/developers/applications/) and create a new application.

Then go to the "bot" section and under "token" click "copy"

Now you have your token which you will use when running VibeCheck

### Downloading & Installing VibeCheck

```
git clone https://github.com/adcar/VibeCheck.git
cd VibeCheck
npm install
```

### Running VibeCheck

You will need to give VibeCheck your bot token and a location of a data.json file. Your data.json file should contain the following:

`{}`

This file is where the scores of all users will be stored, so keep it safe!

The command to run VibeCheck can be structured like this:

`BOT_TOKEN=<your-bot-token> node index.js <path-to-data.json>`

So, for example, your command might be:

`BOT_TOKEN=bWhaAicAPAB3hviVx2zyXMflRzOVpHygf5 node index.js ~/data.json`

(No, that is not a valid bot token)
