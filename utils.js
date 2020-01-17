const bot = require("./bot.js");

module.exports = {
  // Returns the userId or null if not found
  getUserIdFromMsg: async function(msg) {
    const lastMsgs = await msg.channel.getMessages(100, msg.id);
    const userId = msg.author.id;
    let msgToBeVoted;
    lastMsgs.forEach(msg => {
      if (
        msg.author.id !== bot.user.id &&
        msg.author.id !== userId &&
        !msg.content.includes("!u") &&
        !msg.content.includes("!d")
      ) {
        msgToBeVoted = msg;
      }
    });
    if (msgToBeVoted) {
      return msgToBeVoted.author.id;
    } else {
      return null;
    }
  },
  // Util function for getting time left form a setTimeout
  getTimeLeft: function(timeout) {
    return Math.ceil(
      (timeout._idleStart + timeout._idleTimeout) / 1000 - process.uptime()
    );
  }
};
