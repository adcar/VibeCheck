const Eris = require("eris");
const jsonfile = require("jsonfile");

const file = "./data.json";
jsonfile
  .readFile(file)
  .then(obj => console.dir(obj))
  .catch(error => console.error(error));

var bot = new Eris.CommandClient(
  "NjQzNTUzOTU0MDMwMTU3ODQ1.XcnKmw._M-hioIFH_7SqaeRQ47TFdViKyY",
  {},
  {
    description: "A test bot made with Eris",
    owner: "somebody",
    prefix: "!"
  }
);

bot.on("ready", () => {
  // When the bot is ready
  console.log("Ready!"); // Log "Ready!"
});

bot.registerCommandAlias("halp", "help"); // Alias !halp to !help

bot.registerCommand("ping", "Pong!", {
  // Make a ping command
  // Responds with "Pong!" when someone says "!ping"
  description: "Pong!",
  fullDescription:
    "This command could be used to check if the bot is up. Or entertainment when you're bored."
});

bot.registerCommand("pong", ["Pang!", "Peng!", "Ping!", "Pung!"], {
  // Make a pong command
  // Responds with a random version of "Ping!" when someone says "!pong"
  description: "Ping!",
  fullDescription:
    "This command could also be used to check if the bot is up. Or entertainment when you're bored."
});

var echoCommand = bot.registerCommand(
  "echo",
  (msg, args) => {
    // Make an echo command
    if (args.length === 0) {
      // If the user just typed "!echo", say "Invalid input"
      return "Invalid input";
    }
    var text = args.join(" "); // Make a string of the text after the command label
    return text; // Return the generated string
  },
  {
    description: "Make the bot say something",
    fullDescription: "The bot will echo whatever is after the command label.",
    usage: "<text>"
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
    const username = args[0];
    if (!args[0].includes("@")) {
      return "Not a valid fucking username you fucking incel. Fuck you and your toxic masculinity god I fucking hate people like you (although i do NOT believe in 'God' as I am an athiest.)";
    }
    if (username.includes("Alex") || username.includes("alex")) {
      return `${username} passed the vibecheck`;
    }
    if (Math.round(Math.random()) == 1) {
      return `${username} passed the vibecheck`;
    } else {
      return `${username} has failed the vibecheck`;
    }
  },
  {
    description: "Make the bot say something",
    fullDescription: "The bot will echo whatever is after the command label.",
    usage: "<text>"
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
    const username = args[0];
    if (!args[0].includes("@")) {
      return "Not a valid fucking username you fucking incel. Fuck you and your toxic masculinity god I fucking hate people like you (although i do NOT believe in 'God' as I am an athiest.)";
    }
    const result = await vote("upvote", username);
    return `An upvote? Very cool. ${username}'s score is now ${result}`;
  },
  {
    description: "Make the bot say something",
    fullDescription: "The bot will echo whatever is after the command label.",
    usage: "<text>"
  }
);

var downvote = bot.registerCommand(
  "downvote",
  async (msg, args) => {
    if (args.length === 0) {
      // If the user just typed "!echo", say "Invalid input"
      return "Invalid input";
    }
    const username = args[0];
    if (!args[0].includes("@")) {
      return "Not a valid fucking username you fucking incel. Fuck you and your toxic masculinity god I fucking hate people like you (although i do NOT believe in 'God' as I am an athiest.)";
    }
    const result = await vote("downvote", username);
    return `Oof ouchie a downvote! ${username}'s score is now ${result}`;
  },
  {
    description: "Make the bot say something",
    fullDescription: "The bot will echo whatever is after the command label.",
    usage: "<text>"
  }
);

echoCommand.registerSubcommand(
  "reverse",
  (msg, args) => {
    // Make a reverse subcommand under echo
    if (args.length === 0) {
      // If the user just typed "!echo reverse", say "Invalid input"
      return "Invalid input";
    }
    var text = args.join(" "); // Make a string of the text after the command label
    text = text
      .split("")
      .reverse()
      .join(""); // Reverse the string
    return text; // Return the generated string
  },
  {
    description: "Make the bot say something in reverse",
    fullDescription:
      "The bot will echo, in reverse, whatever is after the command label.",
    usage: "<text>"
  }
);

echoCommand.registerSubcommandAlias("backwards", "reverse"); // Alias "!echo backwards" to "!echo reverse"

bot.connect();
