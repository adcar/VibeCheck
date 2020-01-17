const { getUserIdFromMsg, getTimeLeft } = require("./utils");
const jsonfile = require("jsonfile");
const file = "../data.json";
const invalidUserMsg = "Yeah... um sweaty? That's not a valid username. K thx.";
//  Array that stores the users that are still being cooled down.
let coolDownUsers = [];

module.exports = async function(type, msg, args) {
  let userId;
  if (args.length === 0) {
    userId = await getUserIdFromMsg(msg);
    if (userId === null) {
      return msg.channel.createMessage("Couldn't find a message to vote on");
    }
  } else {
    const mention = args[0];
    userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
  }
  const guild = msg.channel.guild;

  const member = guild.members.get(userId);
  const userIsInGuild = !!member;
  if (!userIsInGuild) {
    return msg.channel.createMessage(invalidUserMsg);
  }

  if (msg.author.id === userId) {
    return "You can't vote on yourself cringe normie";
  }

  // obj is the file that lists the scores of all users.
  let obj = jsonfile.readFileSync(file);

  if (coolDownUsers.filter(e => e.userId === msg.author.id).length > 0) {
    let timeLeftMsg = null;
    let minutes;
    coolDownUsers.forEach(coolDownUser => {
      if (coolDownUser.userId === msg.author.id) {
        const timeLeft = getTimeLeft(coolDownUser.timeout);
        minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft - minutes * 60;

        timeLeftMsg = `You must wait ${minutes}m ${seconds}s before doing that again`;
      }
    });
    if (minutes > 0) {
      return timeLeftMsg;
    }
  }
  const timeout = setTimeout(() => {
    // If the user is in the coolDownUsers array, remove them from it.

    coolDownUsers = coolDownUsers.filter(e => e.userId !== msg.author.id);
  }, 180000); // 3 minutes
  coolDownUsers.push({ userId: msg.author.id, timeout: timeout });

  // If the user id does not exist in the file, set their score to 0
  if (!obj[userId]) {
    obj[userId] = 0;
  }

  if (type === "upvote") {
    obj[userId]++;
    jsonfile.writeFileSync(file, obj);
    return `Kek. ${member.username}'s score is now ${obj[userId]}`;
  }
  if (type === "downvote") {
    obj[userId]--;
    jsonfile.writeFileSync(file, obj);
    return `Cringe. ${member.username}'s score is now ${obj[userId]}`;
  }
};
