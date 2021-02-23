const Eris = require("eris");
const bot = new Eris.CommandClient(
  process.env.BOT_TOKEN,
  {},
  {
    description: "Checks your vibe",
    owner: "Bruh",
    prefix: "!",
    restMode: true
  }
);

module.exports = bot;
