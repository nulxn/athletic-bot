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
  ActivityType,
} from "discord.js";

import {
  init,
  getUserById,
  getUserWithAthletes,
  getAllAthletes,
  footers
} from "./db.js";
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
          .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
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

import express from "express";
const app = express();

const PORT = 3000;

import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: PORT + 1 });

let connectedIds = [];
let connectedSockets = new Set();

let guilds = [];

client.once(Events.ClientReady, (readyUser) => {
  console.log(`\nLogged in as ${client.user.tag}`);
  client.guilds.cache.forEach((guild) => {
    console.log(`- ${guild.name}`);
    guilds.push(guild);
  });

  readyUser.user.setPresence({
    activities: [
      { name: "nicholas scroll on reels", type: ActivityType.Watching },
    ],
    status: "dnd",
  });

  const sitePath = path.join(__dirname, "site");
  app.use(express.static(sitePath));

  app.get("/api/user/details", async (req, res) => {
    res.json({ user: await getUserById(req.query.id) });
  });

  app.get("/api/user/athletes", async (req, res) => {
    res.json({ user: await getUserWithAthletes(req.query.id) });
  });

  let currentlyDrafting = false;
  let currentPicker = "1167471500366970950";

  wss.on("connection", (ws) => {
    connectedSockets.add(ws);

    ws.on("close", () => {
      connectedSockets.delete(ws);
    });

    ws.on("message", (message) => {
      const messageStr = message.toString("utf8");
      let data = JSON.parse(messageStr);
      let type = data.type;

      if (type === "draftPick") {
        let athlete = data.pick;
        let picker = data.picker;
        let name = data.name;

        if (picker !== currentPicker) {
          ws.send(
            JSON.stringify({
              type: "error",
              data: "It is not your turn to pick.",
            })
          );
        } else {
          connectedSockets.forEach((socket) => {
            socket.send(
              JSON.stringify({
                type: "draftPickComplete",
                data: { name, athlete },
              })
            );
          });
        }
      } else if (type === "start") {
        connectedIds.push(data.data);
      }
    });

    ws.send(JSON.stringify({ type: "validPicks", data: getAllAthletes() }));
  });

  app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${PORT}`);
  });
});

client.login(process.env.TOKEN);
