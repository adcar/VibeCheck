const { getUserIdFromMsg, getTimeLeft } = require("./utils");
const jsonfile = require("jsonfile");
const errorMsgs = require("./errorMsgs");
//  Array that stores the users that are still being cooled down.
let noneCoolDownUsers = [];
let goldCoolDownUsers = [];
let platCoolDownUsers = [];

const DAY_IN_MS = 86400000;
const MINUTE_IN_MS = 60000;

const goldCoolDownTime = DAY_IN_MS;
const platCoolDownTime = DAY_IN_MS * 30;
const noneCoolDownTime = MINUTE_IN_MS * 3;

module.exports = async function (type, msg, args, file, medal = "none") {

  let userId;
  if (args.length === 0) {
    userId = await getUserIdFromMsg(msg);
    if (userId === null) {
      return errorMsgs.noValidMessageFound;
    }
  } else {
    const mention = args[0];
    userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
  }
  const guild = msg.channel.guild;

  const member = guild.members.get(userId);
  const userIsInGuild = !!member;
  if (!userIsInGuild) {
    return errorMsgs.invalidUserMsg;
  }

  if (msg.author.id === userId) {
    return errorMsgs.noSelfVoting;
  }

  // obj is the file that lists the scores of all users.
  let obj = jsonfile.readFileSync(file);

  // If the user is found in the timeout list, just return the error message
  // TODO: Refactor this horrible, horrible, terrible, disgusting code (just make a function that takes an array argument)
  if (medal === "none") {
    if (
      noneCoolDownUsers.filter((e) => e.userId === msg.author.id).length > 0
    ) {
      let timeLeftMsg;
      noneCoolDownUsers.forEach((coolDownUser) => {
        if (coolDownUser.userId === msg.author.id) {
          const timeLeft = getTimeLeft(coolDownUser.timeout);
          timeLeftMsg = errorMsgs.cooldown(timeLeft);
        }
      });

      return timeLeftMsg;
    }
  } else if (medal === "gold") {
    if (
      goldCoolDownUsers.filter((e) => e.userId === msg.author.id).length > 0
    ) {
      let timeLeftMsg;
      goldCoolDownUsers.forEach((coolDownUser) => {
        if (coolDownUser.userId === msg.author.id) {
          const timeLeft = getTimeLeft(coolDownUser.timeout);
          timeLeftMsg = errorMsgs.cooldown(timeLeft);
        }
      });

      return timeLeftMsg;
    }
  } else if (medal === "plat") {
        if (
      platCoolDownUsers.filter((e) => e.userId === msg.author.id).length > 0
    ) {
      let timeLeftMsg;
      platCoolDownUsers.forEach((coolDownUser) => {
        if (coolDownUser.userId === msg.author.id) {
          const timeLeft = getTimeLeft(coolDownUser.timeout);
          timeLeftMsg = errorMsgs.cooldown(timeLeft);
        }
      });

      return timeLeftMsg;
  }

  if (medal === "none") {
    const timeout = setTimeout(() => {
      // If the user is in the coolDownUsers array, remove them from it.

      noneCoolDownUsers = noneCoolDownUsers.filter(
        (e) => e.userId !== msg.author.id
      );
    }, noneCoolDownTime); // 3 minutes
    noneCoolDownUsers.push({ userId: msg.author.id, timeout: timeout });
  } else if (medal === "gold") {
    const timeout = setTimeout(() => {
      // If the user is in the coolDownUsers array, remove them from it.

      goldCoolDownUsers = goldCoolDownUsers.filter(
        (e) => e.userId !== msg.author.id
      );
    }, goldCoolDownTime); // 1 day
    goldCoolDownUsers.push({ userId: msg.author.id, timeout: timeout });
  } else if (medal === "plat") {
        const timeout = setTimeout(() => {
      // If the user is in the coolDownUsers array, remove them from it.

      platCoolDownUsers = platCoolDownUsers.filter(
        (e) => e.userId !== msg.author.id
      );
    }, platCoolDownTime); // 30 days
     platCoolDownUsers.push({ userId: msg.author.id, timeout: timeout });
  }

  // If the user id does not exist in the file, set their score to 0
  if (!obj[userId]) {
    obj[userId] = 0;
  }

  if (type === "upvote") {
    if (medal === "none") {
      obj[userId]++;
      jsonfile.writeFileSync(file, obj);
      return `Kek. ${member.username}'s score is now ${obj[userId]}`;
    }
    if (medal === "gold") {
      obj[userId] += 10;
      jsonfile.writeFileSync(file, obj);
      return `Thanks for the gold kind stranger! ${member.username}'s score is now ${obj[userId]}`;
    }

    if (medal === "plat") {
      obj[userId] += 10;
      jsonfile.writeFileSync(file, obj);
      return `OMG!!! YESSSS YESSSSSSSSS THANK YOU SO FUCKING MUCH FOR THE PLAT HOLY SHIT I CAN'T BELIEVE THIS IS HAPPENING YASSSSSS!!!1111 
      
      ${member.username}'s score is now ${obj[userId]}`;
    }
  }

  if (type === "downvote") {
    obj[userId]--;
    jsonfile.writeFileSync(file, obj);
    return `Cringe. ${member.username}'s score is now ${obj[userId]}`;
  }
};
