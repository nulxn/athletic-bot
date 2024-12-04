console.clear();

console.log("Command Registration Tool\n");

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

import dotenv from "dotenv";
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let commands = [];

const commandsFolder = fs.readdirSync(path.join(__dirname, "commands"));
commands.push(
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all available commands.")
    .toJSON()
);

await Promise.all(
  commandsFolder.map(async (folder) => {
    console.log(`\nLoading ${folder} commands...`);

    const commandFiles = fs
      .readdirSync(path.join(__dirname, "commands", folder))
      .filter((file) => file.endsWith(".js"));

    await Promise.all(
      commandFiles.map(async (file) => {
        const command = await import(
          `file://${path.join(__dirname, "commands", folder, file)}`
        );

        console.log(`Loaded ${command.default.data.name} from ${file}`);
        commands.push(command.default.data.toJSON());
      })
    );
  })
);

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("\nRegistering " + commands.length + " commands...");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully registered commands!");
  } catch (error) {
    console.error(error);
  }
})();
