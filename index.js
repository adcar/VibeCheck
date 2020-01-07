const Eris = require("eris");
const jsonfile = require("jsonfile");
const invalidUserMsg =
  "Not a valid fucking username you fucking incel. Fuck you and your toxic masculinity god I fucking hate people like you (although i do NOT believe in 'God' as I am an athiest.)";
const file = "./data.json";
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
    obj = jsonfile.readFileSync(file);
    return JSON.stringify(obj);
  },
  {
    description: "Karma score of every user",
    fullDescription: "Displays all karma scores for every user"
  }
);

var vibeCheck = bot.registerCommand(
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
    
    if (Math.round(Math.random()) == 1 && mention !== "<@194997493078032384>"){
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

function vote(type, username) {
  obj = jsonfile.readFileSync(file);

  if (!obj[username]) {
    obj[username] = 0;
  }

  if (type === "upvote") {
    obj[username]++;
    jsonfile.writeFileSync(file, obj);
    return obj[username];
  }
  if (type === "downvote") {
    obj[username]--;
    jsonfile.writeFileSync(file, obj);
    return obj[username];
  }
}
var upvote = bot.registerCommand(
  "upvote",
  async (msg, args) => {
    // read from file

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
    const result = await vote("upvote", mention);
    return `An upvote? Very cool. ${mention}'s score is now ${result}`;
  },
  {
    description: "Upvotes a user",
    fullDescription: "Upvotes a user by their username",
    usage: "<mention>"
  }
);

var downvote = bot.registerCommand(
  "downvote",
  async (msg, args) => {
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
    const result = await vote("downvote", mention);
    return `Oof ouchie a downvote! ${mention}'s score is now ${result}`;
  },
  {
    description: "Downvotes a user",
    fullDescription: "Downvote a user by their username",
    usage: "<mention>"
  }
);

bot.registerCommandAlias("u", "upvote");
bot.registerCommandAlias("d", "downvote");

bot.connect();
