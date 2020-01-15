const Eris = require("eris");
const jsonfile = require("jsonfile");
const invalidUserMsg = "Yeah... um sweaty? That's not a valid username. K thx.";
const file = "../data.json";
var bot = new Eris.CommandClient(
  process.env.BOT_TOKEN,
  {},
  {
    description: "Checks your vibe",
    owner: "Alexander Cardosi",
    prefix: "!"
  }
);

bot.on("ready", () => {
  // When the bot is ready
  console.log("Ready!"); // Log "Ready!"
});

bot.registerCommandAlias("halp", "help"); // Alias !halp to !help

bot.registerCommand(
  "score",
  (msg, args) => {
    const guild = msg.channel.guild;
    obj = jsonfile.readFileSync(file);

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

    if (Math.round(Math.random()) == 1 && mention !== "<@194997493078032384>") {
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

function vote(type, userId, authorId) {
  if (authorId === userId) {
    return null;
  }
  obj = jsonfile.readFileSync(file);
  if (coolDownUsers.includes(authorId)) {
    return null;
  } else {
    coolDownUsers.push(authorId);
    setTimeout(() => {
      const index = coolDownUsers.indexOf(authorId);
      if (index !== -1) coolDownUsers.splice(index, 1);
    }, 180000); // 3 minutes
  }
  if (!obj[userId]) {
    obj[userId] = 0;
  }

  if (type === "upvote") {
    obj[userId]++;
    jsonfile.writeFileSync(file, obj);
    return obj[userId];
  }
  if (type === "downvote") {
    obj[userId]--;
    jsonfile.writeFileSync(file, obj);
    return obj[userId];
  }
}

async function getUserIdFromMsg(msg, upvote) {
  const lastMsgs = await msg.channel.getMessages(100, msg.id);
  const userId = msg.author.id;
  let msgToBeVoted;
  lastMsgs.forEach(msg => {
    if (msg.author.id !== bot.user.id && msg.author.id !== userId) {
      msgToBeVoted = msg;
    }
  });
  if (msgToBeVoted) {
    if (upvote) {
      msgToBeVoted.addReaction("⬆");
    } else {
      msgToBeVoted.addReaction("⬇");
    }

    return msgToBeVoted.author.id;
  } else {
    return null;
  }
}

let coolDownUsers = [];
bot.registerCommand(
  "upvote",
  async (msg, args) => {
    let userId;
    if (args.length === 0) {
      userId = await getUserIdFromMsg(msg, true);
      if (userId === null) {
        return msg.channel.createMessage("Couldn't find a message to upvote");
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
    const result = await vote("upvote", userId, msg.author.id);
    if (result === null) {
      return "fuck off";
    }
    return `An upvote? Very cool. ${member.username}'s score is now ${result}`;
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
    let userId;
    if (args.length === 0) {
      userId = await getUserIdFromMsg(msg, false);
      if (userId === null) {
        return msg.channel.createMessage("Couldn't find a message to upvote");
      }
    } else {
      const mention = args[0];
      userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
    }
    const guild = msg.channel.guild;
    const mention = args[0];
    const member = guild.members.get(userId);

    const userIsInGuild = !!member;
    if (!userIsInGuild) {
      return msg.channel.createMessage(invalidUserMsg);
    }
    const result = await vote("downvote", userId, msg.author.id);
    if (result === null) {
      return "fuck off";
    }
    return `Oof ouchie a downvote! ${member.username}'s score is now ${result}`;
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
