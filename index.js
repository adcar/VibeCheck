const jsonfile = require("jsonfile");
const file = process.argv[2];
const vote = require("./vote.js");
const bot = require("./bot.js");
const errorMsgs = require("./errorMsgs");

bot.on("ready", () => {
  // When the bot is ready
  console.log("Ready!"); // Log "Ready!"
});

bot.registerCommandAlias("halp", "help"); // Alias !halp to !help

bot.registerCommand(
  "score",
  (msg) => {
    const guild = msg.channel.guild;

    // Score file
    let obj = jsonfile.readFileSync(file);

    // Convert object into an array then sort it
    const sortedArr = Object.entries(obj).sort((a, b) => b[1] - a[1]);

    // Convert the array back into an object called objSorted
    let objSorted = {};
    sortedArr.forEach(function (item) {
      objSorted[item[0]] = item[1];
    });

    // Create a template literal that will contain the score messages
    let score = ``;

    for (let key in objSorted) {
      const member = guild.members.get(key);
      let username = "";
      if (member !== undefined) {
        username = member.username;
      }

      if (username !== "") {
	  score += `\n${username}'s score is ${obj[key]}`;
      }
    }
    return score;
  },
  {
    description: "Karma score of every user",
    fullDescription: "Displays all karma scores for every user",
  }
);

bot.registerCommand(
  "vibecheck",
  (msg, args) => {
    if (args.length === 0) {
      return errorMsgs.argumentRequired;
    }
    const guild = msg.channel.guild;
    const mention = args[0];
    const userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
    const member = guild.members.get(userId);

    const userIsInGuild = !!member;
    if (!userIsInGuild) {
      return msg.channel.createMessage(errorMsgs.invalidUserMsg);
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
    usage: "<mention>",
  }
);

bot.registerCommand(
  "upvote",
  async (msg, args) => {
    return await vote("upvote", msg, args, file);
  },
  {
    description: "Upvotes a user",
    fullDescription:
      "Upvotes a user by their username. If a username is not given, the last user to send a message gets an upvote",
    usage: "<[mention]>",
  }
);

bot.registerCommand(
  "downvote",
  async (msg, args) => {
    return await vote("downvote", msg, args, file);
  },
  {
    description: "Downvotes a user",
    fullDescription:
      "Downvote a user by their username. If a username is not given, the last user to send a message gets a downvote",
    usage: "<[mention]>",
  }
);

bot.registerCommandAlias("u", "upvote");
bot.registerCommandAlias("d", "downvote");

bot.registerCommand(
  "gold",
  async (msg, args) => {
    return await vote("upvote", msg, args, file, "gold");
  },
  {
    description: "Gilds a user with g-g-gold!",
    fullDescription:
      "Guild a user by their username. If a username is not given, the last user to send a message gets the medal",
    usage: "<[mention]>",
  }
);

bot.registerCommand(
  "plat",
  async (msg, args) => {
    return await vote("upvote", msg, args, file, "plat");
  },
  {
    description: "Oh my... is that... plat???!?!?!?!?",
    fullDescription:
      "Guild a user by their username. If a username is not given, the last user to send a message gets the medal",
    usage: "<[mention]>",
  }
);

bot.connect();
