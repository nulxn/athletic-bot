import { SlashCommandBuilder } from "discord.js";
import { exec } from "child_process";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong! Registering commands...");

    exec("node ~/athletic-bot/register.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    });
  },
};
