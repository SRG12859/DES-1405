require("dotenv").config();
const { Client, Events, GatewayIntentBits } = require("discord.js");
let msgCatVoice = ["Meow", "Nya", "Nyan", "Purr", "Myaoon", "Nyaan"];
let playersRPS = [];
let rpsON = false;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;
  let catVoiceRegex = /(meow|nya|purr|myaoon|nyaan)/i;
  if (catVoiceRegex.test(message.content)) {
    message.reply(msgCatVoice[Math.floor(Math.random() * msgCatVoice.length)]);
  }
});
client.on(Events.InteractionCreate, async (interaction) => {
  let RPS_C = interaction.channelId === process.env.RPS_CHANNEL;
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "purr") {
      await interaction.reply(
        msgCatVoice[Math.floor(Math.random() * msgCatVoice.length)] + "!!!!!",
      );
    }
    if (interaction.commandName === "rps") {
      if (!rpsON && RPS_C) {
        rpsON = true;
        await interaction.reply(
          `Let's Play Rock, Paper, Scissors!! ${msgCatVoice[Math.floor(Math.random() * msgCatVoice.length)]}!!!!`,
        );
      } else if (!RPS_C) {
        await interaction.reply(
          "Please go to Rock, Paper, Scissors channel to start a game!",
        );
      } else {
        await interaction.reply(
          "A Rock, Paper, Scissors game is already ongoing! Please join the current game or wait for it to finish!",
        );
      }
    }

    if (interaction.commandName === "join-rps") {
      if (!RPS_C) {
        await interaction.reply("Command only works on RPS Channel! Sorry!");
      } else if (!rpsON && RPS_C) {
        await interaction.reply(
          "No Rock, Paper, Scissors game is currently active! Sorry!",
        );
      } else {
        let playerExists = playersRPS.includes(interaction.user.username);
        //    let playerExists = false;
        if (playerExists) {
          await interaction.reply(
            "You are already in the game! DON'T U DARE AGAIN ANNOY ME!",
          );
        } else {
          playersRPS.push(interaction.user.username);
          await interaction.reply(
            `@${interaction.user.username.toString()} has joined the Rock, Paper, Scissors game!`,
          );
          await interaction.channel.send(
            `Current Players: ${playersRPS.join(", ")}`,
          );
        }
      }
    }
    if (interaction.commandName === "begin-rps") {
      if (!RPS_C) {
        await interaction.reply("Command only works on RPS Channel! Sorry!");
      } else if (!rpsON && RPS_C) {
        await interaction.reply(
          "No Rock, Paper, Scissors game is currently active! Sorry!",
        );
      } else if (playersRPS.length < 2) {
        await interaction.reply(
          "Not enough players have joined the game! At least 2 players are required to start the game!",
        );
      } else {
        await interaction.channel.send("Lets Get Rolling!!! Shall We!?!");
        let RPSChoices = ["Rock 💎🪨", "Paper 🧻", "Scissors ✂️"];
        let playersWithChoices = [];
        for (const e of playersRPS) {
          playersWithChoices.push({
            player: e,
            choice: RPSChoices[Math.floor(Math.random() * RPSChoices.length)],
          });
          await interaction.channel.send(
            `@${playersWithChoices[playersWithChoices.length - 1]?.player.toString()} rolled ${playersWithChoices[playersWithChoices.length - 1]?.choice}`,
          );
        }
        // declaring the victory holder with a placeholder looping through playersWithChoices to determine winner
        let victoryHolder = "";
        let victoryDraw = "";
        let isDraw = false;
        for (let j = 1; j < playersWithChoices.length; j++) {
          const cP = playersWithChoices[j - 1];
          const nP = playersWithChoices[j];
          let paperRegex = /(Paper)/i;
          let rockRegex = /(Rock)/i;
          let scissorsRegex = /(Scissors)/i;
          if (
            (cP.choice.match(paperRegex) && nP.choice.match(rockRegex)) ||
            (cP.choice.match(scissorsRegex) && nP.choice.match(paperRegex)) ||
            (cP.choice.match(rockRegex) && nP.choice.match(scissorsRegex))
          ) {
            isDraw = false;
            victoryHolder = cP.player;
            victoryDraw = cP.choice;
          }
          if (
            (nP.choice.match(paperRegex) && cP.choice.match(rockRegex)) ||
            (nP.choice.match(scissorsRegex) && cP.choice.match(paperRegex)) ||
            (nP.choice.match(rockRegex) && cP.choice.match(scissorsRegex))
          ) {
            isDraw = false;
            victoryHolder = nP.player;
            victoryDraw = nP.choice;
          }
          if (nP.choice === cP.choice) {
            isDraw = true;
          }
        }
        if (isDraw) {
          await interaction.channel.send(
            "It's a draw! No one wins this round. 📏📐",
          );
        } else {
          await interaction.channel.send(
            `@${victoryHolder.toString()} wins this round with ${victoryDraw.toString()}! 🎀`,
          );
        }
        await interaction.channel.send(
          "Thanks for playing Rock, Paper, Scissors! use /del-rps to end the current game.",
        );
      }
    }
    if (interaction.commandName === "del-rps") {
      if (!RPS_C) {
        await interaction.reply("Command only works on RPS Channel! Sorry!");
      } else if (!rpsON && RPS_C) {
        await interaction.reply(
          "No Rock, Paper, Scissors game is currently active! Sorry!",
        );
      } else {
        rpsON = false;
        playersRPS = [];
        await interaction.reply(
          "The current Rock, Paper, Scissors game has been deleted! You can start a new game with /rps command!",
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
});
// Log in to Discord with your client's token
client.login(process.env.TOKEN);
