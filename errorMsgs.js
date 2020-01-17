module.exports = {
  invalidUserMsg: "Yeah... um sweaty? That's not a valid username. K thx.",
  noValidMessageFound: "Couldn't find a valid message to vote on.",
  noSelfVoting: "You can't vote on yourself cringe normie",
  argumentRequired: "You must give at least one argument",
  cooldown(minutes, seconds) {
    return `You must wait ${minutes}m ${seconds}s before doing that again`;
  }
};
