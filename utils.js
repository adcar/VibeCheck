const bot = require("./bot.js");

module.exports = {
  // Returns the userId or null if not found
  async getUserIdFromMsg(msg) {
    const lastMsgs = await msg.channel.getMessages(100, msg.id);
    const userId = msg.author.id;
    let msgToBeVoted;
    for (let i = 100; i > 0; i--) {
      if (
        lastMsgs[i].author.id !== bot.user.id &&
        lastMsgs[i].author.id !== userId &&
        !lastMsgs[i].content.includes("!u") &&
        !lastMsgs[i].content.includes("!d")
      ) {
        msgToBeVoted = lastMsgs[i];
      }
    }

    if (msgToBeVoted) {
      return msgToBeVoted.author.id;
    } else {
      return null;
    }
  },
  // Util function for getting time left form a setTimeout
  getTimeLeft(timeout) {
    return Math.ceil(
      (timeout._idleStart + timeout._idleTimeout) / 1000 - process.uptime()
    );
  }
};
