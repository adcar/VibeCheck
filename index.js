const jsonfile = require("jsonfile");
const AsciiTable = require("ascii-table");
const file = process.argv[2];
const vote = require("./vote.js");
const bot = require("./bot.js");
const errorMsgs = require("./errorMsgs");
const { banish } = require("@favware/zalgo");

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
    let scores = jsonfile.readFileSync(file);

    const table = new AsciiTable();
    table.setHeading("Rank", "Username", "Score");

    const userIDs = [];

    // make a list of userIDs to fetch later
    for (let key in scores) {
      userIDs.push(key);
    }

    return guild.fetchMembers({ userIDs }).then((members) => {
      members.sort((a, b) => (scores[b.id] > scores[a.id] ? 1 : -1));
      members.forEach((member, index) => {
        console.log(member);
        const score = scores[member.id];
        let formattedScore;
        if (score < 0) {
          formattedScore = AsciiTable.alignCenter(scores[member.id], 5);
        } else {
          formattedScore = AsciiTable.alignCenter(scores[member.id], 6);
        }
        table.addRow(
          AsciiTable.alignCenter(index + 1, 5),
          banish(member.user.username),
          formattedScore
        );
      });

      return "```\n" + table.toString() + "```";
    });
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
