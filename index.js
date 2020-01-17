const Eris = require("eris");
const jsonfile = require("jsonfile");
const invalidUserMsg = "Yeah... um sweaty? That's not a valid username. K thx.";
const file = "../data.json";
const { getUserIdFromMsg, getTimeLeft } = require("./utils");
const bot = new Eris.CommandClient(
  process.env.BOT_TOKEN,
  {},
  {
    description: "Checks your vibe",
    owner: "Alexander Cardosi",
    prefix: "!"
  }
);
// Global array that stores the users that are still being cooled down.
let coolDownUsers = [];

bot.on("ready", () => {
  // When the bot is ready
  console.log("Ready!"); // Log "Ready!"
});

bot.registerCommandAlias("halp", "help"); // Alias !halp to !help

bot.registerCommand(
  "score",
  msg => {
    const guild = msg.channel.guild;

    // Score file
    let obj = jsonfile.readFileSync(file);

    // Convert object into an array then sort it
    const sortedArr = Object.entries(obj).sort((a, b) => b[1] - a[1]);

    // Convert the array back into an object called objSorted
    let objSorted = {};
    sortedArr.forEach(function(item) {
      objSorted[item[0]] = item[1];
    });

    // Create a template literal that will contain the score messages
    let score = ``;

    for (let key in objSorted) {
      const member = guild.members.get(key);
      let username = "<Not a user>";
      if (member !== undefined) {
        username = member.username;
      }
      score += `\n${username}'s score is ${obj[key]}`;
    }
    return score;
  },
  {
    description: "Karma score of every user",
    fullDescription: "Displays all karma scores for every user"
  }
);

bot.registerCommand(
  "vibecheck",
  (msg, args) => {
    // Make an echo command
    if (args.length === 0) {
      // If the user just typed "!echo", say "Invalid input"
      return "Invalid input";
    }
    const guild = msg.channel.guild;
    const mention = args[0];
    const userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
    const member = guild.members.get(userId);

    const userIsInGuild = !!member;
    if (!userIsInGuild) {
      return msg.channel.createMessage(invalidUserMsg);
    }

    if (
      Math.round(Math.random()) === 1 &&
      mention !== "<@194997493078032384>"
    ) {
      return `${mention} passed the vibecheck`;
    } else {
      return `${mention} has failed the vibecheck`;
    }
  },
  {
    description: "Vibechecks a user",
    fullDescription:
      "Give a username as the first argument and see whether or not they pass the vibecheck.",
    usage: "<mention>"
  }
);

async function vote(type, msg, args) {
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
    coolDownUsers.forEach(coolDownUser => {
      if (coolDownUser.userId === msg.author.id) {
        const timeLeft = getTimeLeft(coolDownUser.timeout);
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft - minutes * 60;

        timeLeftMsg = `You must wait ${minutes}m ${seconds}s before doing that again`;
      }
    });
    return timeLeftMsg;
  } else {
    const timeout = setTimeout(() => {
      // If the user is in the coolDownUsers array, remove them from it.
      const index = coolDownUsers.indexOf(msg.author.id);
      if (index !== -1) coolDownUsers.splice(index, 1);
    }, 180000); // 3 minutes
    coolDownUsers.push({ userId: msg.author.id, timeout: timeout });
  }

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
}

bot.registerCommand(
  "upvote",
  async (msg, args) => {
    return await vote("upvote", msg, args);
  },
  {
    description: "Upvotes a user",
    fullDescription:
      "Upvotes a user by their username. If a username is not given, the last user to send a message gets an upvote",
    usage: "<[mention]>"
  }
);

bot.registerCommand(
  "downvote",
  async (msg, args) => {
    return await vote("downvote", msg, args);
  },
  {
    description: "Downvotes a user",
    fullDescription:
      "Downvote a user by their username. If a username is not given, the last user to send a message gets a downvote",
    usage: "<[mention]>"
  }
);

bot.registerCommandAlias("u", "upvote");
bot.registerCommandAlias("d", "downvote");

bot.connect();
