import dotenv from "dotenv";
dotenv.config();

import { REST, Routes } from "discord.js";

const commands = [
  {
    name: "purr",
    description: "Replies with Purr!",
  },
  {
    name: "rps",
    description: "Starts Game of Rock Paper Scissors!",
  },
  {
    name: "join-rps",
    description: "Joins the Rock Paper Scissors game!",
  },
  {
    name: "begin-rps",
    description: "Begins the Rock Paper Scissors game!",
  },
  {
    name: "del-rps",
    description: "Deletes the current Rock Paper Scissors game!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
