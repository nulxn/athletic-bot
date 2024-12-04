console.clear();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";

import { init } from "./db";
init();

import dotenv from "dotenv";
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.commands = new Collection();

const commandsFolder = fs.readdirSync(path.join(__dirname, "commands"));
client.commands.set("help", {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all available commands."),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Available Commands")
          .addFields(
            await Promise.all(
              commandsFolder.map(async (folder) => {
                const commandFiles = fs
                  .readdirSync(path.join(__dirname, "commands", folder))
                  .filter((file) => file.endsWith(".js"));

                const commands = await Promise.all(
                  commandFiles.map(async (file) => {
                    const command = await import(
                      `file://${path.join(__dirname, "commands", folder, file)}`
                    );

                    return `\`${command.default.data.name}\` - ${command.default.data.description}`;
                  })
                );

                return {
                  name: folder,
                  value: commands.join("\n"),
                  inline: true,
                };
              })
            )
          )
          .setColor("#5865F2")
          .setFooter({ text: "Made with ❤️ by nolan." })
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  },
});

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
        client.commands.set(command.default.data.name, command.default);
      })
    );
  })
);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

let guilds = [];
client.once(Events.ClientReady, () => {
  console.log(`\nLogged in as ${client.user.tag}`);
  client.guilds.cache.forEach((guild) => {
    console.log(`- ${guild.name}`);
    guilds.push(guild);
  });
});

client.login(process.env.TOKEN);
